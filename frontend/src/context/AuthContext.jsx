import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { checkAuth } from "../checkAuth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const authData = await checkAuth();
      setIsAuthenticated(authData.authenticated);
      setUser(authData.user);
      setLoading(false);
      localStorage.setItem(
        "isAuthenticated",
        JSON.stringify(authData.authenticated)
      );
      console.log("authData", authData);

      if (
        authData.authenticated &&
        (location.pathname === "/login" || location.pathname === "/signup")
      ) {
        if (authData.user?.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } else if (!authData.authenticated && location.pathname === "/") {
        navigate("/login", { replace: true });
      }
    };
    verifyAuth();
  }, [location.pathname, navigate]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
