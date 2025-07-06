import Conversation from "../models/conversationmodel.js";
import User from "../models/usermodel.js";

export const getConversations = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get all conversations for the user
        const conversations = await Conversation.find({
            participants: userId
        })
        .populate({
            path: 'participants',
            select: 'fullName username profilePic isOnline'
        })
        .sort({ updatedAt: -1 });

        // Format conversations to include other participant's info
        const formattedConversations = conversations.map(conv => {
            const otherParticipant = conv.participants.find(p => p._id.toString() !== userId.toString());
            return {
                _id: conv._id,
                fullName: otherParticipant?.fullName || "Unknown User",
                username: otherParticipant?.username,
                profilePic: otherParticipant?.profilePic,
                isOnline: otherParticipant?.isOnline || false,
                lastMessage: conv.lastMessage || "No messages yet",
                updatedAt: conv.updatedAt
            };
        });

        res.status(200).json(formattedConversations);
    } catch (error) {
        console.error("Error in getConversations controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const createConversation = async (req, res) => {
    try {
        const { participantId } = req.body;
        const userId = req.user._id;

        // Check if conversation already exists
        const existingConversation = await Conversation.findOne({
            participants: { $all: [userId, participantId] }
        });

        if (existingConversation) {
            return res.status(200).json(existingConversation);
        }

        // Create new conversation
        const newConversation = new Conversation({
            participants: [userId, participantId]
        });

        await newConversation.save();

        // Populate the conversation with participant details
        const populatedConversation = await Conversation.findById(newConversation._id)
            .populate({
                path: 'participants',
                select: 'fullName username profilePic isOnline'
            });

        // Format the response
        const otherParticipant = populatedConversation.participants.find(
            p => p._id.toString() !== userId.toString()
        );

        const formattedConversation = {
            _id: populatedConversation._id,
            fullName: otherParticipant?.fullName || "Unknown User",
            username: otherParticipant?.username,
            profilePic: otherParticipant?.profilePic,
            isOnline: otherParticipant?.isOnline || false,
            lastMessage: "No messages yet",
            updatedAt: populatedConversation.updatedAt
        };

        res.status(201).json(formattedConversation);
    } catch (error) {
        console.error("Error in createConversation controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}; 