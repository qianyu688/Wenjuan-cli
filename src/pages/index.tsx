// wenjuan-cli/src/pages/index.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PageWrapper from '@/components/PageWrapper';
import { get } from '@/services/ajax';

export default function Home() {
  const router = useRouter();
  const [studentInfo, setStudentInfo] = useState({ studentId: '', major: '', department: '' });
  const [taskList, setTaskList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const infoStr = localStorage.getItem('studentInfo');
    if (!infoStr) {
      router.push('/login');
      return;
    }

    const info = JSON.parse(infoStr);
    setStudentInfo(info);

    // 加载专属该专业的问卷列表
    async function fetchTasks() {
      try {
        const res = await get(`/api/question/studentList?major=${info.major}`);
        // 兼容不同的后端返回结构
        const listData = res?.data || res || [];
        setTaskList(Array.isArray(listData) ? listData : []);
      } catch (error) {
        console.error("加载任务失败", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchTasks();
  }, [router]);

  if (!isClient) return null;

  return (
    <PageWrapper title="学生评教中心">
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
        
        {/* 头部信息 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #1677ff', paddingBottom: '16px', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', color: '#333' }}>
              欢迎你，{studentInfo.major}专业的同学 ({studentInfo.studentId})
            </h1>
            <p style={{ color: '#666', marginTop: '8px' }}>
              {studentInfo.department ? `所属学院：${studentInfo.department}` : '请规范填写教评问卷，感谢您的反馈！'}
            </p>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('studentInfo');
              router.push('/login');
            }}
            style={{ padding: '8px 16px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            退出登录
          </button>
        </div>

        {/* 待办任务列表 */}
        <div style={{ background: '#f8f9fa', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#333' }}>📚 我的待办评教</h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>加载中...</div>
          ) : taskList.length === 0 ? (
            <div style={{ background: '#fff', padding: '40px 20px', borderRadius: '6px', textAlign: 'center', color: '#888', border: '1px dashed #d9d9d9' }}>
              <p style={{ fontSize: '16px' }}>🎉 太棒了！您当前没有待办的评教任务。</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {taskList.map(task => (
                <div 
                  key={task._id} 
                  style={{ 
                    background: '#fff', 
                    padding: '20px', 
                    borderRadius: '8px', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderLeft: '4px solid #1677ff'
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#222' }}>{task.title}</h3>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#888' }}>
                      <span>发布时间: {new Date(task.createdAt).toLocaleDateString()}</span>
                      {task.isAnonymous && <span style={{ color: '#faad14', background: '#fffbe6', padding: '2px 6px', borderRadius: '4px' }}>🛡️ 匿名收集</span>}
                    </div>
                  </div>
                  <button 
                    onClick={() => router.push(`/question/${task._id}`)}
                    style={{ padding: '10px 24px', background: '#1677ff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    去填写
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}