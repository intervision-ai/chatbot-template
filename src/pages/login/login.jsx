import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SignInBanner } from "../../components/signinBanner/signinBanner";
import config from "../../config.json";
import { useAuth } from "../../contexts/authContext";
export const LoginPage = () => {
  const { signIn, isLoading, user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  // const [isLoading, setIsLoading] = React.useState(false);

  return (
    <SignInBanner>
      <div className="flex justify-center items-center w-full h-[calc(100%-80px)]">
        <div className="p-4 md:p-4 sm:p-0">
          {/* <div className="flex justify-center items-center gap-3 ">
            <img src="/images/logo.png" alt="" className="h-16" />
          </div> */}
          <div className="text-center text-2xl text-gray-700 font-semibold mt-2 pb-8">
            Welcome back!
          </div>
          <div className="mt-4">
            {/* <div className="text-center text-2xl text-gray-700 font-semibold mt-2">
              Login
            </div> */}
            {/* <div
              className="mx-auto bg-cover h-[250px] w-full sm:block hidden"
              style={{
                backgroundImage: "url('/images/login-bg.png')",
              }}
            ></div> */}
            {/* <div className="text-center text-base text-gray-500 font-normal mt-4">
              Secure Access, Anytime, Anywhere.
            </div> */}
            <div className="text-center text-base text-secondary-foreground font-normal mt-4">
              Login with your{" "}
              <span className="text-primary">{config.companyName}</span> account
            </div>
            <div className="flex justify-center items-center mt-3">
              <button
                onClick={() => {
                  // setIsLoading(true);
                  signIn();
                  // setTimeout(() => {
                  //   setIsLoading(false);
                  // }, 800);
                }}
                className="mb-4 flex items-center gap-1 bg-primary  py-2 px-6 border border-muted rounded-lg hover:scale-105 transition-all duration-300"
              >
                {isLoading ? (
                  <Loader2
                    strokeWidth={6}
                    className="text-background h-5 w-5 mr-1 animate-spin"
                  />
                ) : (
                  <>
                    {/* <img src="/images/okta-logo.png" alt="" className="h-6" /> */}
                  </>
                )}
                <span className="text-base text-background font-semibold">
                  Login
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </SignInBanner>
  );
};
