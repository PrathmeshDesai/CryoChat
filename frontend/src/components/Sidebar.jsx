import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, UserPlus } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading, searchAndAddUser, isSearching } =
    useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");

  const safeOnlineUsers = Array.isArray(onlineUsers) ? onlineUsers : [];

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const handleAddContact = (e) => {
    e.preventDefault();
    if (!searchEmail.trim()) return;
    searchAndAddUser(searchEmail.trim());
    setSearchEmail("");
  };

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => safeOnlineUsers.includes(user._id || user.id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  const currentSelectedId = selectedUser?._id || selectedUser?.id;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        {/* Add Contact Form */}
        <form onSubmit={handleAddContact} className="mt-3 flex items-center gap-2">
          <input
            type="email"
            placeholder="Search email to add..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="input input-sm input-bordered w-full hidden lg:block"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="btn btn-sm btn-primary hidden lg:flex items-center justify-center"
            title="Add Contact"
          >
            {isSearching ? <span className="loading loading-spinner loading-xs"></span> : <UserPlus className="size-4" />}
          </button>
        </form>

        {/* Online Filter */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({Math.max(0, safeOnlineUsers.length - 1)} online)
          </span>
        </div>
      </div>

      {/* Contacts List */}
      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.length === 0 ? (
          <div className="text-center text-zinc-500 py-4 text-sm px-2">
            {users.length === 0
              ? "No contacts yet. Search an email above to start chatting!"
              : "No online users"}
          </div>
        ) : (
          filteredUsers.map((user) => {
            const userId = user._id || user.id;
            const isSelected = currentSelectedId === userId;
            const isOnline = safeOnlineUsers.includes(userId);

            return (
              <button
                type="button"
                key={userId}
                onClick={() => setSelectedUser(user)}
                className={`
                  w-full p-3 flex items-center gap-3
                  hover:bg-base-300 transition-colors cursor-pointer
                  ${isSelected ? "bg-base-300 ring-1 ring-base-300" : ""}
                `}
              >
                <div className="relative mx-auto lg:mx-0">
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.fullName}
                    className="size-12 object-cover rounded-full"
                  />
                  {isOnline && (
                    <span
                      className="absolute bottom-0 right-0 size-3 bg-green-500 
                      rounded-full ring-2 ring-zinc-900"
                    />
                  )}
                </div>

                <div className="hidden lg:block text-left min-w-0">
                  <div className="font-medium truncate">{user.fullName}</div>
                  <div className="text-sm text-zinc-400">
                    {isOnline ? "Online" : "Offline"}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
};

export default Sidebar;