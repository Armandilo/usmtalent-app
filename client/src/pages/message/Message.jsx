import React from 'react'
import './Message.scss'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import newRequest from '../../utils/newRequest'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'


const Message = () => {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["messages"],
    queryFn: () =>
      newRequest.get(`/messages/${id}`).then((res) => {
        return res.data;
      }),
  });

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
    mutation.mutate({
      conversationId: id,
      desc: e.target[0].value,
    });
    e.target[0].value = "";
  };

// Find a message sent by the other user
const otherUserMessage = data?.find(message => message.userId !== currentUser._id);

// Fetch the other user's data
const { data: otherUserData } = useQuery({
  queryKey: ['user', otherUserMessage?.userId],
  queryFn: () => newRequest.get(`/users/${otherUserMessage?.userId}`).then((res) => res.data),
  enabled: !!otherUserMessage?.userId,
});

  // Create a ref
  const messagesContainerRef = useRef(null);

  // Scroll to the bottom of the messages list whenever it updates
  useEffect(() => {
    const element = messagesContainerRef.current;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }, [data]);

  return (
    <div className='message'>
      <div className="container">
        
      <motion.div animate={{x:0,opacity:1}} initial={{x:-20,opacity:0}} transition={{ ease: "easeOut", duration: .5 }} className="messagebox">
        <div className="messageheader">
          <Link to ="/messages"><p>Messages {">"}</p></Link>
          <div className="user">
            <p>{otherUserData?.username}</p>
            <img src={otherUserData?.img || "/noavatar.png"} alt="" />
            
          </div>
          
        </div>
        {isLoading ? ("Loading") : error ? ("Something Went Wrong") : (<div className="messages" ref={messagesContainerRef}>
          {data.map((m) => (
          <div className={m.userId === currentUser._id ? "owner item" : "item"} key={m._id}>
            <img src={m.userId === currentUser._id ? currentUser?.img || "/noavatar.png" : otherUserData?.img || "/noavatar.png"} alt="" />
            <p>
              {m.desc}
            </p>
          </div>
          ))}
        
        </div>)}
        
        <form className="write" onSubmit={handleSubmit}>
          <textarea name="" placeholder='Write a message' id="" ></textarea>
          <button type='submit'>Send</button>
        </form>
        </motion.div>
      </div>
    </div>
  )
}

export default Message