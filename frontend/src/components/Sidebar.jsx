import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Search, Filter, MessageCircle, UserX } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { getUsers(); }, [getUsers]);

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
    <aside className="h-full w-full bg-base-100 border-r border-base-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-base-200 bg-base-200/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-md">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-base-content">Messages</h2>
            <p className="text-xs text-base-content/50">{users.length} contacts</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-base-100 border border-base-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary text-base-content placeholder:text-base-content/40"
          />
        </div>

        {/* Filter toggle */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-base-300 rounded-full peer peer-checked:bg-blue-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
            </div>
            <span className="text-xs font-medium text-base-content/70 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Online only
            </span>
          </label>
          <div className="flex items-center gap-1 px-2 py-1 bg-success/20 rounded-full">
            <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-success">{onlineUsers.length - 1} online</span>
          </div>
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-3">
              <UserX className="w-8 h-8 text-base-content/30" />
            </div>
            <p className="text-base-content/60 font-medium">No contacts found</p>
            <p className="text-sm text-base-content/40 mt-1">
              {searchTerm ? "Try a different search" : "No users available"}
            </p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center gap-3 transition-all duration-200
                hover:bg-base-200 border-l-4
                ${selectedUser?._id === user._id
                  ? "bg-base-200 border-l-primary"
                  : "border-l-transparent"}
              `}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={user.profilePic || `https://ui-avatars.com/api/?background=3b82f6&color=fff&bold=true&name=${user.fullName}`}
                  alt={user.fullName}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-base-300"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full ring-2 ring-base-100" />
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-base-content truncate text-sm">{user.fullName}</h3>
                  {onlineUsers.includes(user._id) && (
                    <span className="text-xs text-success font-medium ml-1 flex-shrink-0">● Online</span>
                  )}
                </div>
                <p className="text-xs text-base-content/50 truncate">
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
