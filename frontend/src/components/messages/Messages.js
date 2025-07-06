// import { useEffect, useRef } from "react";
// import useGetMessages from "../../hooks/useGetMessages";
// import MessageSkeleton from "../skeletons/MessageSkeleton";
// import Message from "./Message";
// //import useListenMessages from "../../hooks/useListenMessages";

// const Messages = () => {
// 	const { messages, loading } = useGetMessages();
// 	//useListenMessages();
// 	const lastMessageRef = useRef();

// 	useEffect(() => {
// 		setTimeout(() => {
// 			lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
// 		}, 100);
// 	}, [messages]);
//   return (
// 		<div className='px-4 flex-1 overflow-auto'>
// 			{!loading &&
// 				messages.length > 0 &&
// 				messages.map((message) => (
// 					<div key={message._id} ref={lastMessageRef}>
// 						<Message message={message} />
// 					</div>
// 				))}

// 			{loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
// 			{!loading && messages.length === 0 && (
// 				<p className='text-center'>Send a message to start the conversation</p>
// 			)}
// 		</div>
// 	);
// };
// export default Messages;

//original
import { useEffect, useRef } from "react";
import Message from "./Message";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import { useAuthContext } from "../../context/AuthContext";

const Messages = () => {
    const { messages, loading } = useGetMessages();
    const lastMessageRef = useRef();
    const messagesEndRef = useRef();
    const { authUser } = useAuthContext();

    // Helper to safely extract an id whether it's a string or populated object
    const extractId = (val) => {
        if (!val) return "";
        return typeof val === "object" && val._id ? val._id : val;
    };

    useEffect(() => {
        const scrollToBottom = () => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        };
        const t = setTimeout(scrollToBottom, 100);
        return () => clearTimeout(t);
    }, [messages]);

    return (
        <div className="px-4 flex-1 overflow-auto">
            <div className="flex flex-col gap-2 py-4">
                {!loading &&
                    messages.length > 0 &&
                    messages.map((message, idx) => {
                        const senderId = extractId(message.senderId);
                        const isSender = String(senderId) === String(authUser?._id);
                        return (
                            <div
                                key={message._id}
                                ref={idx === messages.length - 1 ? lastMessageRef : null}
                                className={`message-container ${
                                    idx === messages.length - 1 ? "animate-slide-up" : ""
                                }`}
                            >
                                <Message message={message} isOwnMessage={isSender} />
                            </div>
                        );
                    })}

                {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
                {!loading && messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="text-center text-gray-500">
                            <p className="text-lg font-semibold mb-2">Start a conversation</p>
                            <p className="text-sm">Type a message below to begin chatting</p>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default Messages;