
import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import ChatLayout from "@/components/layout/ChatLayout";
import { ChatProvider } from "@/context/ChatContext";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const handleLogin = () => {
    setIsAuthenticated(true);
  };
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }
  
  return (
    <ChatProvider>
      <ChatLayout />
    </ChatProvider>
  );
};

export default Index;
