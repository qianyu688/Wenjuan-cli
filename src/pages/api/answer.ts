// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { postAnswer } from "@/services/answer";

function genAnswerInfo(reqBody:any){
    const answerList:any[] = []

    Object.keys(reqBody).forEach(key=>{
        if(key==='questionId') return //这里的目的是为了把提交数据中的QuestionID和其他表单数据区分开来
        answerList.push({
            componentId:key,
            value:reqBody[key]
        })
    })

    return {
        questionId: reqBody.questionId || '',
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
