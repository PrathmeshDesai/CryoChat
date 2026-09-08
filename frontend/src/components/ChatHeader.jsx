import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js"
import { useChatStore } from "../store/useChatStore.js";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  if (!selectedUser) return null;

  const safeOnlineUsers = Array.isArray(onlineUsers) ? onlineUsers : [];
  const selectedUserId = selectedUser._id || selectedUser.id;
  const isOnline = safeOnlineUsers.includes(selectedUserId);

  return (
    <div className="p-3 border-b border-base-300 bg-base-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser?.profilePic || "/avatar.png"}
                alt={selectedUser?.fullName || "User Avatar"}
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-base-content">{selectedUser?.fullName}</h3>
            <p className="text-xs text-base-content/70">
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <button 
          type="button"
          onClick={() => setSelectedUser(null)}
          className="p-1 hover:bg-base-200 rounded-full transition-colors cursor-pointer"
        >
          <X className="size-5 text-base-content" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;