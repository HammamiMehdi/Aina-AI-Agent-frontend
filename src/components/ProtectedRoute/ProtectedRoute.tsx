import { useIsAuthenticated } from "@azure/msal-react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
  }
  
  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const isAuthenticated = useIsAuthenticated();
    const location = useLocation();
  
    if (!isAuthenticated) {
      // Redirect to sign-in page, but save the attempted URL so we can redirect back after login.
      return <Navigate to="/sign-in" state={{ from: location }} replace />;
    }
  
    return <>{children}</>;
  };
  
  export default ProtectedRoute;