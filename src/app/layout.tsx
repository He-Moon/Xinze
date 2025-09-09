import './globals.css';
import { AntdProvider } from '../components/providers/AntdProvider';
import { AuthProvider } from '../components/providers/AuthProvider';
import { App } from 'antd';

export const metadata = {
  title: '智能任务管理工具',
  description: '快速输入任务、想法和链接，让AI帮你分析和整理',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <AntdProvider>
          <AuthProvider>
            <App>
              {children}
            </App>
          </AuthProvider>
        </AntdProvider>
      </body>
    </html>
  );
}