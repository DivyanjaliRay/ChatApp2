import { forwardRef } from "react";
import { format, parseISO } from "date-fns";
import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";

const Message = forwardRef(({ message, isOwnMessage }, ref) => {
	const { authUser } = useAuthContext();
	const { onlineUsers } = useSocketContext();
	const { selectedConversation } = useConversation();
	const isOnline = onlineUsers.includes(message.senderId);

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

	// Format the timestamp
	const formatTime = (timestamp) => {
		try {
			const date = typeof timestamp === 'string' ? parseISO(timestamp) : new Date(timestamp);
			return format(date, "h:mm a");
		} catch (error) {
			console.error("Error formatting date:", error);
			return "";
		}
	};

	// Get the correct display name
	const getDisplayName = () => {
		if (isOwnMessage) {
			return authUser?.fullName || 'You';
		}

		// For received messages, use the conversation's fullName
		if (selectedConversation) {
			return selectedConversation.fullName || selectedConversation.username;
		}

		// Fallback to message sender info if available
		return message?.senderName || message?.senderUsername || 'Unknown User';
	};

	const displayName = getDisplayName();
	const initials = getInitials(displayName);
	const bgColor = getBackgroundColor(displayName);

	return (
		<div
			ref={ref}
			className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}
		>
			{!isOwnMessage && (
				<div className="flex-shrink-0 mr-2">
					<div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center text-white font-semibold text-sm`}>
						{initials}
						{isOnline && (
							<div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
						)}
					</div>
				</div>
			)}
			
			<div className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"} max-w-[70%]`}>
				{!isOwnMessage && (
					<span className="text-xs text-gray-500 mb-1">
						{displayName}
					</span>
				)}
				
				<div 
					className={`rounded-lg px-4 py-2 ${
						isOwnMessage 
							? "bg-blue-500 text-white rounded-br-none" 
							: "bg-gray-100 text-gray-800 rounded-bl-none"
					}`}
				>
					<p className="break-words">{message?.message || ''}</p>
				</div>
				
				<span className="text-xs text-gray-500 mt-1">
					{formatTime(message?.createdAt)}
				</span>
			</div>

			{isOwnMessage && (
				<div className="flex-shrink-0 ml-2">
					<div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center text-white font-semibold text-sm`}>
						{initials}
						{isOnline && (
							<div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
						)}
					</div>
				</div>
			)}
		</div>
	);
});

Message.displayName = "Message";

export default Message;