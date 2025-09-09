# API 文档

## 基础信息

- **Base URL**: `/api`
- **Content-Type**: `application/json`
- **认证方式**: Bearer Token

## 认证接口

### 用户注册

```http
POST /api/auth/register
```

**请求体**:
```json
{
  "name": "用户名",
  "email": "user@example.com",
  "password": "password123"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "用户名",
      "email": "user@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token"
  },
  "message": "注册成功"
}
```

### 用户登录

```http
POST /api/auth/login
```

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "用户名",
      "email": "user@example.com"
    },
    "token": "jwt_token"
  },
  "message": "登录成功"
}
```

### 获取当前用户

```http
GET /api/auth/me
```

**请求头**:
```
Authorization: Bearer <token>
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "用户名",
    "email": "user@example.com",
    "avatar": null,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 用户登出

```http
POST /api/auth/logout
```

**请求头**:
```
Authorization: Bearer <token>
```

**响应**:
```json
{
  "success": true,
  "message": "退出登录成功"
}
```

## 任务管理接口

### 获取任务列表

```http
GET /api/tasks
```

**查询参数**:
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 10)
- `status`: 任务状态 (pending, in_progress, completed)
- `priority`: 优先级 (low, medium, high)

**响应**:
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "task_id",
        "title": "任务标题",
        "description": "任务描述",
        "status": "pending",
        "priority": "medium",
        "dueDate": "2024-01-15T00:00:00.000Z",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  }
}
```

### 创建任务

```http
POST /api/tasks
```

**请求体**:
```json
{
  "title": "任务标题",
  "description": "任务描述",
  "priority": "medium",
  "dueDate": "2024-01-15T00:00:00.000Z",
  "tags": ["工作", "重要"]
}
```

### 更新任务

```http
PUT /api/tasks/:id
```

### 删除任务

```http
DELETE /api/tasks/:id
```

## 目标管理接口

### 获取目标列表

```http
GET /api/goals
```

### 创建目标

```http
POST /api/goals
```

**请求体**:
```json
{
  "title": "目标标题",
  "description": "目标描述",
  "type": "long_term",
  "deadline": "2024-12-31T00:00:00.000Z",
  "priority": "high"
}
```

## AI 分析接口

### 任务分析

```http
POST /api/ai/analyze-task
```

**请求体**:
```json
{
  "content": "任务内容",
  "context": "上下文信息"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "category": "工作",
    "priority": "high",
    "suggestions": ["建议1", "建议2"],
    "estimatedTime": "2小时"
  }
}
```

### 目标建议

```http
POST /api/ai/goal-suggestions
```

## 错误响应

所有接口在出错时返回统一格式：

```json
{
  "success": false,
  "message": "错误描述",
  "code": "ERROR_CODE"
}
```

### 常见错误码

- `400` - 请求参数错误
- `401` - 未授权
- `403` - 禁止访问
- `404` - 资源不存在
- `500` - 服务器内部错误

## 使用示例

### JavaScript/TypeScript

```typescript
// 登录
const login = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  return await response.json();
};

// 获取任务列表
const getTasks = async (token: string) => {
  const response = await fetch('/api/tasks', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return await response.json();
};
```

### cURL

```bash
# 登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# 获取任务
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <token>"
```
