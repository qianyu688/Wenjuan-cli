import React, { FC,CSSProperties } from 'react'


type PropsType = {
    // fe_id:string,//不需要，因为tlte是展示作用，不用提交，就不需要name的id
        text:string
        level: number
        isCenter?:boolean
}

const QuestionTitle: FC<PropsType> = (props) => {
  const { text, level,isCenter }=props

  //样式
  const style: CSSProperties = {}
    if (isCenter) {
        style.textAlign = 'center'
    }

    if(level ===1) return <h1 style={style}>{text}</h1>
    if(level ===2) return <h2 style={style}>{text}</h2>
    if(level ===3) return <h3 style={style}>{text}</h3>
  

  return null
  
}

export default QuestionTitle
