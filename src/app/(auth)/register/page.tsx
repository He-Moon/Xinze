import AuthGuard from '../../../components/AuthGuard';
import LoginForm from '../../../platforms/web/components/LoginForm';

export default function RegisterPage() {
  return (
    <AuthGuard requireAuth={false}>
      <LoginForm />
    </AuthGuard>
  );
}
