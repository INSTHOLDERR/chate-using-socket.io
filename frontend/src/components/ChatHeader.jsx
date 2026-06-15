import { X, ChevronLeft } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="bg-base-100 border-b border-base-200 shadow-sm flex-shrink-0">
      <div className="px-3 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Back button - mobile only */}
            <button
              onClick={() => setSelectedUser(null)}
              className="md:hidden p-1.5 hover:bg-base-200 rounded-full transition-colors flex-shrink-0"
            >
              <ChevronLeft className="w-5 h-5 text-base-content" />
            </button>

            <div className="relative flex-shrink-0">
              <img
                src={selectedUser.profilePic || `https://ui-avatars.com/api/?background=3b82f6&color=fff&bold=true&name=${selectedUser.fullName}`}
                alt={selectedUser.fullName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-primary shadow-sm"
              />
              {onlineUsers.includes(selectedUser._id) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full ring-2 ring-base-100" />
              )}
            </div>

            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-semibold text-base-content truncate">
                {selectedUser.fullName}
              </h2>
              <div className="flex items-center gap-1">
                {onlineUsers.includes(selectedUser._id) ? (
                  <>
                    <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></div>
                    <p className="text-xs text-success font-medium">Online</p>
                  </>
                ) : (
                  <>
                    <div className="w-1.5 h-1.5 bg-base-content/30 rounded-full"></div>
                    <p className="text-xs text-base-content/50">Offline</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Close - desktop only */}
          <button
            onClick={() => setSelectedUser(null)}
            className="hidden md:flex p-2 hover:bg-base-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-base-content/60" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
