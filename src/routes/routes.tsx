import { ProtectedRoute } from "@/components/ProtectedRoute";
import AssetDetails from "@/pages/asset/AssetDetails";
import Dashboard from "@/pages/Dashboard";
import Documentation from "@/pages/Documentation";
import LandingPage from "@/pages/landing/LandingPage";
import Login from "@/pages/login/Login";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import TransactionHistory from "@/pages/TransactionHistory";
import { Navigate, Route } from "react-router-dom";

export const routes = (
  <>
    <Route index element={<LandingPage />} />
    <Route
      path="dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route path="login" element={<Login />} />
    <Route
      path="history"
      element={
        <ProtectedRoute>
          <TransactionHistory />
        </ProtectedRoute>
      }
    />
    <Route
      path="asset-details"
      element={
        <ProtectedRoute>
          <AssetDetails />
        </ProtectedRoute>
      }
    />
    <Route path="terms" element={<Terms />} />
    <Route path="privacy" element={<Privacy />} />
    <Route path="documentation" element={<Documentation />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </>
);
