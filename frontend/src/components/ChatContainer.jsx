import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessagesSkeleton from './Skeleton/MessagesSkeleton.jsx'
import useAuthStore from '../store/useAuthStore.js';

const ChatContainer = () => {
    const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
     
    const { authUser, socket } = useAuthStore(); 
    const messageEndRef = useRef(null);
    
    useEffect(() => {
        if (selectedUser?._id) {
            getMessages(selectedUser._id);
            subscribeToMessages();
        }
        
        return () => unsubscribeFromMessages();
    }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages, socket]); 
 
    useEffect(() => {
        if (messageEndRef.current && messages.length) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages.length]);

    if (isMessagesLoading) {
        return ( 
            <div className='flex-1 flex flex-col overflow-auto'>
                <ChatHeader />
                <MessagesSkeleton />
                <MessageInput />
            </div>
        );
    }

    const formatDateHeader = (dateStr) => { 
        const [year, month, day] = dateStr.split("-");
        const date = new Date(year, month - 1, day);  
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1); 
        if (date.toDateString() === today.toDateString()) return "Today";
        if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
        return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    };
     
    const formatTime = (dateStr) => {
        return new Date(dateStr).toLocaleTimeString("en-IN", { 
            hour: "2-digit", 
            minute: "2-digit",
            hour12: true 
        });
    }; 
    const groupedMessages = messages.reduce((groups, message) => { 
        const date = new Date(message.createdAt).toLocaleDateString("en-CA");  
        if (!groups[date]) groups[date] = [];
        groups[date].push(message);
        return groups;
    }, {});

    return (
        <div className='flex-1 flex flex-col overflow-auto'> 
            <ChatHeader /> 
            <div className='flex-1 flex flex-col overflow-auto p-4'>
                {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                    <div key={date}>
                        <div className='flex justify-center my-3'>
                            <span className='bg-base-300 text-xs px-3 py-1 rounded-full opacity-70'>
                                {formatDateHeader(date)}
                            </span>
                        </div> 
                        {dateMessages.map((message) => {
                            const isSent = message.senderId === authUser._id;
                            return ( 
                                <div key={message._id} className={`chat ${isSent ? "chat-end" : "chat-start"}`}>
                                    <div className='chat-image avatar'>
                                        <div className='size-9 rounded-full border'>
                                            <img
                                                src={isSent ? authUser.profilepic || "/avatar.png" : selectedUser.profilepic || "/avatar.png"}
                                                alt="profile"
                                            />
                                        </div>
                                    </div>
                                 
                                    <div className={`chat-bubble flex flex-col
                                        ${isSent 
                                            ? "bg-primary text-primary-content rounded-2xl rounded-br-sm" 
                                            : "bg-base-200 text-base-content rounded-2xl rounded-bl-sm"}`}
                                    >
                                        {message.image && (
                                            <img src={message.image} alt="attachment" className='sm:max-w-[200px] rounded-xl mb-2' />
                                        )}
                                        {message.text && <p>{message.text}</p>}
                                    </div>

                                    <div className='chat-footer opacity-50 text-xs mt-1'>
                                        {formatTime(message.createdAt)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))} 
                <div ref={messageEndRef} />
            </div>
            <MessageInput />
        </div>
    )
}

export default ChatContainer;