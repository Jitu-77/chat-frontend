import { useEffect, useState } from "react";
import { getSocket } from "../socket/socket";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import back from "../assets/left-arrow.png";
import logOut from "../assets/logOut.png";
import { useAuth } from "../context/AuthContext";
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

const Chat = ({ selectedUser }: ChatProps) => {
  const {logout} = useAuth();
  const { id } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  // JOIN ROOM
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit("join_conversation");
  }, []);

  // RECEIVE MESSAGE
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("receive_message", (msg: any) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: msg.content,
          sender: "other",
        },
      ]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  // SEND MESSAGE
  const sendMessage = () => {
    const socket = getSocket();
    if (!socket || !input.trim()) return;

    socket.emit("send_message", {
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
      <div className="flex-1 overflow-y-auto p-4 pb-24 md:pb-4 flex flex-col gap-2">
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
