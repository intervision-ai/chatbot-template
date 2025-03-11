import React, { createContext, ReactNode, useContext, useState } from "react";

// Define the context type
interface ChatContextType {
  sessionId: string | null;
  updateSessionId: (id: string) => void;
}

// Create the context with default values
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Define the provider props type
interface SessionProviderProps {
  children: ReactNode;
}

// Provider Component
export const ChatProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Function to update sessionId
  const updateSessionId = (id: string) => setSessionId(id);

  // Function to clear sessionId
  const clearSessionId = () => setSessionId(null);

  return (
    <ChatContext.Provider value={{ sessionId, updateSessionId }}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom Hook to use ChatContext
export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
