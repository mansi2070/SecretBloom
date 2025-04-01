import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Send, 
  Paperclip, 
  Smile, 
  Mic, 
  Image, 
  Lock
} from "lucide-react";
import { useChatContext } from "@/context/ChatContext";

const MessageInput = () => {
  const { sendMessage, activeChat, currentUser, setUserTyping } = useChatContext();
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleTyping = (value: string) => {
    setMessage(value);
    
    if (activeChat && !activeChat.isGroupChat) {
      const otherUser = activeChat.participants.find(u => u.id !== currentUser.id);
      if (otherUser && value.length > 0) {
        setUserTyping(otherUser.id, true);
        
        setTimeout(() => {
          setUserTyping(otherUser.id, false);
        }, 3000);
      }
    }
  };
  
  const handleSubmit = async () => {
    if (!message.trim()) return;
    
    await sendMessage(message);
    setMessage("");
    
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  return (
    <div className="p-3 border-t bg-background">
      <div className="flex items-center bg-muted rounded-lg p-1">
        <div className="flex-none px-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Paperclip className="h-5 w-5" />
          </Button>
        </div>
        
        <Textarea
          ref={textareaRef}
          placeholder="Type a secure message..."
          value={message}
          onChange={(e) => handleTyping(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 border-0 bg-transparent focus-visible:ring-0 resize-none py-2 px-3"
          rows={1}
        />
        
        <div className="flex space-x-1 px-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Smile className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Image className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`text-muted-foreground ${isRecording ? 'text-red-500' : ''}`}
            onClick={() => setIsRecording(!isRecording)}
          >
            <Mic className="h-5 w-5" />
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!message.trim()}
            variant="default"
            size="icon"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-center text-muted-foreground flex items-center justify-center">
        <Lock className="h-3 w-3 mr-1" />
        End-to-end encrypted
      </div>
    </div>
  );
};

export default MessageInput;
