# API 接口

## 基础信息
- **Base URL**: `/api`
- **认证**: Bearer Token

## 主要接口

### 认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户
- `POST /api/auth/logout` - 用户登出

### 任务管理
- `GET /api/tasks` - 获取任务列表
- `POST /api/tasks` - 创建任务
- `PUT /api/tasks/:id` - 更新任务
- `DELETE /api/tasks/:id` - 删除任务

### 目标管理
- `GET /api/goals` - 获取目标列表
- `POST /api/goals` - 创建目标

### 心则管理
- `GET /api/principles` - 获取心则列表
- `POST /api/principles` - 创建心则

### 快速捕捉
- `PUT /api/capture` - AI内容识别

## 响应格式
```json
{
  "success": boolean,
  "data": any,
  "message": string
}
```