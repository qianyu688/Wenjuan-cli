import React from "react";

import PageWrapper from "@/components/PageWrapper";
import styles from '../../styles/Question.module.scss'
import { getQuestionById } from "@/services/question";
import { getComponent } from "@/components/QuestionComponents";
//[id].tsx id是动态参数，会根据传入的参数id进行url的访问

type PropsType={
    // id:string
    errno:number,
    data?:{
        id:string
        title:string
        desc?:string
        js?:string
        css?:string
        isPublished:boolean
        isDeleted:boolean
        componentList:Array<any>
    }
    msg?:string
}

export default function Question(props:PropsType){

    const { errno, msg = '', data} = props
    const { id, title = '', isDeleted, desc,isPublished ,componentList = []} = data || {}

    // 数据错误的情况
    if(errno!==0){
        return <PageWrapper title='错误'>
            <h1>错误</h1>
            <p>{msg}</p>
        </PageWrapper>
    }
    // 问卷已经被删除的情况
    if(isDeleted){
        return <PageWrapper title={title} desc={desc}>
            <h1>{title}</h1>
            <p>该问卷已被删除</p>
        </PageWrapper>
    }
    //尚未发布的情况
    if(!isPublished){
        return <PageWrapper title={title} desc={desc}>
            <h1>{title}</h1>
            <p>该问卷尚未发布</p>
        </PageWrapper>
    }

    //便利组件
    const ComponentListElem=<>
        {componentList.map(c => {
            const ComponentElem = getComponent(c)
            return <div key={c.fe_id} className={styles.componentWrapper}>
                {ComponentElem}
            </div>
        })}
    </>

    return <PageWrapper title={title} desc={desc}>
        {/* 提交之后数据会到这个answer里面去 */}
        <form method="post" action='/api/answer'>
            {/* //隐藏了之后看不见id，但是依然存在，在提交时可以提交 */}
            <input name="questionId" defaultValue={id} type="hidden"/> 
            
            {ComponentListElem}
            
            <div className={styles.submitBtnContainer}>
                <button type="submit">提交</button>
            </div>
        </form>
    </PageWrapper>
}

//获取url参数后面的id，作为props传给Question
export async function getServerSideProps(context:any) {
    const {id = ''} = context.params

    //根据 id await 获取问卷数据
    const data = await getQuestionById(id)

    return {
        props:data
}
}