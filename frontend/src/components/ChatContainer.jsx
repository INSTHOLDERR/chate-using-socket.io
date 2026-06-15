import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { MessageCircle, Send, Image as ImageIcon, Smile, CheckCheck } from "lucide-react";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    if (!selectedUser?._id) return;
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages?.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      const date = new Date(message.createdAt).toLocaleDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(message);
    });
    return groups;
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col bg-base-100">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-base-200/50">
        <div className="text-center max-w-md px-8">
          <div className="relative mb-8">
            <div className="w-28 h-28 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-float">
              <MessageCircle className="w-14 h-14 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <Smile className="w-4 h-4 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Welcome to Chate
          </h2>
          <p className="text-base-content/60 mb-6">
            Select a conversation from the sidebar to start chatting
          </p>
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-base-200">
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-xs text-base-content/50">Real-time chat</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <ImageIcon className="w-5 h-5 text-success" />
              </div>
              <p className="text-xs text-base-content/50">Image sharing</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCheck className="w-5 h-5 text-secondary" />
              </div>
              <p className="text-xs text-base-content/50">Read receipts</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex-1 flex flex-col bg-base-200/30 h-full min-h-0">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-4">
              <Send className="w-8 h-8 text-base-content/30" />
            </div>
            <h3 className="text-base font-semibold text-base-content">No messages yet</h3>
            <p className="text-base-content/50 text-sm mt-1">Start a conversation with {selectedUser.fullName}</p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date} className="space-y-3">
              <div className="flex justify-center">
                <div className="px-3 py-1 bg-base-200 rounded-full text-xs text-base-content/60">
                  {date === new Date().toLocaleDateString() ? "Today" : date}
                </div>
              </div>

              {dateMessages.map((message, idx) => {
                const isSent = message.senderId === authUser._id;
                const showAvatar = idx === 0 || dateMessages[idx - 1]?.senderId !== message.senderId;

                return (
                  <div
                    key={message._id}
                    className={`flex ${isSent ? "justify-end" : "justify-start"} animate-fade-in`}
                  >
                    <div className={`flex ${isSent ? "flex-row-reverse" : "flex-row"} items-end gap-2 max-w-[85%] sm:max-w-[70%]`}>
                      {showAvatar && !isSent && (
                        <img
                          src={selectedUser.profilePic || `https://ui-avatars.com/api/?background=3b82f6&color=fff&bold=true&name=${selectedUser.fullName}`}
                          alt={selectedUser.fullName}
                          className="w-7 h-7 rounded-full object-cover shadow-sm flex-shrink-0"
                        />
                      )}
                      {!showAvatar && !isSent && <div className="w-7 flex-shrink-0" />}

                      <div>
                        {showAvatar && !isSent && (
                          <p className="text-xs text-base-content/50 mb-1 ml-2">{selectedUser.fullName}</p>
                        )}
                        <div
                          className={`px-3 py-2 rounded-2xl shadow-sm ${
                            isSent
                              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-sm"
                              : "bg-base-100 text-base-content rounded-bl-sm border border-base-200"
                          }`}
                        >
                          {message.image && (
                            <img
                              src={message.image}
                              alt="attachment"
                              className="max-w-[180px] sm:max-w-[220px] rounded-lg mb-2 cursor-pointer hover:opacity-90 transition"
                              onClick={() => window.open(message.image, "_blank")}
                            />
                          )}
                          {message.text && (
                            <p className="text-sm leading-relaxed break-words">{message.text}</p>
                          )}
                        </div>
                        <div className={`flex items-center gap-1 mt-1 ${isSent ? "justify-end" : "justify-start"}`}>
                          <p className={`text-xs ${isSent ? "text-blue-400" : "text-base-content/40"}`}>
                            {formatMessageTime(message.createdAt)}
                          </p>
                          {isSent && <CheckCheck className="w-3 h-3 text-blue-400" />}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={messageEndRef} />
      </div>

      <MessageInput replyingTo={replyingTo} setReplyingTo={setReplyingTo} />
    </div>
  );
};

export default ChatContainer;
