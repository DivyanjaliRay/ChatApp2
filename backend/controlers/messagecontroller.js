//messagecontroller

import Conversation from "../models/conversationmodel.js";
import Message from "../models/messagemodel.js";
import mongoose from "mongoose";
import User from "../models/usermodel.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        lastMessage: message
      });
    } else {
      // Update the lastMessage
      conversation.lastMessage = message;
      await conversation.save();
    }

    // Create new message
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      conversationId: conversation._id
    });

    if (newMessage) {
      await newMessage.save();
    }

    // Populate sender details
    const populatedMessage = await Message.findById(newMessage._id)
      .populate('senderId', 'fullName username profilePic')
      .lean();

    // Add sender details to the response
    const responseMessage = {
      ...populatedMessage,
      senderName: populatedMessage.senderId.fullName,
      senderUsername: populatedMessage.senderId.username,
      senderProfilePic: populatedMessage.senderId.profilePic
    };

    res.status(201).json(responseMessage);
  } catch (error) {
    console.error("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(userToChatId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    console.log('Fetching messages between:', senderId, 'and', userToChatId);

    // Find conversation and populate messages
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate('participants', 'fullName username profilePic');

    if (!conversation) {
      console.log('No conversation found');
      return res.status(200).json([]);
    }

    // Get messages for this conversation
    const messages = await Message.find({
      conversationId: conversation._id
    }).sort({ createdAt: 1 });

    // Get all unique sender IDs
    const senderIds = [...new Set(messages.map(msg => msg.senderId))];
    
    // Get all sender details
    const senders = await User.find({ _id: { $in: senderIds } })
      .select('fullName username profilePic')
      .lean();

    // Create a map of sender details
    const senderMap = senders.reduce((acc, sender) => {
      acc[sender._id.toString()] = sender;
      return acc;
    }, {});

    // Add sender details to each message
    const messagesWithSenders = messages.map(message => ({
      ...message.toObject(),
      senderName: senderMap[message.senderId.toString()]?.fullName,
      senderUsername: senderMap[message.senderId.toString()]?.username,
      senderProfilePic: senderMap[message.senderId.toString()]?.profilePic
    }));

    console.log(`Found ${messages.length} messages`);

    res.status(200).json(messagesWithSenders);
  } catch (error) {
    console.error("Error in getMessages controller:", error);
    res.status(500).json({ 
      error: "Internal server error", 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};