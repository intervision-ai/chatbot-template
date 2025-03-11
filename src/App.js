import { TooltipProvider } from "@radix-ui/react-tooltip";
import { useContext, useEffect, useRef, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { generateSessionId } from "./actions/ChatActions";
import "./App.css";
import SideNavigationBar from "./components/SideNavigationBar/SideNavigationBar";
import ChatContainer from "./containers/ChatContainer";
import NotFoundPage from "./containers/PageNotFoundContainer";
import { AuthProvider } from "./contexts/authContext";
import { ChatProvider } from "./contexts/chatContext";
import { LoginPage } from "./pages/login/login";
import LoginCallback from "./pages/login/loginCallback";
import PrivateRoute from "./protectRoute";
import { Store } from "./store/Store";
import { ThemeProvider } from "./store/theme";
import "./utils/global.css";

const App = () => {
  const [sessionId, setSessionId] = useState("");
  const { dispatch } = useContext(Store);
  const chatBoxRef = useRef(null);

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
      <AuthProvider>
        <TooltipProvider>
          <ChatProvider>
            <Router>
              <div className="font-worksans">
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/login/callback" element={<LoginCallback />} />
                  <Route element={<PrivateRoute />}>
                    <Route
                      path="/"
                      element={
                        <div className="flex flex-row min-h-screen w-full overflow-x-hidden">
                          <SideNavigationBar onChatSelect={handleChatSelect} />
                          <ChatContainer ref={chatBoxRef} />
                        </div>
                      }
                    />
                    <Route path="/chat" element={<Navigate to="/" />} />
                  </Route>

                  {/* Redirects */}
                  {/* 404 Page */}
                  <Route path="*" element={<NotFoundPage />} />
                  {/* <Route
                  path="/*"
                  element={
                    <PrivateRoute>
                      <div className="flex flex-row min-h-screen w-full overflow-x-hidden">
                        <SideNavigationBar onChatSelect={handleChatSelect} />
                        <AppRouter ref={chatBoxRef} />
                      </div>
                    </PrivateRoute>
                  }
                /> */}
                </Routes>
              </div>
            </Router>
          </ChatProvider>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
