import { useEffect, useState } from "react";
import { getSocket } from "../socket/socket";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import back from "../assets/left-arrow.png";
import logOut from "../assets/logOut.png";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { useLocation } from "react-router-dom";
interface Message {
  id: number;
  text: string;
  sender: "me" | "other";
}

interface ChatProps {
  selectedUser?: {
    conversationId: number;
    name: string;
    profilePic: string;
  };
}
interface Sender {
  id: number;
  firstName: string;
  lastName: string;
  profilePic: string;
}
interface ChatMessage {
  id: number;
  content: string;
  conversationId: number;
  senderId: number;
  createdAt: string;
  status: "sent" | "delivered" | "read";
  sender: Sender;
}

const Chat = ({ selectedUser }: ChatProps) => {
  const {logout} = useAuth();
  const { id } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const {user} :any = useAuth();
  const location = useLocation();
  if(!selectedUser){
    selectedUser = location?.state?.selectedUser
  }
  // JOIN ROOM
  useEffect(() => {
    console.log("selectedUser chat",selectedUser);
    if (!user) return;
    const socket = getSocket();
    if (!socket) return;
  const conversationId :any = selectedUser?.conversationId || id
    if (!conversationId) return;
    getChatMessage();
    // socket.emit("join_conversation");
      socket.emit("join_conversation", Number(conversationId));
  }, [selectedUser, id,user]);

  // RECEIVE MESSAGE
useEffect(() => {
  const socket = getSocket();
  if (!socket || !user) return;
  console.log("user chat",user);
  const handler = (msg: ChatMessage) => {
    setMessages((prev) => [
      ...prev,
      mapToMessage(msg, user.id),
    ]);
  };

  socket.on("receive_message", handler);

  return () => {
    socket.off("receive_message", handler);
  };
}, [user]);
  const getChatMessage = async () =>{
    try {
      if (!user) return;
     const conversationId :any = selectedUser?.conversationId || id
    const chatMessage :any= await api.get(`/conversation/${conversationId}`);
    console.log("chatMessage1",chatMessage);
    if(chatMessage?.status===200){
      const data: ChatMessage[] = chatMessage.data.data;
      const formattedMessages = data.map((msg) =>
        mapToMessage(msg, user?.id)
      );
      setMessages(formattedMessages);
      // console.log("user chat",user);
      // console.log("chatMessage1",chatMessage);
      console.log("chatMessage2",messages);
    }      
    } catch (error) {
      console.log(error,"CHAT TSX ERROR");
    }
  }
  const mapToMessage = (msg: ChatMessage, currentUserId: number): Message => {
  return {
    id: msg.id,
    text: msg.content,
    sender: msg.senderId === currentUserId ? "me" : "other",
  };
  };  
  // SEND MESSAGE
  const sendMessage = () => {
    const socket = getSocket();
    if (!socket || !input.trim()) return;
 const conversationId = selectedUser?.conversationId || id;
    socket.emit("send_message", {
       conversationId: Number(conversationId),
      content: input,
    });

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: input,
        sender: "me",
      },
    ]);

    setInput("");
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white p-4 flex items-center justify-between">
        <h2 className="font-semibold">{selectedUser?.name || "Chat"}</h2>
        <div className="md:hidden px-3 py-1 rounded-lg">
          <img
            className="w-12 h-12 rounded-full flex-shrink-0"
            src={back}
            alt="back"
            onClick={() => navigate(-1)}
          />
        </div>
        <div className="hidden md:flex px-3 py-1 rounded-lg">
          <img
            className="w-12 h-12 rounded-full flex-shrink-0"
            src={logOut}
            alt="logOut"
            onClick={() => {
              navigate("/");
              localStorage.clear();
              sessionStorage.clear();
              logout();
            }}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 pb-32 md:pb-4 flex flex-col gap-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-xs px-4 py-2 rounded-xl ${
              msg.sender === "me"
                ? "bg-primary text-white self-end"
                : "bg-white text-gray-800 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div
        className="p-4 bg-white flex gap-2 border-t fixed bottom-0 left-0 w-full 
                md:static md:w-auto md:flex-shrink-0"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded-xl px-4 py-2 focus:outline-primary"
          placeholder="Type a message..."
        />

        <button
          onClick={sendMessage}
          className="bg-primary text-white px-4 rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
