import { MessageSquare, Users, Sparkles } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center max-w-md px-8">
        {/* Animated Icon */}
        <div className="relative mb-8">
          <div className="w-28 h-28 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-float">
            <MessageSquare className="w-14 h-14 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
          Welcome to Chate
        </h2>
        <p className="text-gray-500 mb-6">
          Select a conversation from the sidebar to start chatting with your friends
        </p>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500">Real-time chat</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <MessageSquare className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-xs text-gray-500">Media sharing</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-xs text-gray-500">Online status</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;