import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import { LoginCallback, Security, useOktaAuth } from "@okta/okta-react";
import { Loader2 } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { generateSessionId } from "./actions/ChatActions";
import "./App.css";
import AppRouter from "./AppRouter";
import SideNavigationBar from "./components/SideNavigationBar/SideNavigationBar";
import config from "./config.json";
import { LoginPage } from "./pages/login/login";
import { Store } from "./store/Store";
import "./utils/global.css";

const oktaConfig = {
  issuer: config.oktaConfig.issuer,
  clientId: config.oktaConfig.clientId,
  redirectUri: window.location.origin + config.oktaConfig.redirectUri,
};
// Custom SecureRoute component
const RequireAuth = ({ children }) => {
  const { oktaAuth, authState } = useOktaAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await oktaAuth.isAuthenticated();
        setIsAuthenticated(authenticated);
        if (!authenticated) {
          const originalUri = window.location.href;
          oktaAuth.setOriginalUri(originalUri);
          // oktaAuth.signInWithRedirect();
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [oktaAuth]);

  if (isAuthenticated === null) {
    return (
      <div className="flex w-full flex-col bg-white items-center justify-center h-screen">
        <div className="mb-8">
          <img src="/images/logo.png" className="h-12 w-auto" />
        </div>
        <Loader2 className="h-8 w-8 text-[#000000] animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? (
    children
  ) : (
    <LoginPage onGetStarted={() => oktaAuth?.signInWithRedirect()} />
  );
};

// Protected content component
const ProtectedContent = ({ onChatSelect, chatBoxRef }) => {
  return (
    <div className="flex flex-row min-h-screen w-full overflow-x-hidden">
      <SideNavigationBar onChatSelect={onChatSelect} />
      <AppRouter ref={chatBoxRef} />
    </div>
  );
};

const App = () => {
  const [sessionId, setSessionId] = useState("");
  const { dispatch } = useContext(Store);
  const chatBoxRef = useRef(null);

  // Initialize OktaAuth
  const oktaAuth = new OktaAuth(oktaConfig);

  // Handle redirect after authentication
  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    window.location.replace(
      toRelativeUrl(originalUri || "/", window.location.origin)
    );
  };

  // Generate session ID on component mount
  useEffect(() => {
    const createSession = () => {
      const newSessionId = `session-${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
      generateSessionId(newSessionId, dispatch);
    };

    createSession();
  }, [dispatch]);

  // Handle chat selection
  const handleChatSelect = (selectedSessionId) => {
    chatBoxRef.current?.handleChatSelect(selectedSessionId);
  };
  return (
    <Router>
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
        <div className="">
          <Routes>
            <Route
              path="/login/callback"
              element={
                <LoginCallback
                  loadingElement={
                    <div className="flex w-full flex-col bg-background items-center justify-center h-screen">
                      <div className="mb-8">
                        <img src="/images/logo.png" className="h-12 w-auto" />
                      </div>
                      <Loader2 className="h-8 w-8 text-[#000000] animate-spin" />
                    </div>
                  }
                />
              }
            />
            <Route
              path="/*"
              element={
                <RequireAuth>
                  <ProtectedContent
                    onChatSelect={handleChatSelect}
                    chatBoxRef={chatBoxRef}
                  />
                </RequireAuth>
              }
            />
          </Routes>
        </div>
      </Security>
    </Router>
  );
};

export default App;
