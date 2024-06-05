import React from 'react'
import './Messages.scss'
import { useRef, useEffect } from 'react'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import newRequest from '../../utils/newRequest'
import { useNavigate } from 'react-router-dom'
import { useQueries, useQueryClient } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import moment from 'moment'



const Messages = () => {

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
 
  

  const queryClient = useQueryClient();
  const { isLoading, error, data } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = await newRequest.get(`/conversations`);
      const conversations = res.data;
  
      // Fetch user data for each conversation
      const promises = conversations.map(async (conversation) => {
        const otherUserId = conversation.sellerId === currentUser._id ? conversation.buyerId : conversation.sellerId;
        const userRes = await newRequest.get(`/users/${otherUserId}`);
        const otherUser = userRes.data;
  
        // Add the other user data to the conversation
        return { ...conversation, otherUser };
      });
  
      const conversationsWithUserData = await Promise.all(promises);
      return conversationsWithUserData;
    },
  });
  
 
 

  
  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.put(`/conversations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["conversations"]);
    },
  });

  const handleRead = (id) => {
    mutation.mutate(id);
  };

  

  return (
    <div className='chat'>
      {isLoading ? ("Loading..") : error ? ("Something went wrong") : (<div className="container">
      
        <div className="leftheader">
          <p>Messages</p>
        </div>

        <div className="itemheader">
          <div className="user">
            <p>User</p>
          </div>

          <div className="shortmessage">
            <p>Message</p>
          </div>

          <div className="date">
            <p>Date</p>
          </div>
        </div>

        {data.map((c)=>(
        <Link className='link' to={`/message/${c.id}`}>
        <div className="itemcontent" key={c.id}>
          <div className="user"  >
            <img src={c.otherUser?.img || "/noavatar.png"} alt="" />
            <div className="info">
              <p>{c.otherUser?.username}</p>
          </div>
             
          </div>
          <div className="shortmessage">
            <p>{c?.lastMessage?.substring(0,20)}...</p>
          </div>
          <div className="date">
            <p>{moment(c.updatedAt).fromNow()}</p>
          </div>
        </div>
        </Link>
        ))} 
        <div className="messagesfoo">
          
          <p>usmtalent.</p>
          <p>All messages exchanged within this chatbox are encrypted to safeguard your confidentiality.</p>
        </div>

    </div>)}
    </div>
  )
}

export default Messages