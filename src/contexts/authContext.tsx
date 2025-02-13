import {
  User,
  UserManager,
  UserManagerSettings,
  WebStorageStateStore,
} from "oidc-client-ts";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { selectedOIDCConfig } from "../authConfig";

interface INormalizeUser {
  id: any;
  name: string;
  email: any;
  idp: any;
  issuer: string;
  originalUser: User;
}
interface AuthContextType {
  user: INormalizeUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<INormalizeUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  //   const navigate = useNavigate();
  //   const location = useLocation();
  const normalizeUserData = (user: User) => {
    if (!user || !user.profile) return null;

    const { profile } = user;

    return {
      id: profile.sub || profile.oid || "", // Okta uses 'sub', Entra uses 'oid'
      name:
        profile.name ||
        `${profile.given_name || ""} ${profile.family_name || ""}`.trim() ||
        "Unknown User",
      email: profile.email || profile.upn || profile.unique_name || "", // Okta uses 'email', Entra uses 'upn'
      idp: profile.idp || profile.tid || "Unknown IDP", // Okta has 'idp', Entra has 'tid'
      issuer: profile.iss || "",
      originalUser: user,
    };
  };
  const userManager = useMemo(() => {
    const settings: UserManagerSettings = {
      authority: selectedOIDCConfig.authority,
      client_id: selectedOIDCConfig.clientId,
      redirect_uri: window.location.origin + selectedOIDCConfig.redirectUri,
      response_type: selectedOIDCConfig.responseType,
      scope: selectedOIDCConfig.scope,
      userStore: new WebStorageStateStore({ store: window.localStorage }),
    };
    return new UserManager(settings);
  }, []);

  useEffect(() => {
    const handleAuthentication = async () => {
      try {
        if (window.location.pathname === "/login/callback") {
          // Process the authentication response and get the user
          const user = await userManager.signinRedirectCallback();
          setUser(normalizeUserData(user));
        } else {
          // Check if user is already logged in
          const loadedUser = await userManager.getUser();
          if (loadedUser) {
            setUser(normalizeUserData(loadedUser));
          }
        }
      } catch (error) {
        console.error("Error during authentication callback:", error);
      } finally {
        setIsLoading(false);
      }
    };

    handleAuthentication();
  }, [userManager]);

  userManager.events.addUserLoaded((ul) => setUser(normalizeUserData(ul)));
  userManager.events.addUserUnloaded(() => setUser(null));

  const signIn = async () => {
    try {
      await userManager.signinRedirect();
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  const signOut = async () => {
    try {
      await userManager.signoutSilent();
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
