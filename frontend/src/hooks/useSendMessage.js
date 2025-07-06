// for sending messages
//original
import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { useSocketContext } from "../context/SocketContext";
import { useAuthContext } from "../context/AuthContext";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, addMessage, selectedConversation } = useConversation();
  const { socket } = useSocketContext();
  const { authUser } = useAuthContext();

  const sendMessage = async (message) => {
    if (!selectedConversation?._id || !authUser?._id) {
      toast.error("No conversation selected");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/messages/send/${selectedConversation._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ message })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Ensure the message has the correct sender and receiver IDs
      const messageData = {
        ...data,
        conversationId: selectedConversation._id,
        senderId: authUser._id, // Current user is always the sender
        receiverId: selectedConversation._id, // Selected conversation user is the receiver
        senderName: authUser.fullName,
        createdAt: new Date().toISOString()
      };

      // Add the new message to the messages array with correct sender/receiver info
      addMessage(messageData);

      // Emit the message through socket
      socket?.emit("sendMessage", messageData);

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};

export default useSendMessage;




// import { useState } from "react";
// import useConversation from "../zustand/useConversation";
// import toast from "react-hot-toast";

// const useSendMessage = () => {
// 	const [loading, setLoading] = useState(false);
// 	const { messages, setMessages, selectedConversation } = useConversation();

// 	const sendMessage = async (message) => {
// 		setLoading(true);
// 		try {
// 			const res = await fetch(`/api/messages/send/${selectedConversation._id}`, {
// 				method: "POST",
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 				body: JSON.stringify({ message }),
// 			});
// 			const data = await res.json();
// 			if (data.error) throw new Error(data.error);

// 			setMessages([...messages, data]);
// 		} catch (error) {
// 			toast.error(error.message);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	return { sendMessage, loading };
// };
// export default useSendMessage;

