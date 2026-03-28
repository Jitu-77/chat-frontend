import { useNavigate } from "react-router-dom";

const chats = [
  { id: 1, name: "John Doe", message: "Hey bro!", time: "10:30 AM" },
  { id: 2, name: "Alice", message: "Let's meet tomorrow", time: "9:15 AM" },
  { id: 3, name: "Bob", message: "Project done!", time: "Yesterday" },
  { id: 4, name: "Emma", message: "Call me", time: "Yesterday" },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen grid grid-cols-12 bg-gray-100">
      
      {/* Sidebar */}
      <div className="col-span-12 md:col-span-4 lg:col-span-3 bg-white p-4 border-r">

        <h2 className="text-xl font-semibold mb-4">Chats</h2>

        <div className="flex flex-col gap-3">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => navigate(`/chat/${chat.id}`)}
              className="p-3 rounded-xl cursor-pointer hover:bg-gray-100 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{chat.name}</h3>
                <p className="text-sm text-gray-500">{chat.message}</p>
              </div>

              <span className="text-xs text-gray-400">{chat.time}</span>
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