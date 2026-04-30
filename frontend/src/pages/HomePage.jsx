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
    <div className="min-h-screen bg-gray-100 flex pt-16">

      <div className="flex w-full max-w-7xl mx-auto h-[calc(100vh-4rem)] overflow-hidden bg-white">

    
        <div
          className={`
            ${selectedUser ? "hidden md:flex" : "flex"}
            w-full md:w-[300px] border-r
          `}
        >
          <Sidebar />
        </div>

        {/* CHAT */}
        <div
          className={`
            ${selectedUser ? "flex" : "hidden md:flex"}
            flex-1 flex flex-col
          `}
        >
          {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        </div>

      </div>

    </div>
  );
};

export default HomePage;