import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiService } from "../api/apiService";
import defaultUser from "../assets/user.png";
interface Chat {
  conversationId: number;
  name: string;
  profilePic: string;
  lastMessage: string;
  lastMessageTime: string | null;
}
interface ChatListResponse {
  success: boolean;
  data: Chat[];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [chatList, setChatList] = useState([]);
  const getList = async () => {
    try {
      const res: any =
        await apiService.get<ChatListResponse>("/conversation/home");
      console.log(res);
      setChatList(res.data);
      setTimeout(() => {
        console.log("CHAT DATA", chatList);
      }, 100);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getList();
  }, []);
  return (
    <div className="h-screen grid grid-cols-12 bg-gray-100">
      {/* Sidebar */}
      <div className="col-span-12 md:col-span-4 lg:col-span-3 bg-white p-4 border-r">
        <h2 className="text-xl font-semibold mb-4">Chats</h2>

        <div className="flex flex-col gap-3">
          {chatList.map((chat: Chat) => (
            // <div
            //   key={chat.conversationId}
            //   onClick={() => navigate(`/chat/${chat.conversationId}`)}
            //   className="p-3 rounded-sm cursor-pointer hover:bg-gray-100 flex justify-between items-center"
            // >
            //   <div className="flex items-center justify-center  flex-col">
            //     <div className="flex items-center justify-between gap-4">
            //       <img
            //       className="w-12 h-12"
            //         src={chat.profilePic ? chat.profilePic : defaultUser}
            //         alt={chat.name}
            //         onError={(e) => {
            //           e.currentTarget.onerror = null;
            //           e.currentTarget.src = defaultUser;
            //         }}
            //       />
            //       <h3 className="font-semibold">{chat.name}</h3>
            //     </div>
            //     <p className="text-sm text-gray-500">{chat.lastMessage||
            //      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."}</p>
            //   </div>

            //   <span className="text-xs text-gray-400">
            //     {chat.lastMessageTime}
            //   </span>
            // </div>
            <div
              key={chat.conversationId}
              onClick={() => navigate(`/chat/${chat.conversationId}`)}
              className="p-3 rounded-sm cursor-pointer hover:bg-gray-100 flex items-center justify-between"
            >
              {/* LEFT SECTION */}
              <div className="flex items-center gap-3 w-full min-w-0">
                {/* Avatar */}
                <img
                  className="w-12 h-12 rounded-full flex-shrink-0"
                  src={chat.profilePic || defaultUser}
                  alt={chat.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = defaultUser;
                  }}
                />

                {/* Name + Message */}
                <div className="flex flex-col flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{chat.name}</h3>

                  <p className="text-sm text-gray-500 truncate">
                    {chat.lastMessage ||
                      "Lorem Ipsum is simply dummy text of the printing and typesetting industry..."}
                  </p>
                </div>
              </div>

              {/* RIGHT SECTION (time) */}
              <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                {chat.lastMessageTime}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Empty state (desktop) */}
      <div className="hidden md:flex col-span-8 lg:col-span-9 items-center justify-center">
        <p className="text-gray-400">Select a chat to start messaging</p>
      </div>
    </div>
  );
};

export default Dashboard;
