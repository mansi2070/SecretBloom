
import { useChatContext } from "@/context/ChatContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, Video, Info, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ChatHeader = () => {
  const { activeChat } = useChatContext();
  
  if (!activeChat) return null;
  
  // Find the other participant (in case of 1:1 chat)
  const otherParticipant = activeChat.participants.find(
    user => user.id !== "current-user"
  );
  
  // For group chats
  const isGroup = activeChat.isGroupChat;
  const groupName = activeChat.name;
  const participantCount = activeChat.participants.length;
  
  // Status indicator (only for 1:1 chats)
  const renderStatusIndicator = () => {
    if (isGroup) return null;
    
    if (!otherParticipant) return null;
    
    return (
      <div className="flex items-center">
        <div 
          className={`w-2 h-2 rounded-full mr-2 ${
            otherParticipant.status === "online" 
              ? "bg-green-500" 
              : otherParticipant.status === "away" 
                ? "bg-yellow-500" 
                : "bg-gray-500"
          }`}
        />
        <span className="text-sm text-muted-foreground">
          {otherParticipant.status === "online" 
            ? "Online" 
            : otherParticipant.status === "away"
              ? "Away"
              : "Offline"}
        </span>
      </div>
    );
  };
  
  return (
    <div className="p-3 border-b flex items-center justify-between bg-background">
      <div className="flex items-center space-x-4">
        {isGroup ? (
          <Avatar className="h-10 w-10 border">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {groupName?.charAt(0) || 'G'}
            </AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={otherParticipant?.avatar} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {otherParticipant?.name.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
        )}
        
        <div className="flex flex-col">
          <div className="font-medium flex items-center">
            {isGroup ? groupName : otherParticipant?.name}
            <Lock className="h-3.5 w-3.5 ml-2 text-green-600" />
          </div>
          {isGroup ? (
            <span className="text-sm text-muted-foreground">
              {participantCount} members
            </span>
          ) : (
            renderStatusIndicator()
          )}
        </div>
      </div>
      
      <div className="flex space-x-1">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Video className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Info className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
