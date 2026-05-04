import React, { useState } from 'react';
import { useRouter } from 'next/router';
import PageWrapper from '@/components/PageWrapper';
import { post, get } from '@/services/ajax'; // 引入我们刚刚升级的请求方法

export default function Login() {
  const router = useRouter();
  // 换成了账号密码登录
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      alert('账号和密码不能为空！');
      return;
    }

    setLoading(true);
    try {
      const loginRes = await post('/api/auth/login', { username, password });
      
      // 🚀 核心修改 1：从 loginRes.data 中提取 token，并判断 errno 是否为 0
      const token = loginRes?.data?.token || loginRes?.token;
      
      if (token && (loginRes.errno === 0 || loginRes.errno === undefined)) {
        localStorage.setItem('token', token);

        const infoRes = await get('/api/auth/profile'); 
        
        // 🚀 核心修改 2：考虑到 profile 接口大概率也被包在了 data 里
        const profileData = infoRes?.data || infoRes;
        
        console.log("👉 Profile接口真实返回数据:", profileData);
        if (profileData && profileData.studentId) {
          localStorage.setItem('studentInfo', JSON.stringify({ 
            studentId: profileData.studentId, 
            major: profileData.major, 
            department: profileData.department || '' 
          }));
          
          alert('身份验证成功！准备开始评教。');
          const { redirect } = router.query;
          router.push((redirect as string) || '/');
        } else {
          alert('登录成功，但未查到您的学号信息。请联系教务处确认。');
        }
      } else {
        alert(loginRes?.message || '账号或密码错误，请重试！');
      }
    } catch (error) {
      alert('登录失败，请检查网络或后端服务');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper title="学生登录 - 教学质量评价系统">
      <div style={{ maxWidth: '400px', margin: '60px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>学生统一身份认证</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>学号/账号:</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
              placeholder="请输入账号"
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>密 码:</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              placeholder="请输入密码"
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{ marginTop: '10px', padding: '12px', backgroundColor: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '16px' }}
          >
            {loading ? '验证中...' : '登录系统'}
          </button>
        </form>
      </div>
    </PageWrapper>
  );
}