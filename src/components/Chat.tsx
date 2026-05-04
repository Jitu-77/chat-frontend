import { useEffect, useState } from "react";
import { getSocket } from "../socket/socket";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import back from "../assets/left-arrow.png";
import logOut from "../assets/logOut.png";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { useLocation } from "react-router-dom";
import { useRef } from "react";
interface Message {
  id: number;
  text: string;
  sender: "me" | "other";
  senderId: number;
  createdAt: string;
  status: "sent" | "delivered" | "read";
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
  const { logout } = useAuth();
  const { id } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const { user }: any = useAuth();
  const location = useLocation();
  if (!selectedUser) {
    selectedUser = location?.state?.selectedUser;
  }
  // JOIN ROOM
  useEffect(() => {
    console.log("selectedUser chat", selectedUser);
    if (!user) return;
    const socket = getSocket();
    if (!socket) return;
    const conversationId: any = selectedUser?.conversationId || id;
    if (!conversationId) return;
    getChatMessage();
    // socket.emit("join_conversation");
    socket.emit("join_conversation", Number(conversationId));
    socket.emit("message_read", {
      conversationId: selectedUser?.conversationId,
    });
  }, [selectedUser, id, user]);

  // RECEIVE MESSAGE
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !user) return;
    console.log("user chat", user);
    const handler = (msg: ChatMessage) => {
      setMessages((prev) => [...prev, mapToMessage(msg, user.id)]);
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    };

    socket.on("receive_message", handler);

    return () => {
      socket.off("receive_message", handler);
    };
  }, [user]);
  const getChatMessage = async () => {
    try {
      if (!user) return;
      const conversationId: any = selectedUser?.conversationId || id;
      const chatMessage: any = await api.get(`/conversation/${conversationId}`);
      console.log("chatMessage1", chatMessage);
      if (chatMessage?.status === 200) {
        const data: ChatMessage[] = chatMessage.data.data;
        const formattedMessages = data.map((msg) =>
          mapToMessage(msg, user?.id),
        );
        setMessages(formattedMessages);
        // console.log("user chat",user);
        // console.log("chatMessage1",chatMessage);
        console.log("chatMessage2", messages);
      }
    } catch (error) {
      console.log(error, "CHAT TSX ERROR");
    }
  };
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("message_sent", (serverMsg) => {
      setMessages((prev) =>
        prev.map((msg: any) =>
          msg.tempId === serverMsg.tempId
            ? {
                id: serverMsg.id,
                text: serverMsg.content,
                sender: "me",
                senderId: serverMsg.senderId,
                createdAt: serverMsg.createdAt,
                status: serverMsg.status,
              }
            : msg,
        ),
      );
    });

    return () => {
      socket.off("message_sent");
    };
  }, []);
  const mapToMessage = (msg: ChatMessage, currentUserId: number): Message => {
    // return {
    //   id: msg.id,
    //   text: msg.content,
    //   sender: msg.senderId === currentUserId ? "me" : "other",
    // };
    return {
      id: msg.id,
      text: msg.content,
      sender: msg.senderId === currentUserId ? "me" : "other",
      senderId: msg.senderId,
      createdAt: msg.createdAt,
      status: msg.status,
    };
  };
  // SEND MESSAGE
  const sendMessage = () => {
    const socket = getSocket();
    if (!socket || !input.trim()) return;
    const conversationId = selectedUser?.conversationId || id;
    const tempId = Date.now();
    socket.emit("send_message", {
      conversationId: Number(conversationId),
      content: input,
      tempId, // 🔥 send this
    });

    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        tempId, // 🔥 store
        text: input,
        sender: "me",
        senderId: user.id,
        createdAt: new Date().toISOString(),
        status: "sent",
        temp: true,
      } as any,
    ]);

    setInput("");
  };
  const getTick = (message: any, currentUserId: number) => {
    // if (message.senderId !== currentUserId) return null;
    if (message.sender !== "me") return null;
    if (message.status === "sent") return "✔";
    if (message.status === "delivered") return "✔✔";
    if (message.status === "read") return "✔✔ 🔵";

    return null;
  };
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("message_delivered_update", ({ messageId }) => {
      console.log("message_delivered_update", messageId, messages);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id == messageId ? { ...msg, status: "delivered" } : msg,
        ),
      );
    });

    return () => {
      socket.off("message_delivered_update");
    };
  }, []);
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("message_read_update", ({ messageId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id == messageId ? { ...msg, status: "read" } : msg,
        ),
      );
    });

    return () => {
      socket.off("message_read_update");
    };
  }, []);
  useEffect(() => {
  const el = containerRef.current;
  if (!el) return;

  // 🧠 check if user is near bottom
  const isNearBottom =
    el.scrollHeight - el.scrollTop - el.clientHeight < 120;

  // ✅ always scroll for own messages
  const lastMsg = messages[messages.length - 1];
  const isOwn = lastMsg?.sender === "me";

  if (isOwn || isNearBottom) {
    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });
  }
  }, [messages]);  
  const containerRef = useRef<HTMLDivElement>(null);
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
      <div ref={containerRef}
      className="flex-1 overflow-y-auto p-4 pb-32 md:pb-4 flex flex-col gap-2">
        {/* {messages.map((msg) => (
          
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
        ))
        } */}
        {messages.map((msg) => {
          const isOwn = msg.sender === "me";

          return (
            <div
              key={msg.id}
              className={`max-w-xs px-4 py-2 rounded-xl ${
                isOwn
                  ? "bg-primary text-white self-end"
                  : "bg-white text-gray-800 self-start"
              }`}
            >
              {/* MESSAGE TEXT */}
              <div>{msg.text}</div>

              {/* 🔥 ADD THIS BLOCK */}
              {isOwn && (
                <div className="text-xs text-gray-200 flex items-center gap-1 justify-end mt-1">
                  <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
                  <span>{getTick(msg, user.id)}</span>
                </div>
              )}
            </div>
          );
        })}
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
