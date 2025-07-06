import React from 'react';
import PropTypes from 'prop-types';

const Message = ({ message, isSender }) => {
  const bubbleClasses = isSender
    ? 'bg-blue-500 text-white rounded-2xl rounded-br-none'
    : 'bg-gray-200 text-gray-800 rounded-2xl rounded-bl-none';

  return (
    <div className={`w-full flex ${isSender ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] px-4 py-2 ${bubbleClasses}`}
        style={{ wordBreak: 'break-word' }}
      >
        <div className="text-sm">{message.message}</div>
        <div
          className={`text-xs mt-1 ${
            isSender ? 'text-blue-100 text-right' : 'text-gray-500 text-left'
          }`}
        >
          {new Date(message.timestamp || message.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.shape({
    message: PropTypes.string.isRequired,
    timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    senderId: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    receiverId: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  }).isRequired,
  isSender: PropTypes.bool.isRequired,
};

export default Message; 