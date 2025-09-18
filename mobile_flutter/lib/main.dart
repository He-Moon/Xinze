import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';

import 'providers/auth_provider.dart';
import 'providers/task_provider.dart';
import 'providers/goal_provider.dart';
import 'screens/login_screen.dart';
import 'screens/dashboard_screen.dart';
import 'utils/theme.dart';
import 'utils/constants.dart';

void main() {
  runApp(const XinzeApp());
}

class XinzeApp extends StatelessWidget {
  const XinzeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => TaskProvider()),
        ChangeNotifierProvider(create: (_) => GoalProvider()),
      ],
      child: ScreenUtilInit(
        designSize: const Size(375, 812), // iPhone X 设计尺寸
        minTextAdapt: true,
        splitScreenMode: true,
        builder: (context, child) {
          return MaterialApp.router(
            title: AppConstants.appName,
            theme: AppTheme.lightTheme,
            darkTheme: AppTheme.darkTheme,
            themeMode: ThemeMode.system,
            routerConfig: _router,
            debugShowCheckedModeBanner: false,
          );
        },
      ),
    );
  }
}

// 路由配置
final GoRouter _router = GoRouter(
  initialLocation: '/login',
  routes: [
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginScreen(),
    ),
    GoRoute(
      path: '/dashboard',
      builder: (context, state) => const DashboardScreen(),
    ),
  ],
  redirect: (context, state) {
    final authProvider = context.read<AuthProvider>();
    final isLoggedIn = authProvider.isAuthenticated;
    final isLoggingIn = state.matchedLocation == '/login';

    // 如果未登录且不在登录页面，重定向到登录页
    if (!isLoggedIn && !isLoggingIn) {
      return '/login';
    }
    
    // 如果已登录且在登录页面，重定向到仪表板
    if (isLoggedIn && isLoggingIn) {
      return '/dashboard';
    }
    
    return null;
  },
);
