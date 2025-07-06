//original
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useConversation from "../zustand/useConversation";
import socket from '../utils/socket';
import { useAuthContext } from "../context/AuthContext";
import { useSocketContext } from "../context/SocketContext";

const useGetMessages = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, addMessage, selectedConversation } = useConversation();
    const { socket } = useSocketContext();
    const { authUser } = useAuthContext();

    useEffect(() => {
        const getMessages = async () => {
            setLoading(true);
            try {
                if (!selectedConversation?._id || !authUser?._id) return;

                const res = await fetch(`http://localhost:8000/api/messages/${selectedConversation._id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                const data = await res.json();
                if (data.error) throw new Error(data.error);

                // Process and normalize message data
                const processedMessages = Array.isArray(data) 
                    ? data.map(message => ({
                        ...message,
                        senderId: String(message.senderId),
                        receiverId: String(message.receiverId)
                    }))
                    : [];

                // Sort messages by createdAt
                const sortedMessages = processedMessages.sort(
                    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                );
                
                setMessages(sortedMessages);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (selectedConversation?._id) {
            getMessages();
        }
    }, [selectedConversation?._id, setMessages, authUser?._id]);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
            if (newMessage.conversationId === selectedConversation?._id) {
                // Normalize the new message data
                const normalizedMessage = {
                    ...newMessage,
                    senderId: String(newMessage.senderId),
                    receiverId: String(newMessage.receiverId)
                };

                // Check if message already exists
                const messageExists = messages.some(msg => msg._id === normalizedMessage._id);
                if (!messageExists) {
                    addMessage(normalizedMessage);
                }
            }
        };

        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [socket, selectedConversation?._id, messages, addMessage]);

    return { messages, loading };
};

export default useGetMessages;



// import { useEffect, useState } from "react";
// import useConversation from "../zustand/useConversation";
// import toast from "react-hot-toast";

// const useGetMessages = () => {
// 	const [loading, setLoading] = useState(false);
// 	const { messages, setMessages, selectedConversation } = useConversation();

// 	useEffect(() => {
// 		const getMessages = async () => {
// 			setLoading(true);
// 			try {
// 				const res = await fetch(`/api/messages/${selectedConversation._id}`);
// 				const data = await res.json();
// 				if (data.error) throw new Error(data.error);
// 				setMessages(data);
// 			} catch (error) {
// 				toast.error(error.message);
// 			} finally {
// 				setLoading(false);
// 			}
// 		};

// 		if (selectedConversation?._id) getMessages();
// 	}, [selectedConversation?._id, setMessages]);

// 	return { messages, loading };
// };
// export default useGetMessages;

