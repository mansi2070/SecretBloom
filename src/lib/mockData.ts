
import { generateSessionKey } from "./encryption";

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "away";
  lastSeen?: string;
  publicKey?: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isEncrypted: boolean;
  isRead: boolean;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  type: "image" | "file";
  url: string;
  name: string;
  size: number;
}

export interface Chat {
  id: string;
  participants: User[];
  messages: Message[];
  lastMessage?: Message;
  encryptionKey?: string;
  isGroupChat: boolean;
  name?: string; // For group chats
}

// Sample profile user
export const currentUser: User = {
  id: "current-user",
  name: "You",
  avatar: "https://ui-avatars.com/api/?name=You&background=0D8ABC&color=fff",
  status: "online",
  publicKey: "mock-public-key-current-user"
};

// Mock users
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Alex Johnson",
    avatar: "https://ui-avatars.com/api/?name=Alex+Johnson&background=0D8ABC&color=fff",
    status: "online",
    lastSeen: new Date().toISOString(),
    publicKey: "mock-public-key-1"
  },
  {
    id: "2",
    name: "Taylor Smith",
    avatar: "https://ui-avatars.com/api/?name=Taylor+Smith&background=3A8C8C&color=fff",
    status: "offline",
    lastSeen: new Date(Date.now() - 3600000).toISOString(),
    publicKey: "mock-public-key-2"
  },
  {
    id: "3",
    name: "Jordan Lee",
    avatar: "https://ui-avatars.com/api/?name=Jordan+Lee&background=10657C&color=fff",
    status: "away",
    lastSeen: new Date(Date.now() - 1800000).toISOString(),
    publicKey: "mock-public-key-3"
  },
  {
    id: "4",
    name: "Casey Williams",
    avatar: "https://ui-avatars.com/api/?name=Casey+Williams&background=3A7C7C&color=fff",
    status: "online",
    publicKey: "mock-public-key-4"
  },
  {
    id: "5",
    name: "Riley Parker",
    avatar: "https://ui-avatars.com/api/?name=Riley+Parker&background=0D8ABC&color=fff",
    status: "offline",
    lastSeen: new Date(Date.now() - 86400000).toISOString(),
    publicKey: "mock-public-key-5"
  }
];

// Generate sample messages
const generateMessages = (userId: string): Message[] => {
  const messages: Message[] = [];
  
  // Past messages
  const baseTime = Date.now() - 86400000; // 1 day ago
  
  messages.push({
    id: `msg-${userId}-1`,
    senderId: userId,
    content: "Hey there! How's it going?",
    timestamp: new Date(baseTime).toISOString(),
    isEncrypted: true,
    isRead: true
  });
  
  messages.push({
    id: `msg-current-1`,
    senderId: "current-user",
    content: "Hi! I'm doing well, thanks for asking.",
    timestamp: new Date(baseTime + 300000).toISOString(),
    isEncrypted: true,
    isRead: true
  });
  
  messages.push({
    id: `msg-${userId}-2`,
    senderId: userId,
    content: "Have you tried the new secure messaging feature?",
    timestamp: new Date(baseTime + 600000).toISOString(),
    isEncrypted: true,
    isRead: true
  });
  
  messages.push({
    id: `msg-current-2`,
    senderId: "current-user",
    content: "Yes, I love how everything is end-to-end encrypted!",
    timestamp: new Date(baseTime + 900000).toISOString(),
    isEncrypted: true,
    isRead: true
  });
  
  // Add an image attachment to one message
  if (userId === "1") {
    messages.push({
      id: `msg-${userId}-3`,
      senderId: userId,
      content: "Check out this secure file sharing:",
      timestamp: new Date(baseTime + 1200000).toISOString(),
      isEncrypted: true,
      isRead: true,
      attachments: [
        {
          id: "att-1",
          type: "image",
          url: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&q=80",
          name: "secure-image.jpg",
          size: 2400000
        }
      ]
    });
  }
  
  return messages;
};

// Generate mock chats
export const generateMockChats = async (): Promise<Chat[]> => {
  const chats: Chat[] = [];
  
  // Create individual chats with each user
  for (const user of mockUsers) {
    const messages = generateMessages(user.id);
    const lastMessage = messages[messages.length - 1];
    
    chats.push({
      id: `chat-${user.id}`,
      participants: [user, currentUser],
      messages,
      lastMessage,
      encryptionKey: await generateSessionKey(),
      isGroupChat: false
    });
  }
  
  // Create one group chat
  const groupEncryptionKey = await generateSessionKey();
  chats.push({
    id: "group-1",
    participants: [mockUsers[0], mockUsers[1], mockUsers[2], currentUser],
    messages: [
      {
        id: "group-msg-1",
        senderId: mockUsers[0].id,
        content: "Welcome to our secure group chat!",
        timestamp: new Date(Date.now() - 72000000).toISOString(),
        isEncrypted: true,
        isRead: true
      },
      {
        id: "group-msg-2",
        senderId: mockUsers[1].id,
        content: "Thanks for adding me to this group.",
        timestamp: new Date(Date.now() - 68400000).toISOString(),
        isEncrypted: true,
        isRead: true
      },
      {
        id: "group-msg-3",
        senderId: "current-user",
        content: "Great to have everyone here. All messages are encrypted.",
        timestamp: new Date(Date.now() - 64800000).toISOString(),
        isEncrypted: true,
        isRead: true
      }
    ],
    encryptionKey: groupEncryptionKey,
    isGroupChat: true,
    name: "Secure Team Chat"
  });
  
  return chats;
};
