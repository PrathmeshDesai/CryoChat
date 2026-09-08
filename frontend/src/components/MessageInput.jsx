import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Clock } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [timer, setTimer] = useState("0");
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) return toast.error("Please select an image file");
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
        timer: Number(timer),
      });
      setText("");
      setImagePreview(null);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg border" />
            <button onClick={() => setImagePreview(null)} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center">
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input type="file" accept="image/*" className="hidden" id="image-upload" onChange={handleImageChange} />
          
          <button type="button" className={`hidden sm:flex btn btn-circle ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`} onClick={() => document.getElementById("image-upload").click()}>
            <Image size={20} />
          </button>

          <div className="flex items-center gap-1 bg-base-200 px-2 rounded-lg border border-base-300">
            <Clock className={`size-4 ${timer !== "0" ? "text-warning" : "text-zinc-400"}`} />
            <select value={timer} onChange={(e) => setTimer(e.target.value)} className="bg-transparent text-xs sm:text-sm focus:outline-none cursor-pointer py-1">
              <option value="0">Off (Permanent)</option>
              <option value="36000">10 Hours</option>
              <option value="86400">1 Day</option>
              <option value="2592000">1 Month</option>
              <option value="31536000">1 Year</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-sm btn-circle btn-primary" disabled={!text.trim() && !imagePreview}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;