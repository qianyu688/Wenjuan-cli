// wenjuan-cli/src/services/ajax.ts
const HOST = 'http://localhost:3005' // nest域名端口

// 封装一个获取通用 Headers 的函数
function getHeaders() {
    const headers: any = { 'Content-Type': 'application/json' };
    // 只有在浏览器环境下才去读 localStorage
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`; // 标准的 JWT 携带方式
        }
    }
    return headers;
}

export async function get(url: string) {
    const fullUrl = url.startsWith('http') ? url : `${HOST}${url}`;
    const res = await fetch(fullUrl, {
        method: 'GET',
        headers: getHeaders() // 带上 Token
    });
    return await res.json();
}

export async function post(url: string, body: any) {
    const fullUrl = url.startsWith('http') ? url : `${HOST}${url}`;
    const res = await fetch(fullUrl, {
        method: 'POST',
        headers: getHeaders(), // 带上 Token
        body: JSON.stringify(body)
    });
    return await res.json();
}