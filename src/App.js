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
import { ThemeProvider, useTheme } from "./store/theme";
import "./utils/global.css";

const oktaConfig = {
  issuer: config.oktaConfig.issuer,
  clientId: config.oktaConfig.clientId,
  redirectUri: window.location.origin + config.oktaConfig.redirectUri,
};
// Custom SecureRoute component
const RequireAuth = ({ children }) => {
  const { theme } = useTheme();
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
  useEffect(() => {
    applyTheme();
  }, [theme]);

  function applyTheme() {
    if (theme === "light") {
      const root = document.documentElement;

      // Light Theme Colors
      root.style.setProperty(
        "--background",
        config.branding.theme.light.background
      );
      root.style.setProperty(
        "--primary",
        config.branding.theme.light.primaryBgColor
      );
      root.style.setProperty(
        "--primary-foreground",
        config.branding.theme.light.primaryFgColor
      );
      root.style.setProperty(
        "--secondary",
        config.branding.theme.light.secondaryBgColor
      );
      root.style.setProperty(
        "--secondary-foreground",
        config.branding.theme.light.secondaryFgColor
      );
      root.style.setProperty(
        "--sidebar",
        config.branding.theme.light.sidebarBgColor
      );
      root.style.setProperty(
        "--login-bg-start",
        config.branding.theme.light.loginBgStart
      );
      root.style.setProperty(
        "--login-bg-end",
        config.branding.theme.light.loginBgEnd
      );
    } else {
      // Dark Theme Colors
      document.documentElement.style.setProperty(
        "--background",
        config.branding.theme.dark.background
      );
      document.documentElement.style.setProperty(
        "--primary",
        config.branding.theme.dark.primaryBgColor
      );
      document.documentElement.style.setProperty(
        "--primary-foreground",
        config.branding.theme.dark.primaryFgColor
      );
      document.documentElement.style.setProperty(
        "--secondary",
        config.branding.theme.dark.secondaryBgColor
      );
      document.documentElement.style.setProperty(
        "--secondary-foreground",
        config.branding.theme.dark.secondaryFgColor
      );
      document.documentElement.style.setProperty(
        "--sidebar",
        config.branding.theme.dark.sidebarBgColor
      );
      document.documentElement.style.setProperty(
        "--login-bg-start",
        config.branding.theme.dark.loginBgStart
      );
      document.documentElement.style.setProperty(
        "--login-bg-end",
        config.branding.theme.dark.loginBgEnd
      );
    }
  }
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
    <ThemeProvider>
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
    </ThemeProvider>
  );
};

export default App;
