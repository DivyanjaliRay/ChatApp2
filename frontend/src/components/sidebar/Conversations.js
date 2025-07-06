// frontend/src/components/Conversations.js
//original

import React from "react";
import useGetConversations from "../../hooks/useGetConversations.js";
import Conversation from "./Conversation.js";
import { getRandomEmoji } from "../../utils/emojis.js";

const Conversations = () => {
  const { loading, conversations, error } = useGetConversations();

  // Add this line to log the conversations data
  console.log("Conversations data:", conversations);

  return (
    <div className="py-2 flex flex-col overflow-auto w-[350px] bg-transparent">
      
      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center my-4">
          <span className="loading loading-spinner"></span>
        </div>
      )}

      {/* Error Message */}
      {!loading && error && (
        <div className="text-center text-red-500 p-4">
          <p>{error}</p>
        </div>
      )}

      {/* No Conversations Message */}
      {!loading && (!conversations || conversations.length === 0) && !error && (
        <div className="text-center text-gray-400 p-4">
          <p>No conversations available.</p>
        </div>
      )}

      {/* Conversations List */}
      {!loading && conversations && conversations.map((conversation, idx) => {
        // Add a check to ensure conversation is defined
        if (!conversation) {
          console.warn(`Conversation at index ${idx} is undefined.`);
          return null;
        }

        // Determine the unique identifier for the key
        const uniqueId = conversation._id || conversation.id;

        return (
          <Conversation
            key={uniqueId}
            conversation={conversation}
            emoji={getRandomEmoji()}
            lastIdx={idx === conversations.length - 1}
          />
        );
      })}

    </div>
  );
};
export default Conversations;


// import useGetConversations from "../../hooks/useGetConversations";
// import { getRandomEmoji } from "../../utils/emojis";
// import Conversation from "./Conversation";

// const Conversations = () => {
// 	const { loading, conversations } = useGetConversations();
// 	return (
// 		<div className='py-2 flex flex-col overflow-auto'>
// 			{conversations.map((conversation, idx) => (
// 				<Conversation
// 					key={conversation._id}
// 					conversation={conversation}
// 					emoji={getRandomEmoji()}
// 					lastIdx={idx === conversations.length - 1}
// 				/>
// 			))}

// 			{loading ? <span className='loading loading-spinner mx-auto'></span> : null}
// 		</div>
// 	);
// };
// export default Conversations;




//chatgpt
// import React from "react";
// import useGetConversations from "../../hooks/useGetConversations.js";
// import Conversation from "./Conversation.js";
// import { getRandomEmoji } from "../../utils/emojis.js";

// const Conversations = () => {
//   const { loading, conversations, error } = useGetConversations();

//   console.log("Conversations data:", conversations);

//   return (
//     <div className="py-2 flex flex-col overflow-auto w-[350px] bg-transparent">
      
//       {loading && (
//         <div className="flex justify-center my-4">
//           <span className="loading loading-spinner"></span>
//         </div>
//       )}

//       {!loading && error && (
//         <div className="text-center text-red-500 p-4">
//           <p>{error}</p>
//         </div>
//       )}

//       {!loading && (!conversations || conversations.length === 0) && !error && (
//         <div className="text-center text-gray-400 p-4">
//           <p>No conversations available.</p>
//         </div>
//       )}

//       {!loading && conversations && conversations.map((conversation, idx) => {
//         if (!conversation) {
//           console.warn(`Conversation at index ${idx} is undefined.`);
//           return null;
//         }

//         const uniqueId = conversation._id || conversation.id;

//         return (
//           <Conversation
//             key={uniqueId}
//             conversation={conversation}
//             emoji={getRandomEmoji()}
//             lastIdx={idx === conversations.length - 1}
//           />
//         );
//       })}
//     </div>
//   );
// };

// export default Conversations;

