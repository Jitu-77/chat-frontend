import { useState } from "react";
import { apiService } from "../api/apiService";
const CreateGroup = ({ isOpen, onClose, chatList,onCreateGroup }: any) => {
  const [groupName, setGroupName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

  if (!isOpen) return null;

  const filteredUsers = chatList.filter(
    (u: any) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedUsers.some((s) => s.id === u.id)
  );
  const onCreateGroupMethod = async (data:any) =>{
             console.log(data); 
            let payload = {name:data?.groupName,
                userIds:data?.members?.map((user:any) => user.id)
            }
            console.log("payload",payload);
             await apiService.post("conversation/create-group",payload)
             .then((res:any) =>{
                console.log("res",res);
                 onCreateGroup(true);
                 onClose();})
             .catch((err:any) => {
                console.log(err)
                 onCreateGroup(false);
                 onClose();                
            });
  }
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
      
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-[90%] max-w-md rounded-xl shadow-xl p-6 z-10">
        
        <h2 className="text-xl font-semibold mb-4">
          Create Group
        </h2>

        {/* Group Name */}
        <input
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group Name"
          className="w-full border rounded-lg px-3 py-2 mb-3"
        />

        {/* Members */}
        <div className="mb-4 relative">

          {/* Chips */}
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-sm"
              >
                {user.name}
                <span
                  className="cursor-pointer"
                  onClick={() =>
                    setSelectedUsers((prev) =>
                      prev.filter((u) => u.id !== user.id)
                    )
                  }
                >
                  ✕
                </span>
              </div>
            ))}
          </div>

          {/* Input */}
          <input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Add members..."
            className="w-full border rounded-lg px-3 py-2"
          />

          {/* Dropdown */}
          {showDropdown && searchTerm && (
            <ul className="absolute z-50 bg-white border w-full mt-1 rounded-lg shadow max-h-40 overflow-y-auto">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user: any) => (
                  <li
                    key={user.id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedUsers((prev) => [...prev, user]);
                      setSearchTerm("");
                      setShowDropdown(false);
                    }}
                  >
                    {user.name}
                  </li>
                ))
              ) : (
                <li className="px-3 py-2 text-gray-400">
                  No users found
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={() => {
                onCreateGroupMethod({
                groupName,
                members: selectedUsers,
              })
            }}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
          >
            Create
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateGroup;