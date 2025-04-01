
import { useRef, useEffect } from "react";
import { useChatContext } from "@/context/ChatContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Lock, Check, Image as ImageIcon, FilePlus, PaperclipIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const TypingIndicator = () => (
  <div className="flex space-x-1 items-center p-1">
    <div className="w-2 h-2 rounded-full bg-primary/60 animate-typing-dot-1"></div>
    <div className="w-2 h-2 rounded-full bg-primary/60 animate-typing-dot-2"></div>
    <div className="w-2 h-2 rounded-full bg-primary/60 animate-typing-dot-3"></div>
  </div>
);

interface MessageBubbleProps {
  message: any;
  isCurrentUser: boolean;
  showAvatar: boolean;
  userName: string;
  userAvatar: string;
}

const MessageBubble = ({ 
  message, 
  isCurrentUser, 
  showAvatar, 
  userName, 
  userAvatar 
}: MessageBubbleProps) => {
  const bubbleClass = isCurrentUser 
    ? "message-bubble-sent ml-auto" 
    : "message-bubble-received";
  
  const formatMessageTime = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "h:mm a");
    } catch (error) {
      return "";
    }
  };
  
  // Render attachments
  const renderAttachments = () => {
    if (!message.attachments || message.attachments.length === 0) return null;
    
    return (
      <div className="mt-2 space-y-2">
        {message.attachments.map((attachment: any) => (
          <div key={attachment.id} className="rounded-md overflow-hidden">
            {attachment.type === "image" ? (
              <div className="relative">
                <img 
                  src={attachment.url} 
                  alt={attachment.name} 
                  className="max-w-xs rounded-md object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <Lock className="h-3 w-3 mr-1" />
                  Encrypted
                </div>
              </div>
            ) : (
              <div className="flex items-center bg-background border rounded-md p-2 max-w-xs">
                <FilePlus className="h-8 w-8 mr-2 text-muted-foreground" />
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">{attachment.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(attachment.size / 1024)} KB
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isCurrentUser && showAvatar && (
        <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
          <AvatarImage src={userAvatar} />
          <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
        {!isCurrentUser && showAvatar && (
          <div className="text-sm font-medium mb-1">{userName}</div>
        )}
        
        <div className={cn(
          "px-4 py-2 rounded-lg",
          bubbleClass,
          message.isEncrypted && "message-bubble-encrypted"
        )}>
          {message.isEncrypted && (
            <div className="flex items-center text-green-700 text-xs mb-1">
              <Lock className="h-3 w-3 mr-1" />
              <span>End-to-end encrypted</span>
            </div>
          )}
          
          <div className="text-sm">{message.content}</div>
          
          {renderAttachments()}
          
          <div className="flex justify-end items-center mt-1 text-xs text-gray-500 space-x-1">
            <span>{formatMessageTime(message.timestamp)}</span>
            {isCurrentUser && (
              <Check className={`h-3 w-3 ${message.isRead ? 'text-blue-500' : ''}`} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MessageList = () => {
  const { activeChat, currentUser, typingUsers } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);
  
  if (!activeChat) {
    return (
      <div className="flex items-center justify-center h-full bg-accent/50">
        <div className="text-center p-6">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <Lock className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">Secure Messaging</h3>
          <p className="text-muted-foreground">
            Select a conversation to start chatting with end-to-end encryption.
          </p>
        </div>
      </div>
    );
  }
  
  const messages = activeChat.messages;
  
  // Check if any user is typing
  const isAnyoneTyping = Array.from(typingUsers.entries()).some(
    ([userId, isTyping]) => isTyping && userId !== currentUser.id
  );
  
  // Get typing user name
  const getTypingUserName = () => {
    for (const [userId, isTyping] of typingUsers.entries()) {
      if (isTyping && userId !== currentUser.id) {
        const user = activeChat.participants.find(u => u.id === userId);
        return user?.name || "Someone";
      }
    }
    return "Someone";
  };
  
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-accent/20 scrollbar-hidden">
      {messages.map((message, index) => {
        const isCurrentUser = message.senderId === currentUser.id;
        const previousMessage = index > 0 ? messages[index - 1] : null;
        const showAvatar = !previousMessage || 
                          previousMessage.senderId !== message.senderId ||
                          new Date(message.timestamp).getTime() - 
                          new Date(previousMessage.timestamp).getTime() > 5 * 60 * 1000;
        
        const sender = activeChat.participants.find(
          user => user.id === message.senderId
        );
        
        return (
          <MessageBubble
            key={message.id}
            message={message}
            isCurrentUser={isCurrentUser}
            showAvatar={showAvatar}
            userName={sender?.name || "Unknown"}
            userAvatar={sender?.avatar || ""}
          />
        );
      })}
      
      {isAnyoneTyping && (
        <div className="flex items-center space-x-2 mb-4">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{getTypingUserName().charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="bg-muted px-4 py-2 rounded-lg">
            <TypingIndicator />
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
