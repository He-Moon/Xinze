import AuthGuard from '../../components/AuthGuard';
import Dashboard from '../../platforms/web/pages/Dashboard';

export default function DashboardPage() {
  return (
    <AuthGuard requireAuth={true}>
      <Dashboard />
    </AuthGuard>
  );
}
