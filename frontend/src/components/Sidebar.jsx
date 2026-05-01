import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search, Filter, MessageCircle, UserCheck, UserX } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  let filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (searchTerm) {
    filteredUsers = filteredUsers.filter(user =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-80 bg-white border-r border-gray-200 flex flex-col shadow-lg">
      {/* Header */}
      <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-md">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Messages</h2>
            <p className="text-xs text-gray-500">{users.length} contacts</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:bg-blue-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
            </div>
            <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Show online only
            </span>
          </label>
          <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-green-700">{onlineUsers.length - 1} online</span>
          </div>
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <UserX className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No contacts found</p>
            <p className="text-sm text-gray-400 mt-1">
              {searchTerm ? "Try a different search" : "No users available"}
            </p>
          </div>
        ) : (
          filteredUsers.map((user, index) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-4 flex items-center gap-3 transition-all duration-200
                hover:bg-gray-50 border-l-4
                ${selectedUser?._id === user._id 
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-blue-500" 
                  : "border-l-transparent hover:border-l-gray-300"
                }
              `}
            >
              {/* Avatar */}
              <div className="relative">
                <img
                  src={user.profilePic || `https://ui-avatars.com/api/?background=3b82f6&color=fff&bold=true&name=${user.fullName}`}
                  alt={user.fullName}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full ring-2 ring-white animate-pulse" />
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {user.fullName}
                  </h3>
                  {onlineUsers.includes(user._id) && (
                    <span className="text-xs text-green-600 font-medium">● Online</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {onlineUsers.includes(user._id) ? "Available to chat" : "Offline"}
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
};

export default Sidebar;