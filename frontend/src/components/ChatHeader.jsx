import { X, MoreVertical, Info, Star, Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useState } from "react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers, authUser } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={selectedUser.profilePic || `https://ui-avatars.com/api/?background=3b82f6&color=fff&bold=true&name=${selectedUser.fullName}`}
                alt={selectedUser.fullName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500 shadow-md"
              />
              {onlineUsers.includes(selectedUser._id) && (
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedUser.fullName}
              </h2>
              <div className="flex items-center gap-1 mt-0.5">
                {onlineUsers.includes(selectedUser._id) ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-xs text-green-600 font-medium">Online</p>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <p className="text-xs text-gray-500">Offline</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Actions - No call buttons */}
          <div className="flex items-center gap-2">
         
            <button 
              onClick={() => setSelectedUser(null)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-2"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;