import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';

class ApiClient {
  static const String _tokenKey = 'auth_token';
  
  static ApiClient? _instance;
  static ApiClient get instance => _instance ??= ApiClient._();
  
  ApiClient._();
  
  String? _authToken;
  
  // 设置认证 token
  Future<void> setAuthToken(String token) async {
    _authToken = token;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
  }
  
  // 获取认证 token
  Future<String?> getAuthToken() async {
    if (_authToken != null) return _authToken;
    
    final prefs = await SharedPreferences.getInstance();
    _authToken = prefs.getString(_tokenKey);
    return _authToken;
  }
  
  // 清除认证 token
  Future<void> clearAuthToken() async {
    _authToken = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
  }
  
  // 构建请求头
  Future<Map<String, String>> _buildHeaders() async {
    final headers = Map<String, String>.from(ApiConfig.defaultHeaders);
    
    final token = await getAuthToken();
    if (token != null) {
      headers['Authorization'] = 'Bearer $token';
    }
    
    return headers;
  }
  
  // GET 请求
  Future<ApiResponse<T>> get<T>(
    String endpoint, {
    Map<String, String>? queryParams,
    T Function(Map<String, dynamic>)? fromJson,
  }) async {
    try {
      final uri = Uri.parse(ApiConfig.getApiUrl(endpoint));
      final uriWithParams = queryParams != null 
          ? uri.replace(queryParameters: queryParams)
          : uri;
      
      final response = await http.get(
        uriWithParams,
        headers: await _buildHeaders(),
      );
      
      return _handleResponse<T>(response, fromJson);
    } catch (e) {
      return ApiResponse<T>(
        success: false,
        error: '网络请求失败: $e',
      );
    }
  }
  
  // POST 请求
  Future<ApiResponse<T>> post<T>(
    String endpoint, {
    Map<String, dynamic>? body,
    T Function(Map<String, dynamic>)? fromJson,
  }) async {
    try {
      final response = await http.post(
        Uri.parse(ApiConfig.getApiUrl(endpoint)),
        headers: await _buildHeaders(),
        body: body != null ? jsonEncode(body) : null,
      );
      
      return _handleResponse<T>(response, fromJson);
    } catch (e) {
      return ApiResponse<T>(
        success: false,
        error: '网络请求失败: $e',
      );
    }
  }
  
  // PUT 请求
  Future<ApiResponse<T>> put<T>(
    String endpoint, {
    Map<String, dynamic>? body,
    T Function(Map<String, dynamic>)? fromJson,
  }) async {
    try {
      final response = await http.put(
        Uri.parse(ApiConfig.getApiUrl(endpoint)),
        headers: await _buildHeaders(),
        body: body != null ? jsonEncode(body) : null,
      );
      
      return _handleResponse<T>(response, fromJson);
    } catch (e) {
      return ApiResponse<T>(
        success: false,
        error: '网络请求失败: $e',
      );
    }
  }
  
  // DELETE 请求
  Future<ApiResponse<T>> delete<T>(
    String endpoint, {
    T Function(Map<String, dynamic>)? fromJson,
  }) async {
    try {
      final response = await http.delete(
        Uri.parse(ApiConfig.getApiUrl(endpoint)),
        headers: await _buildHeaders(),
      );
      
      return _handleResponse<T>(response, fromJson);
    } catch (e) {
      return ApiResponse<T>(
        success: false,
        error: '网络请求失败: $e',
      );
    }
  }
  
  // 处理响应
  ApiResponse<T> _handleResponse<T>(
    http.Response response,
    T Function(Map<String, dynamic>)? fromJson,
  ) {
    final statusCode = response.statusCode;
    final body = response.body;
    
    if (statusCode >= 200 && statusCode < 300) {
      try {
        final jsonData = jsonDecode(body);
        
        if (jsonData is Map<String, dynamic>) {
          final success = jsonData['success'] ?? true;
          final message = jsonData['message'];
          final error = jsonData['error'];
          
          if (success) {
            T? data;
            if (jsonData['data'] != null && fromJson != null) {
              data = fromJson(jsonData['data']);
            } else if (jsonData['data'] != null) {
              data = jsonData['data'] as T;
            }
            
            return ApiResponse<T>(
              success: true,
              data: data,
              message: message,
            );
          } else {
            return ApiResponse<T>(
              success: false,
              error: error ?? message ?? '请求失败',
            );
          }
        } else {
          return ApiResponse<T>(
            success: true,
            data: jsonData as T,
          );
        }
      } catch (e) {
        return ApiResponse<T>(
          success: false,
          error: '响应解析失败: $e',
        );
      }
    } else {
      return ApiResponse<T>(
        success: false,
        error: '请求失败 (${statusCode}): ${body}',
      );
    }
  }
}

// API 响应类型
class ApiResponse<T> {
  final bool success;
  final T? data;
  final String? message;
  final String? error;
  
  const ApiResponse({
    required this.success,
    this.data,
    this.message,
    this.error,
  });
  
  bool get hasError => !success;
  bool get hasData => data != null;
  
  @override
  String toString() {
    return 'ApiResponse(success: $success, data: $data, message: $message, error: $error)';
  }
}


