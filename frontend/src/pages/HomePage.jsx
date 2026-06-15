import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser, setSelectedUser } = useChatStore();

  useEffect(() => {
    setSelectedUser(null);
  }, [setSelectedUser]);

  return (
    <div className="h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] flex bg-base-200">
      <div className="flex flex-1 min-h-0 w-full max-w-7xl mx-auto bg-base-100 overflow-hidden">

        {/* SIDEBAR */}
        <div
          className={`
            ${selectedUser ? "hidden md:flex" : "flex"}
            w-full md:w-[300px] lg:w-[340px] border-r flex-shrink-0
          `}
        >
          <Sidebar />
        </div>

        {/* CHAT */}
        <div
          className={`
            ${selectedUser ? "flex" : "hidden md:flex"}
            flex-1 flex-col min-w-0
          `}
        >
          {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        </div>

      </div>
    </div>
  );
};

export default HomePage;