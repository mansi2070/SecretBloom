
import { useState } from "react";
import { useChatContext } from "@/context/ChatContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users, Plus, MessageSquare, Bell, Settings, Lock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const ChatList = () => {
  const { chats, activeChat, setActiveChat, currentUser } = useChatContext();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter chats based on search term
  const filteredChats = chats.filter(chat => {
    // For group chats, search in the group name
    if (chat.isGroupChat && chat.name) {
      return chat.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    // For 1:1 chats, search in the other user's name
    const otherUser = chat.participants.find(user => user.id !== currentUser.id);
    return otherUser?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  // Get chat name or other user's name
  const getChatName = (chat: typeof chats[0]) => {
    if (chat.isGroupChat) return chat.name;
    
    const otherUser = chat.participants.find(user => user.id !== currentUser.id);
    return otherUser?.name || "Unknown";
  };
  
  // Get avatar for the chat
  const getChatAvatar = (chat: typeof chats[0]) => {
    if (chat.isGroupChat) return null;
    
    const otherUser = chat.participants.find(user => user.id !== currentUser.id);
    return otherUser?.avatar || "";
  };
  
  // Format the timestamp
  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return "";
    }
  };
  
  return (
    <div className="flex flex-col h-full border-r">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="font-semibold text-lg flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-primary" />
          ChatSecure
        </div>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      
      <div className="p-3 border-b">
        <Button className="w-full" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>
      
      <div className="overflow-y-auto flex-grow scrollbar-hidden">
        {filteredChats.map(chat => (
          <div
            key={chat.id}
            className={cn(
              "flex items-center p-3 cursor-pointer hover:bg-accent transition-colors",
              activeChat?.id === chat.id ? "bg-accent" : ""
            )}
            onClick={() => setActiveChat(chat)}
          >
            {chat.isGroupChat ? (
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Users className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <Lock className="absolute -top-1 -right-1 h-4 w-4 bg-green-100 text-green-600 rounded-full p-0.5" />
              </div>
            ) : (
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={getChatAvatar(chat)} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getChatName(chat).charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                {/* Online status indicator */}
                {!chat.isGroupChat && chat.participants.find(u => u.id !== currentUser.id)?.status === "online" && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></span>
                )}
                
                <Lock className="absolute -top-1 -right-1 h-4 w-4 bg-green-100 text-green-600 rounded-full p-0.5" />
              </div>
            )}
            
            <div className="ml-3 flex-1 overflow-hidden">
              <div className="flex justify-between items-baseline">
                <span className="font-medium truncate">{getChatName(chat)}</span>
                {chat.lastMessage && (
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(chat.lastMessage.timestamp)}
                  </span>
                )}
              </div>
              
              <div className="text-sm text-muted-foreground truncate">
                {chat.lastMessage && (
                  <span className="flex items-center">
                    {chat.lastMessage.isEncrypted && <Lock className="h-3 w-3 mr-1 text-green-600" />}
                    {chat.lastMessage.senderId === currentUser.id ? "You: " : ""}
                    {chat.lastMessage.isEncrypted ? "Encrypted message" : chat.lastMessage.content}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t mt-auto">
        <div className="flex items-center">
          <Avatar className="h-10 w-10">
            <AvatarImage src={currentUser.avatar} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {currentUser.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <div className="font-medium">{currentUser.name}</div>
            <div className="text-xs flex items-center text-green-600">
              <span className="h-1.5 w-1.5 rounded-full bg-green-600 mr-1"></span>
              Secure connection
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
