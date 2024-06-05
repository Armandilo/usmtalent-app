import React from 'react'
import './Chat.scss'
import { BsSendFill } from "react-icons/bs";
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query'
import newRequest from '../../utils/newRequest'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion';





const Chat = () => {

  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  }
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const { isLoading, error, data: conversations } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const conversationsRes = await newRequest.get(`/conversations`);
      const conversationsData = conversationsRes.data;
  
      // Fetch other user's data for each conversation
      const otherUsersDataPromises = conversationsData.map(conversation => 
        newRequest.get(`/users/${conversation.sellerId === currentUser._id ? conversation.buyerId : conversation.sellerId}`)
      );
  
      const lastMessagePromises = conversationsData.map(conversation => 
        newRequest.get(`/conversations/single/${conversation.id}`)
      );
  
      const otherUsersDataRes = await Promise.all(otherUsersDataPromises);
      const lastMessageRes = await Promise.all(lastMessagePromises);
      const otherUsersData = otherUsersDataRes.map(res => res.data);
      const lastMessages = lastMessageRes.map(res => res.data.lastMessage);
  
      // Combine conversations data with other users data
      const combinedData = conversationsData.map((conversation, index) => ({
        ...conversation,
        otherUser: otherUsersData[index],
        lastMessage: lastMessages[index],
      }));
  
      return combinedData;
    },
  });

 



  const navigate = useNavigate(); 
  const handleContact = async (conversation) => {
    const otherUserId = conversation.sellerId === currentUser._id ? conversation.buyerId : conversation.sellerId;
  
    try {
      const res = await newRequest.get(`/conversations/single/${[conversation.sellerId, conversation.buyerId].sort().join('')}`);
      setSelectedUser(otherUserId);
      const messagesRes = await newRequest.get(`/messages/${res.data.id}`);
      setMessages(messagesRes.data);
      setConversationId(res.data.id);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        const res = await newRequest.post(`/conversations`, {to: conversation.sellerId, from: conversation.buyerId});
        setSelectedUser(otherUserId);
        const messagesRes = await newRequest.get(`/messages/${res.data.id}`);
        setMessages(messagesRes.data);
        setConversationId(res.data.id);
      } else {
        console.error(err);
        // Handle other errors appropriately here, e.g., show an error message to the user
      }
    }
  }


  

  const selectedConversation = conversations?.find(conversation => (conversation.sellerId === currentUser._id ? conversation.buyerId : conversation.sellerId) === selectedUser);

  const mutation = useMutation({
    mutationFn: (message) => {
      return newRequest.post(`/messages`, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["messages"]);
      
    },
  });

const handleSubmit = (e) => {
  e.preventDefault();

  // Pass selectedOrder._id as conversationId when calling mutate
  mutation.mutate({
    conversationId: conversationId,
    desc: e.target[0].value,
  });
  e.target[0].value = "";
  handleContact(selectedConversation);
};

  return (
    <div className='chatbox'>
      {isLoading ? ("Loading") : error ? ("Something went wrong") : (<motion.div animate={{x:0,opacity:1}} initial={{x:-60 , opacity:0}} transition={{ ease: "easeOut", duration: 1 }} className="container">
        <div className="left">
          <div className="leftheader">
            <p>Messages</p>
          </div>

          <div className="usermessages">
          {conversations.map((conversation) => ( 
          <div className={selectedUser === (conversation.sellerId === currentUser._id ? conversation.buyerId : conversation.sellerId) ? "user selected" : "user"} onClick={()=> handleContact(conversation)} key={conversation._id}>
            <img src={conversation.otherUser?.img || "/noavatar.png"} alt="" />
            <div className="info">
              <p>{conversation.otherUser?.username}</p>
              <span>{typeof conversation.lastMessage === 'string' ? conversation.lastMessage?.substring(0,20) : ''}...</span>
              
            </div>
          </div>
          ))}


          </div>

          
          
        </div>
        {selectedUser ? (
        <div className="right">
          <div className="rightheader">

            <div className="user">
              <img src={selectedConversation?.otherUser?.img || "/noavatar.png"} alt="" />
              <p>{selectedConversation?.otherUser?.username}</p>
            </div>


          </div>

            <div className="messagebox">
            <div className="messages">
            {messages.map((message) => (
              <div key={message._id} className={message.userId === currentUser._id ? "item owner" : "item"}>
                <img src={message.userId === currentUser._id ? currentUser?.img || "/noavatar.png" : selectedConversation?.otherUser?.img || "/noavatar.png"} alt="" />
                <p>{message.desc}</p>
              </div>
            ))}
              </div>

            </div>
            
            <form className="write" onSubmit={handleSubmit} >
              <textarea name="" placeholder='Write a message' id="" ></textarea>
              <button type='submit'><BsSendFill size={20}/></button>
            </form>
        
        </div>
        ) : (
          <div className="unactive">

            <img className="chatimage" src="/messageorange.png" alt="" />
            <h1></h1>
          </div>

        )}
      </motion.div>)}
    </div>
  )
}

export default Chat