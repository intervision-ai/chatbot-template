import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

const LoginCallback = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/"); // Redirect to home if authenticated
    }
  }, [user, navigate]);

  return (
    <div className="flex w-full flex-col bg-white items-center justify-center h-screen">
      <div className="mb-8">
        <img src="/images/logo.png" className="h-12 w-auto" />
      </div>
      <Loader2 className="h-8 w-8 text-[#000000] animate-spin" />
    </div>
  );
};

export default LoginCallback;
