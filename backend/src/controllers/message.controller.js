import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

// Fetch ONLY users added in the logged-in user's contacts array
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const user = await User.findById(loggedInUserId).populate(
      "contacts",
      "-password"
    );

    res.status(200).json(user.contacts || []);
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Search user by exact email address
export const searchUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email parameter is required" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "No user found with this email" });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot add yourself as a contact" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in searchUserByEmail:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add searched user to contacts (mutual connection)
export const addContact = async (req, res) => {
  try {
    const { contactId } = req.body;
    const userId = req.user._id;

    if (!contactId) {
      return res.status(400).json({ message: "Contact ID is required" });
    }

    // Add to current user's contacts list
    await User.findByIdAndUpdate(userId, {
      $addToSet: { contacts: contactId },
    });

    // Add current user to contact's contacts list
    await User.findByIdAndUpdate(contactId, {
      $addToSet: { contacts: userId },
    });

    const addedUser = await User.findById(contactId).select("-password");
    res.status(200).json(addedUser);
  } catch (error) {
    console.error("Error in addContact:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // Realtime Socket Emission
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};