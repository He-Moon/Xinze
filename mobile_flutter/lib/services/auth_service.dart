import '../models/user.dart';
import 'api_client.dart';

class AuthService {
  final ApiClient _apiClient = ApiClient.instance;
  
  // 登录
  Future<ApiResponse<LoginResponse>> login(LoginCredentials credentials) async {
    final response = await _apiClient.post<Map<String, dynamic>>(
      '/auth/login',
      body: {
        'email': credentials.email,
        'password': credentials.password,
      },
    );
    
    if (response.success && response.data != null) {
      final data = response.data!;
      final user = User.fromJson(data['user']);
      final token = data['token'] as String;
      
      // 保存 token
      await _apiClient.setAuthToken(token);
      
      return ApiResponse<LoginResponse>(
        success: true,
        data: LoginResponse(user: user, token: token),
        message: response.message,
      );
    }
    
    return ApiResponse<LoginResponse>(
      success: false,
      error: response.error ?? '登录失败',
    );
  }
  
  // 注册
  Future<ApiResponse<LoginResponse>> register(RegisterCredentials credentials) async {
    final response = await _apiClient.post<Map<String, dynamic>>(
      '/auth/register',
      body: {
        'name': credentials.name,
        'email': credentials.email,
        'password': credentials.password,
        'confirmPassword': credentials.confirmPassword,
      },
    );
    
    if (response.success && response.data != null) {
      final data = response.data!;
      final user = User.fromJson(data['user']);
      final token = data['token'] as String;
      
      // 保存 token
      await _apiClient.setAuthToken(token);
      
      return ApiResponse<LoginResponse>(
        success: true,
        data: LoginResponse(user: user, token: token),
        message: response.message,
      );
    }
    
    return ApiResponse<LoginResponse>(
      success: false,
      error: response.error ?? '注册失败',
    );
  }
  
  // 登出
  Future<ApiResponse<void>> logout() async {
    try {
      await _apiClient.post('/auth/logout');
    } catch (e) {
      // 即使 API 调用失败，也要清除本地 token
      print('Logout API failed: $e');
    } finally {
      // 清除本地存储的 token
      await _apiClient.clearAuthToken();
    }
    
    return const ApiResponse<void>(
      success: true,
      message: '登出成功',
    );
  }
  
  // 获取当前用户信息
  Future<ApiResponse<User>> getCurrentUser() async {
    final response = await _apiClient.get<Map<String, dynamic>>(
      '/auth/me',
      fromJson: (json) => json,
    );
    
    if (response.success && response.data != null) {
      final user = User.fromJson(response.data!);
      return ApiResponse<User>(
        success: true,
        data: user,
        message: response.message,
      );
    }
    
    return ApiResponse<User>(
      success: false,
      error: response.error ?? '获取用户信息失败',
    );
  }
  
  // 刷新 token
  Future<ApiResponse<String>> refreshToken() async {
    final response = await _apiClient.post<Map<String, dynamic>>(
      '/auth/refresh',
    );
    
    if (response.success && response.data != null) {
      final token = response.data!['token'] as String;
      await _apiClient.setAuthToken(token);
      
      return ApiResponse<String>(
        success: true,
        data: token,
        message: response.message,
      );
    }
    
    return ApiResponse<String>(
      success: false,
      error: response.error ?? '刷新 token 失败',
    );
  }
  
  // 检查是否已登录
  Future<bool> isAuthenticated() async {
    final token = await _apiClient.getAuthToken();
    return token != null && token.isNotEmpty;
  }
}

// 登录凭据
class LoginCredentials {
  final String email;
  final String password;
  
  const LoginCredentials({
    required this.email,
    required this.password,
  });
}

// 注册凭据
class RegisterCredentials {
  final String name;
  final String email;
  final String password;
  final String confirmPassword;
  
  const RegisterCredentials({
    required this.name,
    required this.email,
    required this.password,
    required this.confirmPassword,
  });
}

// 登录响应
class LoginResponse {
  final User user;
  final String token;
  
  const LoginResponse({
    required this.user,
    required this.token,
  });
}


