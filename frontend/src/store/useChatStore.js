import { create } from "zustand";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore.js";
import { axiosInstance } from "../lib/axios.js";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSearching: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      const fetchedUsers = Array.isArray(res.data) ? res.data : [];

      const currentSelected = get().selectedUser;
      let updatedSelected = currentSelected;

      if (currentSelected) {
        const currentId = currentSelected._id || currentSelected.id;
        const match = fetchedUsers.find((u) => (u._id || u.id) === currentId);
        if (match) updatedSelected = match;
      }

      set({ users: fetchedUsers, selectedUser: updatedSelected });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch contacts");
      set({ users: [] });
    } finally {
      set({ isUsersLoading: false });
    }
  },

  searchAndAddUser: async (email) => {
    set({ isSearching: true });
    try {
      const searchRes = await axiosInstance.get(`/messages/search?email=${email}`);
      const foundUser = searchRes.data;
      const foundId = foundUser._id || foundUser.id;

      const existingUsers = get().users;
      if (existingUsers.some((u) => (u._id || u.id) === foundId)) {
        toast.error("User is already in your contacts");
        set({ selectedUser: foundUser });
        return;
      }

      const addRes = await axiosInstance.post("/messages/add-contact", {
        contactId: foundId,
      });

      const addedUser = addRes.data;
      set({ users: [...get().users, addedUser], selectedUser: addedUser });
      toast.success("Contact added successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "User not found");
    } finally {
      set({ isSearching: false });
    }
  },

  getMessages: async (userId) => {
    if (!userId) return;
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: Array.isArray(res.data) ? res.data : [] });
    } catch (error) {
      console.error("Error fetching messages:", error);
      set({ messages: [] });
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser } = get();
    if (!selectedUser) return toast.error("No user selected");

    const recipientId = selectedUser._id || selectedUser.id;
    if (!recipientId) return toast.error("Invalid user selection");

    try {
      const res = await axiosInstance.post(`/messages/send/${recipientId}`, messageData);
      const sentMsg = res.data.newMessage || res.data;
      
      // Functional state update prevents UI lag
      set((state) => ({ messages: [...state.messages, sentMsg] }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
      const { selectedUser } = get();
      if (!selectedUser) return;

      const selectedUserId = selectedUser._id || selectedUser.id;
      const isMessageFromSelectedUser = newMessage.senderId === selectedUserId;

      if (!isMessageFromSelectedUser) return;

      // Functional updater ensures fresh state reading
      set((state) => {
        const exists = state.messages.some(
          (m) => (m._id || m.id) === (newMessage._id || newMessage.id)
        );
        if (exists) return state;
        return { messages: [...state.messages, newMessage] };
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));