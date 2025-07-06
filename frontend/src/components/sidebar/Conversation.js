// frontend/src/components/Conversation.js
//main code:
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";
import { useSocketContext } from "../../context/SocketContext";

// Default Avatar URL
const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/initials/svg?seed=User";

const Conversation = ({ conversation, lastIdx }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { authUser } = useAuthContext();
  const { socket } = useSocketContext();
  const [lastMessage, setLastMessage] = useState(conversation.lastMessage || "");
  const [lastMessageTime, setLastMessageTime] = useState(
    conversation.updatedAt ? extractTime(conversation.updatedAt) : ""
  );

  const isSelected = selectedConversation?._id === conversation._id;
  
  // Get user details from the conversation
  const fullName = conversation.fullName || "Unknown User";

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Generate random background color based on name
  const getBackgroundColor = (name) => {
    if (!name) return 'bg-gray-500';
    
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-yellow-500',
      'bg-teal-500'
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  const handleConversationClick = () => {
    setSelectedConversation(conversation);
  };

  // Listen for new messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      // Check if the message belongs to this conversation
      if (
        (newMessage.senderId === conversation._id && newMessage.receiverId === authUser._id) ||
        (newMessage.senderId === authUser._id && newMessage.receiverId === conversation._id)
      ) {
        setLastMessage(newMessage.message);
        setLastMessageTime(extractTime(newMessage.createdAt));
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, conversation._id, authUser._id]);

  const initials = getInitials(fullName);
  const bgColor = getBackgroundColor(fullName);

  return (
    <div>
      <div
        className={`flex gap-2 items-center bg-transparent hover:bg-sky-800 rounded p-2 py-1 cursor-pointer transition-colors duration-200 ${
          isSelected ? "bg-sky-800" : "bg-transparent"
        } ${lastIdx ? "" : "border-b border-slate-700"}`}
        onClick={handleConversationClick}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter') handleConversationClick();
        }}
      >
        {/* Avatar Section */}
        <div className="relative">
          <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center text-white font-semibold text-lg`}>
            {initials}
          </div>
          {/* Online Status Badge */}
          {conversation.isOnline && (
            <span className="badge badge-success badge-xs absolute bottom-0 right-0" aria-label="Online"></span>
          )}
        </div>

        {/* Conversation Details */}
        <div className="flex flex-col flex-1">
          <div className="flex gap-3 justify-between items-center">
            <p className="font-bold text-gray-300 truncate">{fullName}</p>
            <span className="text-sm text-gray-400">{lastMessageTime}</span>
          </div>
          
        </div>
      </div>

      {/* Conditional Divider */}
      {!lastIdx && <div className="divider my-0 py-0 h-px bg-gray-700" />}
    </div>
  );
};

export default Conversation;



// import { useSocketContext } from "../../context/SocketContext";
// import useConversation from "../../zustand/useConversation";

// const Conversation = ({ conversation, lastIdx, emoji }) => {
// 	const { selectedConversation, setSelectedConversation } = useConversation();

// 	const isSelected = selectedConversation?._id === conversation._id;
// 	const { onlineUsers } = useSocketContext();
// 	const isOnline = onlineUsers.includes(conversation._id);

// 	return (
// 		<>
// 			<div
// 				className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer
// 				${isSelected ? "bg-sky-500" : ""}
// 			`}
// 				onClick={() => setSelectedConversation(conversation)}
// 			>
// 				<div className={`avatar ${isOnline ? "online" : ""}`}>
// 					<div className='w-12 rounded-full'>
// 						<img src={conversation.profilePic} alt='user avatar' />
// 					</div>
// 				</div>

// 				<div className='flex flex-col flex-1'>
// 					<div className='flex gap-3 justify-between'>
// 						<p className='font-bold text-gray-200'>{conversation.fullName}</p>
// 						<span className='text-xl'>{emoji}</span>
// 					</div>
// 				</div>
// 			</div>

// 			{!lastIdx && <div className='divider my-0 py-0 h-1' />}
// 		</>
// 	);
// };
// export default Conversation;