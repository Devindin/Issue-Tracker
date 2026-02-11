import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials, logout } from "../src/features/auth/authSlice";
import axios from "axios";

interface Props {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: Props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(
          setCredentials({
            user: response.data,
            token,
          })
        );
      } catch (error) {
        localStorage.removeItem("token");
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
};

export default AuthWrapper;
