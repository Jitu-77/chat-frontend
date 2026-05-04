import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiService } from "../api/apiService";
import defaultUser from "../assets/user.png";
import Chat from "./Chat";
import logOut from "../assets/logOut.png";
import deleteImage from "../assets/delete.png";
import plus from "../assets/plus+.png";
import { useAuth } from "../context/AuthContext";
import Search from "./Search";
import CreateGroup from "./CreateGroup";
import { getSocket } from "../socket/socket";
interface ChatType {
  conversationId: number;
  name: string;
  profilePic: string;
  lastMessage: string;
  lastMessageTime: string | null;
  unreadCount?: number; // 🔥 ADD THIS if not already
}

interface ChatListResponse {
  success: boolean;
  data: ChatType[];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [chatList, setChatList] = useState<ChatType[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatType | null>(null);
  const { user }: any = useAuth();
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<
    number | null
  >(null);
  const socket: any = getSocket();
  const getList = async () => {
    try {
      const res: any =
        await apiService.get<ChatListResponse>("/conversation/home");
      setChatList([...(res.data || [])]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getList();
  }, []);

  // useEffect(() => {
  //   if (window.innerWidth >= 768 && chatList.length > 0) {
  //     setSelectedUser(chatList[0]);
  //     console.log(chatList[0]);
  //   }
  // }, [chatList]);
  useEffect(() => {
    if (
      window.innerWidth >= 768 &&
      chatList.length > 0 &&
      !selectedUser // 🔥 only if nothing selected
    ) {
      setSelectedUser(chatList[0]);
      setActiveConversationId(chatList[0].conversationId); // keep sync
    }
  }, [chatList, selectedUser]);
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsGroupModalOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);
  useEffect(() => {
    document.body.style.overflow = isGroupModalOpen ? "hidden" : "auto";
  }, [isGroupModalOpen]);
  useEffect(() => {
    if (!socket) return;
    // socket.on("dashboard_update", (data) => {
    //   console.log("Dashboard update:.......", data);

    //   setChatList((prev) => {
    //     let found = false;

    //     const updated = prev.map((chat: any) => {
    //       if (chat.conversationId === data.conversationId) {
    //         found = true;

    //         return {
    //           ...chat,
    //           lastMessage: data.lastMessage,
    //           lastMessageTime: data.lastMessageTime,
    //           unreadCount: (chat.unreadCount || 0) + 1, // 🔥 important
    //         };
    //       }
    //       return chat;
    //     });

    //     // 🔥 If new conversation (not in list)
    //     if (!found) {
    //       getList(); // fallback
    //     }

    //     // 🔥 Move updated chat to top (WhatsApp behavior)
    //     updated.sort((a, b) => {
    //       return (
    //         new Date(b.lastMessageTime || 0).getTime() -
    //         new Date(a.lastMessageTime || 0).getTime()
    //       );
    //     });

    //     return updated;
    //   });
    // });

    socket.on("dashboard_update", (data: any) => {
      setChatList((prev) => {
        let updated = prev.map((chat: any) => {
          if (chat.conversationId == data.conversationId) {
            return {
              ...chat,
              lastMessage: data.lastMessage,
              lastMessageTime: data.lastMessageTime,
              unreadCount: (chat.unreadCount || 0) + 1,
              // // 🔥 only increment if NOT active chat
              // unreadCount:
              //   chat.conversationId == activeConversationId
              //     ? 0
              //     : (chat.unreadCount || 0) + 1,
            };
          }
          return chat;
        });

        // 🔥 SORT BUT DO NOT CHANGE ACTIVE CHAT
        updated.sort((a, b) => {
          return (
            new Date(b.lastMessageTime || 0).getTime() -
            new Date(a.lastMessageTime || 0).getTime()
          );
        });

        return updated;
      });
    });
    return () => {
      socket.off("dashboard_update");
    };
  }, []);
  useEffect(() => {
    if (!socket) return;

    socket.on("messages_read", (data: { conversationId: number }) => {
      setChatList((prev) =>
        prev.map((chat) =>
          chat.conversationId === data.conversationId
            ? { ...chat, unreadCount: 0 }
            : chat,
        ),
      );
    });

    return () => {
      socket.off("messages_read");
    };
  }, []);
  useEffect(() => {
    // 👉 optional: restrict to desktop
    if (window.innerWidth < 768) return;

    if (!selectedUser) return;

    const timeout = setTimeout(() => {
      setChatList((prev) =>
        prev.map((chat) =>
          chat.conversationId === selectedUser.conversationId
            ? { ...chat, unreadCount: 0 }
            : chat,
        ),
      );
    }, 800);

    return () => clearTimeout(timeout);
  }, [chatList, selectedUser]);
  const handleUserSelect = (selectedUser: any) => {
    console.log("Selected user:", selectedUser);
    console.log("ChatList", chatList);
    if (selectedUser?.id) {
      if (
        chatList?.length &&
        chatList.some((data: any) => selectedUser.id === data.id)
      ) {
        console.log("Selected user match:", selectedUser);
        let selectedChat: any = chatList.find(
          (data: any) => data.id === selectedUser.id,
        );
        console.log("Selected chat", selectedChat);
        if (selectedChat) {
          if (window.innerWidth < 768) {
            navigate(`/chat/${selectedChat.conversationId}`, {
              state: { selectedUser: selectedChat },
            });
          } else {
            setSelectedUser(selectedChat);
          }
        } else {
          console.log("Check Here 1");
        }
        return;
      }
      console.log("Selected user not match:", selectedUser);
      createConv(selectedUser);
      return;
    }
    // future:
    // open chat OR create conversation
  };
  const handleCreateGroup = (data: any) => {
    console.log("handleCreateGroup", data);
    if (data) {
      getList();
    }
  };
  const createConv = async (userDetails: any) => {
    console.log("createConv", userDetails);
    const response: any = await apiService.post("conversation/create", {
      otherUserId: userDetails.id,
    });
    if (response?.success) {
      await apiService
        .get<ChatListResponse>("/conversation/home")
        .then((res: any) => {
          console.log("res", res);
          setChatList([...(res.data || [])]);
          let selectedChat: any = res.data.find(
            (data: any) => data.id == userDetails.id,
          );
          console.log("Selected chat", selectedChat);
          if (selectedChat) {
            if (window.innerWidth < 768) {
              navigate(`/chat/${selectedChat.conversationId}`, {
                state: { selectedUser: selectedChat },
              });
            } else {
              setSelectedUser(selectedChat);
            }
          } else {
            console.log("Check Here 2");
          }
        });
    }
    return;
  };
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
        <div>
          <Search onUserSelect={handleUserSelect} />
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {chatList.map((chat: any) => (
            <div
              key={chat.conversationId}
              onClick={() => {
                // --------
                setActiveConversationId(chat.conversationId);

                // 🔥 reset unread locally
                setChatList((prev) =>
                  prev.map((c) =>
                    c.conversationId === chat.conversationId
                      ? { ...c, unreadCount: 0 }
                      : c,
                  ),
                );

                // 🔥 notify backend
                socket.emit("message_read", {
                  conversationId: chat.conversationId,
                });
                // --------
                if (window.innerWidth < 768) {
                  navigate(`/chat/${chat.conversationId}`, {
                    state: { selectedUser: chat },
                  });
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
                {chat.unreadCount > 0 && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full self-end">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
              <div>
                {/* <img
              className="w-5 h-5 rounded-full flex-shrink-0"
              src={deleteImage}
              alt="deleteImage"
              onClick={() => {
                console.log("deleteImage");
              }}
            />   */}
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

      <div
        className="
    fixed 
    bottom-6 right-6 
    md:bottom-6 md:left-6 lg:right-12

    w-14 h-14 
    rounded-full 
    
    bg-indigo-600 hover:bg-indigo-700
    
    flex items-center justify-center
    
    shadow-lg hover:shadow-xl
    transition-all duration-300
    
    cursor-pointer
    z-[9999]
  "
        onClick={() => {
          console.log("plus");
          setIsGroupModalOpen(true);
        }}
      >
        <img className="w-6 h-6" src={plus} alt="plus" />
      </div>

      <CreateGroup
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        chatList={chatList}
        onCreateGroup={handleCreateGroup}
      />
    </div>
  );
};

export default Dashboard;
