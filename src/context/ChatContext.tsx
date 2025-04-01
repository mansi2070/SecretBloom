
import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  User, 
  Chat, 
  Message, 
  currentUser, 
  generateMockChats 
} from "@/lib/mockData";
import { 
  encryptMessage, 
  decryptMessage, 
  importKey 
} from "@/lib/encryption";
import { toast } from "@/components/ui/sonner";

interface ChatContextType {
  currentUser: User;
  chats: Chat[];
  activeChat: Chat | null;
  setActiveChat: (chat: Chat | null) => void;
  sendMessage: (content: string, attachments?: any[]) => Promise<void>;
  isLoading: boolean;
  typingUsers: Map<string, boolean>;
  setUserTyping: (userId: string, isTyping: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [typingUsers] = useState<Map<string, boolean>>(new Map());

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const initialChats = await generateMockChats();
        setChats(initialChats);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading chat data:", error);
        toast.error("Failed to load chat data");
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Set typing status for a user
  const setUserTyping = (userId: string, isTyping: boolean) => {
    typingUsers.set(userId, isTyping);
    // Force re-render
    setChats([...chats]);
  };

  // Send a new message
  const sendMessage = async (content: string, attachments?: any[]) => {
    if (!activeChat) return;
    
    try {
      // Create new message
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: currentUser.id,
        content,
        timestamp: new Date().toISOString(),
        isEncrypted: true,
        isRead: false,
        attachments
      };
      
      // If this is an encrypted chat, encrypt the message
      if (activeChat.encryptionKey) {
        const key = await importKey(activeChat.encryptionKey);
        newMessage.content = await encryptMessage(content, key);
      }
      
      // Update the active chat with the new message
      const updatedChat = {
        ...activeChat,
        messages: [...activeChat.messages, newMessage],
        lastMessage: newMessage
      };
      
      // Update the chats list
      const updatedChats = chats.map(chat => 
        chat.id === activeChat.id ? updatedChat : chat
      );
      
      setChats(updatedChats);
      setActiveChat(updatedChat);
      
      // In a real app, this is where you would send the message to the server
      // and handle WebSocket events for real-time updates
      
      return;
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const value = {
    currentUser,
    chats,
    activeChat,
    setActiveChat,
    sendMessage,
    isLoading,
    typingUsers,
    setUserTyping
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
