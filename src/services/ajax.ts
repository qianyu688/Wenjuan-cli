const  HOST =  'http://localhost:3001'//Mock的host域名端口

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
        body:JSON.stringify(body)
    })
    const data = res.json()
    return data
}
