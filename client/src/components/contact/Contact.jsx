import React from 'react'
import './Contact.scss'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import newRequest from '../../utils/newRequest'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { RiMessage2Line } from "react-icons/ri";


const Contact = ({dataUser}) => {

    if (!dataUser) {
        return <div>Loading...</div>; // Or some other placeholder
    }

    const userId = dataUser._id;
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    //
    const navigate = useNavigate(); 
    const handleContact = async ()=>{
      const sellerId = currentUser._id;
      const buyerId = userId;
      const id = sellerId + buyerId;
  

  
      try {
        const res = await newRequest.get(`/conversations/single/${[sellerId, buyerId].sort().join('')}`);
        navigate(`/chat`);
        
      } catch (err) {
        if(err.response.status === 404){
          const res = await newRequest.post(`/conversations`, {to:sellerId , from:buyerId});
          navigate(`/chat`);
        }
      }
      
    } 
  return (
    <div className='contactbox'>
        <div className="talent">
            
            <div className="user">
              <Link className='link' to={`/profile/${dataUser._id}`} ><img src={dataUser.img || "/noavatar.png"} alt="" /></Link>
              <div className="details">
             
              </div>
            </div>

            <button onClick={handleContact}><RiMessage2Line size={20}/>Contact User</button>
        </div>
    </div>
  )
}

export default Contact