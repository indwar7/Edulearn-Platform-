import { Navigate } from 'react-router-dom';
import { useAuth, roleAllows } from '../context/AuthContext';

interface Props {
  page: string;
  children: React.ReactNode;
}

export default function ProtectedRoute({ page, children }: Props) {
  const { loggedIn, role } = useAuth();

  if (!loggedIn) return <Navigate to="/" replace />;
  if (!roleAllows(role, page)) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}
