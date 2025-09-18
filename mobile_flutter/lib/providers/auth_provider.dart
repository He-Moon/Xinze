import 'package:flutter/foundation.dart';
import '../models/user.dart';
import '../services/auth_service.dart';

class AuthProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();
  
  User? _user;
  bool _isLoading = false;
  String? _error;
  
  // Getters
  User? get user => _user;
  bool get isAuthenticated => _user != null;
  bool get isLoading => _isLoading;
  String? get error => _error;
  
  // 初始化时检查登录状态
  Future<void> initialize() async {
    _setLoading(true);
    try {
      final isLoggedIn = await _authService.isAuthenticated();
      if (isLoggedIn) {
        await _loadCurrentUser();
      }
    } catch (e) {
      _setError('初始化失败: $e');
    } finally {
      _setLoading(false);
    }
  }
  
  // 登录
  Future<bool> login(String email, String password) async {
    _setLoading(true);
    _clearError();
    
    try {
      final credentials = LoginCredentials(email: email, password: password);
      final response = await _authService.login(credentials);
      
      if (response.success && response.data != null) {
        _user = response.data!.user;
        notifyListeners();
        return true;
      } else {
        _setError(response.error ?? '登录失败');
        return false;
      }
    } catch (e) {
      _setError('登录失败: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }
  
  // 注册
  Future<bool> register(String name, String email, String password, String confirmPassword) async {
    _setLoading(true);
    _clearError();
    
    try {
      final credentials = RegisterCredentials(
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      );
      final response = await _authService.register(credentials);
      
      if (response.success && response.data != null) {
        _user = response.data!.user;
        notifyListeners();
        return true;
      } else {
        _setError(response.error ?? '注册失败');
        return false;
      }
    } catch (e) {
      _setError('注册失败: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }
  
  // 登出
  Future<void> logout() async {
    _setLoading(true);
    
    try {
      await _authService.logout();
      _user = null;
      notifyListeners();
    } catch (e) {
      _setError('登出失败: $e');
    } finally {
      _setLoading(false);
    }
  }
  
  // 加载当前用户信息
  Future<void> _loadCurrentUser() async {
    try {
      final response = await _authService.getCurrentUser();
      if (response.success && response.data != null) {
        _user = response.data!;
        notifyListeners();
      } else {
        // 如果获取用户信息失败，清除登录状态
        _user = null;
        await _authService.clearAuthToken();
        notifyListeners();
      }
    } catch (e) {
      _setError('获取用户信息失败: $e');
      _user = null;
      await _authService.clearAuthToken();
      notifyListeners();
    }
  }
  
  // 刷新用户信息
  Future<void> refreshUser() async {
    if (isAuthenticated) {
      await _loadCurrentUser();
    }
  }
  
  // 清除错误
  void clearError() {
    _clearError();
  }
  
  // 私有方法
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }
  
  void _setError(String error) {
    _error = error;
    notifyListeners();
  }
  
  void _clearError() {
    _error = null;
    notifyListeners();
  }
}


