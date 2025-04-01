
import ChatList from "@/components/chat/ChatList";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";
import { useIsMobile } from "@/hooks/use-mobile";
import { useChatContext } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const ChatLayout = () => {
  const { activeChat, setActiveChat } = useChatContext();
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return (
      <div className="h-screen flex flex-col">
        {activeChat ? (
          <>
            <div className="flex items-center border-b">
              <Button
                variant="ghost"
                className="m-1"
                onClick={() => setActiveChat(null)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <ChatHeader />
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <MessageList />
            </div>
            <MessageInput />
          </>
        ) : (
          <div className="h-full">
            <ChatList />
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="h-screen flex">
      <div className="w-80 h-full flex-shrink-0">
        <ChatList />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatHeader />
        <div className="flex-1 overflow-hidden">
          <MessageList />
        </div>
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatLayout;
