import React, { useEffect, useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import styles from '../../styles/Question.module.scss'
import { getQuestionById } from "@/services/question";
import { getComponent } from "@/components/QuestionComponents";
import { useRouter } from "next/router";

type PropsType={
    errno:number,
    data?:{
        _id:string
        title:string
        desc?:string
        js?:string
        css?:string
        isPublished:boolean
        isDeleted:boolean
        componentList:Array<any>
        isAnonymous?: boolean;
    }
    msg?:string
}

export default function Question(props:PropsType){
    const router = useRouter();
    const { errno, msg = '', data} = props
    const { _id:id, title = '', isDeleted, desc, isPublished, isAnonymous, componentList = []} = data || {}

    // 身份状态与拦截逻辑
    const [studentInfo, setStudentInfo] = useState({ studentId: '', major: '', department: '' });
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const infoStr = localStorage.getItem('studentInfo');
        if (!infoStr) {
            router.push(`/login?redirect=/question/${id}`);
        } else {
            setStudentInfo(JSON.parse(infoStr));
            setIsChecking(false); 
        }
    }, [id, router]);

    // 1. 拦截未验证状态
    if (isChecking) {
        return <PageWrapper title="验证中"><div style={{textAlign: 'center', marginTop: '50px'}}>正在验证身份...</div></PageWrapper>
    }

    // 2. 拦截异常状态（容错处理，防止白屏）
    if (errno !== 0) {
        return <PageWrapper title="错误"><div style={{textAlign: 'center', marginTop: '50px'}}>{msg}</div></PageWrapper>
    }
    if (isDeleted) {
        return <PageWrapper title="已删除"><div style={{textAlign: 'center', marginTop: '50px'}}>该问卷已被删除</div></PageWrapper>
    }
    if (!isPublished) {
        return <PageWrapper title="未发布"><div style={{textAlign: 'center', marginTop: '50px'}}>该问卷尚未发布</div></PageWrapper>
    }

    // 3. 核心修复：遍历解析组件对象为真正的 React 节点
    const ComponentListElem = <>
        {componentList.map(c => {
            const ComponentElem = getComponent(c)
            if (!ComponentElem) return null
            
            return (
                <div key={c.fe_id} style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
                    {ComponentElem}
                </div>
            )
        })}
    </>

    return <PageWrapper title={title} desc={desc}>
        <form method="post" action='/api/answer'>
            <input name="questionId" defaultValue={id} type="hidden"/> 
            <input name="isAnonymous" defaultValue={isAnonymous ? 'true' : 'false'} type="hidden"/> {/* 传入匿名标志 */}
            {/* 隐藏的学生身份字段 */}
            <input name="studentId" defaultValue={studentInfo.studentId} type="hidden"/> 
            <input name="major" defaultValue={studentInfo.major} type="hidden"/> 
            <input name="department" defaultValue={studentInfo.department} type="hidden"/> 

            {/* 这里不再直接渲染对象数组，而是渲染解析好的 React 元素 */}
            {ComponentListElem}
            
            <div className={styles.submitBtnContainer}>
                <button type="submit">提交</button>
            </div>
        </form>
    </PageWrapper>
}

// 获取url参数后面的id，作为props传给Question
export async function getServerSideProps(context:any) {
    const {id = ''} = context.params
    const data = await getQuestionById(id)

    return {
        props:data
    }
}