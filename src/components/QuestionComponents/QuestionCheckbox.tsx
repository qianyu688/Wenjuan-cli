import React, { FC, useEffect, useState } from 'react'
import styles from '../QuestionComponents/QuestionCheckbox.module.scss'


type PropsType = {
    fe_id:string,
    props: {
        title:string
        isVertical?: boolean
        list:Array<{
            value:string
            text:string
            checked:boolean
        }>
    }
}

const QuestionCheckbox: FC<PropsType> = ({fe_id, props}) => {
  const { title, list=[],isVertical}=props
  const [selectedValues,setSelectedValue] = useState<string[]>([])

  //初始化默认选中状态
  useEffect(()=>{
    list.forEach(item =>{
        const { value, checked } =item
        if(checked) {
            setSelectedValue(selectedValues=>selectedValues.concat(value))
        }
    })
  },[list])

  function toggleChecked(value:string){
    if(selectedValues.includes(value)){
        //已经包含说明已被选择，那么再次点击就是取消选中
        setSelectedValue(selectedValues=>selectedValues.filter(
            v=> v!==value
        ))}
        else{
            //选择
            setSelectedValue(selectedValues.concat(value))
        }
    }

  return <>
  <p>{title}</p>
  <input type='hidden' name={fe_id} value={selectedValues.toString()} />
  <ul className={styles.list}>
    {/* //这里是要把list中的参数都解构便利出来*/}
    {list.map(item=>{
        const {value:val,text,checked} = item

        //判断竖向横向--拼接classname
        let liClassName = ''
        if(isVertical) liClassName = styles.verticalItem
        else liClassName = styles.horizontalItem

        return <li key ={val} className={liClassName}>
            <label>
                <input type='checkbox' checked={selectedValues.includes(val)} onChange={()=>toggleChecked(val)}/>
                {text}
            </label>
        </li>
    })}
  </ul>
  </>
  
}

export default QuestionCheckbox