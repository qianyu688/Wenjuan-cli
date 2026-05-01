const  HOST =  'http://localhost:3005'//nest域名端口

export async function get(url:string) {
    //fetch形式
    const res  = await fetch(`${HOST}${url}`)
    const data = res.json()
    return data
}

export async function post(url:string,body:any) {
    //fetch形式
    const res  = await fetch(`${HOST}${url}`,{
        method:'post',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(body)
    })
    const data = res.json()
    return data
}
