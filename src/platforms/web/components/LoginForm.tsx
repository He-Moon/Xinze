'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, App, Tabs } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAuthContext } from '../../../components/providers/AuthProvider';
import { LoginCredentials, RegisterCredentials } from '../../../shared/types';
import { validateEmail, validatePassword, validateName } from '../../../shared/utils';
import { ERROR_MESSAGES } from '../../../shared/constants';
import styles from './LoginForm.module.css';

export default function LoginForm() {
  const [form] = Form.useForm();
  const { login, register, isLoading, isAuthenticated } = useAuthContext();
  const [isLogin, setIsLogin] = useState(true);
  const { message } = App.useApp();
  const router = useRouter();

  // 监听认证状态变化，登录成功后跳转
  useEffect(() => {
    if (isAuthenticated) {
      message.success('登录成功，正在跳转...');
      router.push('/dashboard');
    }
  }, [isAuthenticated, message, router]);

  // 检查URL参数，显示会话过期提示
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const reason = urlParams.get('reason');
    if (reason === 'session_expired') {
      message.warning('会话已过期，请重新登录');
    }
  }, [message]);

  const handleLogin = async (values: LoginCredentials) => {
    const result = await login(values);
    if (result.success) {
      message.success(result.message);
    } else {
      message.error(result.message);
    }
  };

  const handleRegister = async (values: RegisterCredentials) => {
    const result = await register(values);
    if (result.success) {
      message.success(result.message);
    } else {
      message.error(result.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <span style={{ fontSize: '16px', fontWeight: '500', color: 'white' }}>心</span>
            </div>
            <div className={styles.logoText}>心则</div>
          </div>
          <p className={styles.subtitle}>
            {isLogin ? '心之准则，行动之始' : '心之准则，行动之始'}
          </p>
        </div>

        <Tabs
          activeKey={isLogin ? 'login' : 'register'}
          onChange={(key) => setIsLogin(key === 'login')}
          items={[
            {
              key: 'login',
              label: '登录',
            },
            {
              key: 'register',
              label: '注册',
            },
          ]}
          className={styles.tabs}
        />

        {isLogin ? (
          <Form
            form={form}
            name="login"
            onFinish={handleLogin}
            layout="vertical"
            className={styles.form}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: ERROR_MESSAGES.REQUIRED_FIELD },
                { 
                  validator: (_, value) => 
                    !value || validateEmail(value) 
                      ? Promise.resolve() 
                      : Promise.reject(new Error(ERROR_MESSAGES.INVALID_EMAIL))
                }
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="邮箱地址"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: ERROR_MESSAGES.REQUIRED_FIELD },
                { 
                  validator: (_, value) => 
                    !value || validatePassword(value) 
                      ? Promise.resolve() 
                      : Promise.reject(new Error(ERROR_MESSAGES.PASSWORD_TOO_SHORT))
                }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
                size="large"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              size="large"
              block
            >
              登录
            </Button>
          </Form>
        ) : (
          <Form
            form={form}
            name="register"
            onFinish={handleRegister}
            layout="vertical"
            className={styles.form}
          >
            <Form.Item
              name="name"
              rules={[
                { required: true, message: ERROR_MESSAGES.REQUIRED_FIELD },
                { 
                  validator: (_, value) => 
                    !value || validateName(value) 
                      ? Promise.resolve() 
                      : Promise.reject(new Error(ERROR_MESSAGES.NAME_TOO_SHORT))
                }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="姓名"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: ERROR_MESSAGES.REQUIRED_FIELD },
                { 
                  validator: (_, value) => 
                    !value || validateEmail(value) 
                      ? Promise.resolve() 
                      : Promise.reject(new Error(ERROR_MESSAGES.INVALID_EMAIL))
                }
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="邮箱地址"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: ERROR_MESSAGES.REQUIRED_FIELD },
                { 
                  validator: (_, value) => 
                    !value || validatePassword(value) 
                      ? Promise.resolve() 
                      : Promise.reject(new Error(ERROR_MESSAGES.PASSWORD_TOO_SHORT))
                }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: ERROR_MESSAGES.REQUIRED_FIELD },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(ERROR_MESSAGES.PASSWORDS_NOT_MATCH));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className={styles.inputPrefix} />}
                placeholder="确认密码"
                className={styles.input}
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              size="large"
              block
            >
              注册
            </Button>
          </Form>
        )}

        <p className={styles.switchText}>
          {isLogin ? '还没有账户？' : '已有账户？'}
          <span
            className={styles.switchLink}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? '立即注册' : '立即登录'}
          </span>
        </p>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            使用心则即表示您同意我们的
            <a href="#" className={styles.footerLink}>服务条款</a>
            和
            <a href="#" className={styles.footerLink}>隐私政策</a>
          </p>
        </div>
      </div>
    </div>
  );
}
