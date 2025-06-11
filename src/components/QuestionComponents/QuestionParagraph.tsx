import React, { FC,CSSProperties } from 'react'

type PropsType = {
    // fe_id:string,//不需要，因为tlte是展示作用，不用提交，就不需要name的id
        text:string
        isCenter?:boolean
}

const QuestionParagraph: FC<PropsType> = (props) => {
  const { text,isCenter }=props

  //样式
  const style: CSSProperties = {}
    if (isCenter) {
        style.textAlign = 'center'
    }
    
  //换行
  const textList = text.split('\n') 
  return <p>
    {textList.map((t, index) => (
        <span key={index}>
          {index > 0 && <br />}
          {t}
        </span>
      ))}
  </p>
      


  return null
  
}

export default QuestionParagraph
