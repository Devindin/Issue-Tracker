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
        const response = await axios.get("/auth/me", {
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

  if (loading)
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-200 to-blue-50">
        <div className="text-center">
          <div className="inline-block">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-500 animate-spin"></div>
            </div>
          </div>
          <p className="text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    );

  return <>{children}</>;
};

export default AuthWrapper;
