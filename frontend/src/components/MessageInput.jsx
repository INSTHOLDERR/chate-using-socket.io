import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Smile, Paperclip } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = ({ replyingTo, setReplyingTo }) => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2 p-2 bg-gray-50 rounded-lg inline-flex animate-fade-in">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-16 h-16 object-cover rounded-lg border border-gray-300 shadow-sm"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition shadow-md"
              type="button"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
          <span className="text-xs text-gray-500">Image ready to send</span>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="flex items-end gap-2">
        <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
          <textarea
            className="flex-1 bg-transparent rounded-2xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none resize-none"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            rows={1}
            style={{ maxHeight: '100px' }}
          />
          
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            title="Attach image"
          >
            <Image size={20} />
          </button>
          
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
            title="Add emoji"
          >
            <Smile size={20} />
          </button>
        </div>
        
        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="p-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;