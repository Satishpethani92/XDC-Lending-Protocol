import { Navigate } from "react-router-dom";
import { useAccount } from "wagmi";

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isConnected } = useAccount();

  if (isConnected) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
