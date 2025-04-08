import {
  createBrowserRouter,
  Navigate,
  Route,
  BrowserRouter as Router,
  RouterProvider,
  Routes,
} from "react-router-dom";
import Home from "./pages/Home";
import AppLayout from "./components/AppLayout";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AdminPanel from "./pages/AdminPanel";
import About from "./pages/About";
// import RefreshHandle from "./refreshHandle";

function App() {
  const { isAuthenticated, user,loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-10 text-xl">Checking auth...</div>;
  }

  const ProtectedRoute = ({ isAuthenticated, children }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  }; // children woh component hai jo protected route ke andar pass kar rahe ho  // eg.,  <ProtectedRoute> <Home /></ProtectedRoute>

  const PublicRoute = ({ isAuthenticated, children }) => {
    return !isAuthenticated ? children : <Navigate to="/" replace />;
  }; // This replaces /login with /dashboard in the history stack.
  // Now, when the user clicks Back, they won't return to /login (because it was removed from history).
  // This is useful for redirecting users after login, so they don’t go back to the login page by mistake.

  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route
          index
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute isAuthenticated={isAuthenticated}>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute isAuthenticated={isAuthenticated}>
              <SignUp />
            </PublicRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated && user?.role === "admin"}
            >
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<About/>}/>
      </Route>
    </Routes>
  );
}

export default App;
