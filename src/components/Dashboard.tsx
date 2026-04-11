import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiService } from "../api/apiService";
import defaultUser from "../assets/user.png";
import Chat from "./Chat";
import logOut from "../assets/logOut.png";
import { useAuth } from "../context/AuthContext";
interface ChatType {
  conversationId: number;
  name: string;
  profilePic: string;
  lastMessage: string;
  lastMessageTime: string | null;
}

interface ChatListResponse {
  success: boolean;
  data: ChatType[];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const {logout} = useAuth();
  const [chatList, setChatList] = useState<ChatType[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatType | null>(null);
  const {user} :any = useAuth();
  const getList = async () => {
    try {
      const res: any =
        await apiService.get<ChatListResponse>("/conversation/home");

      // let newData = [
      //   {
      //     conversationId: 19,
      //     name: "FE Teams",
      //     profilePic: null,
      //     lastMessage: "",
      //     lastMessageTime: null,
      //   },
      //   {
      //     conversationId: 18,
      //     name: "Dev Teams",
      //     profilePic: null,
      //     lastMessage: "",
      //     lastMessageTime: null,
      //   },
      //   {
      //     conversationId: 17,
      //     name: "Jitu343s",
      //     profilePic: "",
      //     lastMessage: "",
      //     lastMessageTime: null,
      //   },
      //   {
      //     conversationId: 16,
      //     name: "Jitu3s",
      //     profilePic: "",
      //     lastMessage: "",
      //     lastMessageTime: null,
      //   },
      //   {
      //     conversationId: 119,
      //     name: "FE Teamss",
      //     profilePic: null,
      //     lastMessage: "",
      //     lastMessageTime: null,
      //   },
      //   {
      //     conversationId: 118,
      //     name: "Dev Teamss",
      //     profilePic: null,
      //     lastMessage: "",
      //     lastMessageTime: null,
      //   },
      //   {
      //     conversationId: 117,
      //     name: "Jitu343ss",
      //     profilePic: "",
      //     lastMessage: "",
      //     lastMessageTime: null,
      //   },
      //   {
      //     conversationId: 116,
      //     name: "Jitu3ss",
      //     profilePic: "",
      //     lastMessage: "",
      //     lastMessageTime: null,
      //   },
      // ];

      // setChatList([...newData, ...(res.data || [])]);
      setChatList([...res.data || []]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getList();
  }, []);

  useEffect(() => {
    if (window.innerWidth >= 768 && chatList.length > 0) {
      setSelectedUser(chatList[0]);
      console.log(chatList[0]);
    }
  }, [chatList]);

  return (
    <div className="h-screen overflow-hidden flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-full md:w-[320px] lg:w-[350px] bg-white border-r flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          {/* <h2 className="text-xl font-semibold p-4 border-b">Chats</h2> */}
          <div className="p-3 rounded cursor-pointer hover:bg-gray-100 flex items-center gap-3">
              <img
                className="w-12 h-12 rounded-full flex-shrink-0"
                src={user?.profilePic || defaultUser}
                alt={user?.firstName}
                onError={(e) => {
                  e.currentTarget.src = defaultUser;
                }}
              />

              <div className="flex flex-col flex-1 min-w-0">
                <h3 className="font-semibold truncate">{user.firstName}</h3>
              </div>
          </div>
          <div className="md:hidden px-3 py-1 rounded-lg">
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

        <div className="flex-1 overflow-y-auto p-2">
          {chatList.map((chat) => (
            <div
              key={chat.conversationId}
              onClick={() => {
                if (window.innerWidth < 768) {
                  navigate(`/chat/${chat.conversationId}`);
                } else {
                  setSelectedUser(chat);
                }
              }}
              className="p-3 rounded cursor-pointer hover:bg-gray-100 flex items-center gap-3"
            >
              <img
                className="w-12 h-12 rounded-full flex-shrink-0"
                src={chat.profilePic || defaultUser}
                alt={chat.name}
                onError={(e) => {
                  e.currentTarget.src = defaultUser;
                }}
              />

              <div className="flex flex-col flex-1 min-w-0">
                <h3 className="font-semibold truncate">{chat.name}</h3>

                <p className="text-sm text-gray-500 truncate">
                  {chat.lastMessage || "Start conversation..."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Panel (Desktop only) */}
      <div className="hidden md:flex flex-1">
        {selectedUser ? (
          <Chat selectedUser={selectedUser} />
        ) : (
          <div className="flex items-center justify-center w-full text-gray-400">
            Select a chat
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
