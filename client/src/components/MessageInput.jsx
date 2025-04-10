import { useRef, useState } from "react";
import { useChatStore } from "../store/useChat.Store";
import { Image, Send, Smile, Paperclip, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage,isSending } = useChatStore();

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

  const removeImage = () => {v 
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
     toast.error('connection problem')
    }
  };

  return (
    <div className="p-4 bg-[#17212b] border-t border-[#242f3d]">
      {imagePreview && (
        <div className="mb-3">
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-32 rounded-lg border border-[#242f3d]"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#242f3d] hover:bg-[#2f3b4b]
              flex items-center justify-center transition-colors"
              type="button"
            >
              <X className="size-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 bg-[#242f3d] rounded-full px-4 py-2">
          <button
            type="button"
            className="p-2 hover:bg-[#2f3b4b] rounded-full transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="size-5 text-gray-400" />
          </button>
          
          <input
            type="text"
            className="flex-1 bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none text-sm"
            placeholder="Write a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          
       

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        </div>

        <button
        
          type="submit"
          className="btn btn-circle bg-[#2AABEE] hover:bg-[#229ad9] border-none disabled:bg-[#242f3d]"
          disabled={(!text.trim() && !imagePreview) || isSending}
        >
          <Send className="size-5 text-white"/>
        </button>
      </form>
    </div>
  );
};

export default MessageInput;