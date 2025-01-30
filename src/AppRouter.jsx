import React, { forwardRef } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ChatContainer from "./containers/ChatContainer";
import NotFoundPage from "./containers/PageNotFoundContainer";
// import { useAuth } from "react-oidc-context";
// import { LandingPage } from "./pages/landing/landingpage";
// import { AlertTriangle, HomeIcon, Loader2 } from "lucide-react";

const AppRouter = forwardRef((props, ref) => {
  if (window.location.search.includes("code")) {
    window.location.replace(window.location.origin);
  }
  return (
    // <Router>
    <Routes>
      <Route path="/" element={<ChatContainer ref={ref} />} />
      <Route path="/chat" element={<Navigate to="/" />} />

      {/* Redirects */}
      {/* 404 Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    // </Router>
  );
  // }

  // return <LandingPage onGetStarted={() => auth.signinRedirect()} />;
});

export default AppRouter;
