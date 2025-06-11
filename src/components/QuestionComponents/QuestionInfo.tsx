import React, { FC,CSSProperties } from 'react'


type PropsType = {
    title:string
    desc?:string
}

const QuestionInfo: FC<PropsType> = (props) => {
  const { title, desc }=props

  return <div style={{textAlign:'center'}}>
    <h1>{title}</h1>
    <p>{desc}</p>
  </div>
}

export default QuestionInfo
