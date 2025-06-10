import React, { FC } from 'react'
import styles from '../QuestionComponents/QuestionInput.module.scss'


type PropsType = {
    fe_id:string,
    props: {
        title:string
        placeholder?: string
    }
}

const QuestionInput: FC<PropsType> = ({fe_id,props}) => {
  const { title, placeholder='' }=props

  return <>
  <p>{title}</p>
  <div className={styles.inputWrapper}>
    <input name={fe_id} placeholder={placeholder}></input>
  </div>
  </>
  
}

export default QuestionInput
