// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { postAnswer } from "@/services/answer";

function genAnswerInfo(reqBody:any){
    const answerList:any[] = []

    // 定义哪些字段是“系统字段”，不能当成答题组件解析
    const systemFields = ['questionId', 'studentId', 'major', 'department','isAnonymous'];

    Object.keys(reqBody).forEach(key=>{
        if(systemFields.includes(key)) return 
        
        // 组装成后端 AnswerSchema 需要的格式
        answerList.push({
            componentFeId: key, // 注意：改成了 componentFeId，对齐后端 Schema
            // 为了防止单选传字符串、多选传数组的问题，统一转成数组
            value: Array.isArray(reqBody[key]) ? reqBody[key] : [reqBody[key]]
        })
    })
    // 核心匿名逻辑：如果开启匿名，抹除学号，但保留专业用于宏观统计
    const isAnon = reqBody.isAnonymous === 'true';

    // 返回完全符合后端 CreateAnswerDto 的数据结构
    return {
        questionId: reqBody.questionId || '',
        studentId: isAnon ? '匿名用户' : (reqBody.studentId || ''),
        major: reqBody.major || '',
        department: reqBody.department || '',
        answerList
    }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if(req.method !== 'POST') {
        //不是POST 则返回错误
        res.status(200).json({errno:-1,msg: 'Method 错误'})
    }

    //获取H5页面的提交数据
    const answerInfo =  genAnswerInfo(req.body)
    console.log('Body的值',answerInfo)

    
    try{
        //提交到服务端 Mock
        const resData = await postAnswer(answerInfo)
        console.log('123123123',resData);
        
        //如果成功--跳转页面
        if(resData.errno === 0){
            res.redirect('/success')
        }else{
            //失败
            res.redirect('/fail')
        }
        
    }catch(err){
        //失败
        res.redirect('/fail')
    }
    
    res.status(200).json({errno:0})
    
}
