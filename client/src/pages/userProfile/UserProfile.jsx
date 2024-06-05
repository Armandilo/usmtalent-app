import React from 'react'
import './UserProfile.scss'
import { IoLocationSharp } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { useQuery } from '@tanstack/react-query'
import newRequest from '../../utils/newRequest'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import UserReviews from '../../components/userReviews/UserReviews'
import { motion } from "framer-motion"
import { useEffect } from 'react'
import { useState } from 'react'
import upload from '../../utils/upload'
import { FiPlus } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import Calendar from '../../components/calendar/Calendar';









const UserProfile = () => {

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const {id} = useParams();

  //Handle User Profile Edit
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [newDescription, setNewDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }

    setFile(file);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    let url = dataUser.img; // default to the existing image
    if (file) { // if a new file was selected
      url = await upload(file); // upload the new image
    }
    try {
      await newRequest.put(`/users/${id}`, {
        desc: newDescription,
        img: url,
        datesBooked: selectedDate ? [...dataUser.datesBooked, selectedDate.toDate()] : dataUser.datesBooked
      });

      const updatedUser = { ...currentUser, desc: newDescription, img: url };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setIsEditing(false);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };


  const { isLoading, error, data} = useQuery({
    queryKey: ["mySkills"],
    queryFn: () =>
      newRequest
        .get(
          `/skills?userId=${id}`
        )
        .then((res) => {
          return res.data;
        }),
  });

  const { isLoading: isLoadingUser, error: errorUser, data: dataUser} = useQuery({
    queryKey: ["myUser"],
    queryFn: () =>
      newRequest
        .get(
          `/users/${id}`
        )
        .then((res) => {
          return res.data;
        }),
  });

  const handleEditClick = () => {
    setNewDescription(dataUser.desc);
    setImage(dataUser.img);
    setIsEditing(true);
    
  };

  useEffect(() => {
    window.scrollTo(0, 0);

  }, []);




  return (
    <div className="userprofile">
      <div className="container">
      {isLoadingUser ? ("Loading" ) : errorUser ? ("Something Went Wrong") : (<motion.div animate={{x:0 , opacity:1}} initial={{x:-40 , opacity:0}} transition={{ ease: "easeOut", duration: 0.7 }} className="left">

       <div className="leftuser">

          {currentUser._id === id && !isEditing && (
          <div className="edit">
            <FaRegEdit size={22} onClick={handleEditClick} />
          </div>
          )}

          {currentUser._id === id && isEditing && (
              <div className="edit">
                <FaCheck size={22} onClick={handleSubmit} />
              </div>
          )}

          <div className="userdetails">
            {isEditing ? 
            (
              <>
              <input id='upload-button' type="file" onChange={handleFileChange} style={{display:'none'}}/>
              <button className='inputButton' style={{backgroundImage: `url(${image})`, backgroundSize: 'cover', opacity: '0.9',  backgroundPosition: 'center', }} onClick={()=> document.getElementById('upload-button').click()}></button>
              <div 
                style={{
                  position: 'absolute', 
                  top: '24%', 
                  left: '450px', 
                  transform: 'translate(-50%, -50%)',
                  color: '#FF7600',
                }}
              >
                <FiPlus className="icon"/>
              </div>
              </>
            ) 
            
            : 
            (
            <img src={dataUser.img || "/noavatar.png" } alt="" />
            )}
            <span>{dataUser.username}</span>

            {!isNaN(dataUser.totalStars / dataUser.starNumber)&& (
            <div className="rating">
              {Array(Math.round(dataUser.totalStars / dataUser.starNumber)).fill().map((item,i)=>(
                <img key={i} src="/star.png" alt="" />
              ))}
              <span>{Math.round(dataUser.totalStars / dataUser.starNumber).toFixed(2)}</span>
              <span className="total">{"("}{dataUser.starNumber} reviews{")"}</span>  
            </div>
            )}

            {currentUser._id !== id && (
            <button>Contact Me</button>
            )}
          </div>
          <hr />
          <div className="infobox">
            <div className="items">
              <div className="item">
                <span className="title"><IoLocationSharp />&nbsp;&nbsp;&nbsp;&nbsp;From</span>
                <span className="desc">{dataUser.country}</span>
              </div>
              <div className="item">
                <span className="title"><FaUser />&nbsp;&nbsp;&nbsp;&nbsp;Member Since</span>
                <span className="desc">{new Date(dataUser.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="item">
                <span className="title"><IoTimeOutline />&nbsp;&nbsp;&nbsp;&nbsp;Avg. Response Time</span>
                <span className="desc">1 hour</span>
              </div>

              <div className="item">
                <span className="title"><IoIosSend />&nbsp;&nbsp;&nbsp;&nbsp;Last Delivery</span>
                <span className="desc">10 days</span>
              </div>
            </div>

          </div>
          

        </div> 
        
        <div className="leftdesc">
          <span className="title">Description</span>
          {dataUser && isEditing ? 
          (
            <input type="text" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
          ) 
          :
          (
          <span className="desc">{dataUser.desc}</span>
          )}
        </div>

        <div className="leftbooking">
          <span className="title">Dates Availability</span>
          <div className="cal">
            <Calendar onDateSelect={setSelectedDate} />
            {isEditing && (<button className='databtn' onClick={handleSubmit}>Set Date Availability</button>)}
          </div>
          

        </div>
        
          

        </motion.div>)}

        <div className="right">

        {isLoadingUser ? ("Loading") : errorUser ? ("Something went wrong") : (<div className="rightheader">
            <span>Skills</span>
            
          </div>)}

          {isLoading ? ("Loading") : error ? ("Something went wrong") : (<div className="skills">

          {data.length ===0 ? <h2 className='no-skills'>No Skills...</h2>
          :data.map((skill) => (
          <Link to={`/skill/${skill._id}`} className='link'>
          <div className="skillcard" key={skill._id}>
          <img src={skill.cover} alt="" />   
          {isLoadingUser ? ("Loading" ) : errorUser ? ("Something Went Wrong") : (<div className="info">
              <div className="user">
                  <img src={dataUser.img} alt="" />
                  <span>{dataUser.username}</span>
              </div>
              <p>{skill.title.substring(0,50)}</p>
              <div className="rating">
                  <img src="/star.png" alt="" />
                  <span>
          {isNaN(skill.totalStars / skill.starNumber) || skill.totalStars / skill.starNumber === null
          ? 0
          : (Math.round(skill.totalStars / skill.starNumber).toFixed(2))}
          </span>
                  <span className='number'>({skill.starNumber} reviews)</span>
              </div>

          </div> )}
        </div>
        </Link>))}

        </div>)}

        <UserReviews bossId={id}/>



        </div>
      </div>
    </div>
  )
}

export default UserProfile