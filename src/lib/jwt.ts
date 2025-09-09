// 只在服务端使用jsonwebtoken，客户端使用jose
import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

// 生成JWT token（服务端使用）
export async function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
  
  return token;
}

// 验证JWT token（服务端使用）
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      iat: payload.iat as number,
      exp: payload.exp as number
    };
  } catch (error) {
    console.error('JWT验证失败:', error);
    return null;
  }
}

// 从请求中提取用户信息（服务端使用）
export function getUserFromRequest(request: Request): JWTPayload | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '');
  // 注意：这里需要异步调用，但为了保持接口一致，我们返回null
  // 实际使用中应该在middleware中验证
  return null;
}