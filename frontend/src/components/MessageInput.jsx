import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Smile } from "lucide-react";
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
    reader.onloadend = () => setImagePreview(reader.result);
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
      await sendMessage({ text: text.trim(), image: imagePreview });
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="p-2 sm:p-4 bg-base-100 border-t border-base-200">
      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2 p-2 bg-base-200 rounded-lg animate-fade-in">
          <div className="relative flex-shrink-0">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-14 h-14 object-cover rounded-lg border border-base-300 shadow-sm"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-5 h-5 bg-error rounded-full flex items-center justify-center hover:opacity-80 transition shadow-md"
              type="button"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
          <span className="text-xs text-base-content/60">Image ready to send</span>
        </div>
      )}

      {/* Input Row */}
      <div className="flex items-end gap-2">
        {/* Text + icon area */}
        <div className="flex-1 min-w-0 flex items-end gap-1 bg-base-200 rounded-2xl border border-base-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 transition-all">
          <textarea
            className="flex-1 min-w-0 bg-transparent px-3 py-2.5 text-sm text-base-content placeholder:text-base-content/40 focus:outline-none resize-none"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            rows={1}
            style={{ maxHeight: "100px" }}
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
            className="flex-shrink-0 p-2 text-base-content/50 hover:text-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
            title="Attach image"
          >
            <Image size={18} />
          </button>

          <button
            type="button"
            className="flex-shrink-0 p-2 pr-3 text-base-content/50 hover:text-primary transition-colors"
            title="Add emoji"
          >
            <Smile size={18} />
          </button>
        </div>

        {/* Send button */}
        <button
          onClick={handleSendMessage}
          disabled={!text.trim() && !imagePreview}
          className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 transform"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
