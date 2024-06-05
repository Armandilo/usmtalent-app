import React from 'react'
import './Skill.scss'
import { useEffect } from 'react'

import { Slider } from 'infinite-react-carousel'
import { motion } from "framer-motion"
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import newRequest from '../../utils/newRequest'
import Reviews from '../../components/reviews/Reviews'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import CalenderPicker from '../../components/calendarpicker/CalenderPicker'
import { useState } from 'react'
import { usePopup } from '../../components/popupcontext/PopupContext'
import Paymentmethod from '../paymentmethod/Paymentmethod'
import 'ldrs/ring'


const Skill = () => {
  const {id} = useParams();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { handlePopupOpen } = usePopup();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [selectedDate, setSelectedDate] = useState(null);
  const { isLoading, error, data} = useQuery({
    queryKey: ["skill"],
    queryFn: () =>
      newRequest
        .get(
          `/skills/single/${id}`
        )
        .then((res) => {
          return res.data;
        }),
  });


  const userId = data?.userId;

  const { isLoading: isLoadingUser, error: errorUser, data: dataUser, refetch: refetchUser} = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      newRequest
        .get(
          `/users/${userId}`
        )
        .then((res) => {
          return res.data;
        }),
        enabled: !!userId,
  });

  const navigate = useNavigate(); 
  const handleContact = async ()=>{
    const sellerId = currentUser._id;
    const buyerId = userId;
    const id = sellerId + buyerId;

    if (sellerId === buyerId) {
      alert("You can't message with yourself");
      return;
    }

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



  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("Selected Date In Skill", selectedDate);
    if (userId) {
      refetchUser();
    }
  }, [userId, refetchUser]);

  const categoryURL = data?.category;
  const displayCategory = categoryURL === 'music' ? "Music & Audio" : categoryURL === 'design' ? "Graphics & Design" : categoryURL === 'digital' ? "Digital Marketing" : categoryURL === 'writing' ? "Writing & Translation" : categoryURL === 'video' ? "Video & Animation" : categoryURL === 'programming' ? "Programming & Tech" : categoryURL === 'business' ? "Business" : categoryURL === 'events' ? "Events" : categoryURL === 'education' ? "Education" : categoryURL === 'other' ? "Other" : "Explore";

  return (
    <div className='skill'>
      {isLoading ? ( "Loading.." ): error ? ("Something Went Wrong..") : (
      <div className="container">
        <div className="left">
          <span className="breadcrumbs"><Link className='link' to="/">USMTALENT</Link> {`>`}<Link className='link' to={`/skills?category=${categoryURL}`}> {displayCategory.toUpperCase()}</Link> {`>`} </span>
          <h1>{data.title}</h1>


          {isLoadingUser ? ("Loading" ) : errorUser ? ("Something Went Wrong") : ( <div className="user">
            

            {!isNaN(data.totalStars / data.starNumber)&& (
            <div className="rating">
              {Array(Math.round(data.totalStars / data.starNumber)).fill().map((item,i)=>(
                <img key={i} src="/star.png" alt="" />
              ))}
              <span>{Math.round(data.totalStars / data.starNumber)}</span>
              <span className="total">{"("}{data.starNumber} reviews{")"}</span>  

            </div>
            )}
            
          </div>)}
          
          

          <Slider slidesToShow={1} arrowsScroll={1} className="slider">
            {data.images.map((img) => {
              const fileType = img.split('.').pop();
              if (['jpg', 'jpeg', 'png', 'gif' , 'webp'].includes(fileType)) {
                return <img key={img} src={img} alt="" />;
              } else if (['mp4', 'webm', 'ogg'].includes(fileType)) {
                return (
                  <video key={img} controls>
                    <source src={img} type={`video/${fileType}`} />
                    Your browser does not support the video.
                  </video>
                );
              } else {
                return null;
              }
            })}
          </Slider>

          <h2>About This Skill</h2>
          <hr className='aboutskill'/>
          <p>
            {data.desc}
          </p>

          {isLoadingUser ? ("Loading" ) : errorUser ? ("Something Went Wrong") : ( <div className="talent">
            <h2>About The Talent</h2>
            <div className="user">
              <Link className='link' to={`/profile/${dataUser._id}`} ><img src={dataUser.img || "/noavatar.png"} alt="" /></Link>
              <div className="details">
              <Link className='link' to={`/profile/${dataUser._id}`} ><span>{dataUser.username}</span></Link>
                {!isNaN(dataUser.totalStars / dataUser.starNumber)&& (
            <div className="rating">
              {Array(Math.round(dataUser.totalStars / dataUser.starNumber)).fill().map((item,i)=>(
                <img key={i} src="/star.png" alt="" />
              ))}
              <span>{Math.round(dataUser.totalStars / dataUser.starNumber)}</span>
              <span className="total">{"("}{dataUser.starNumber} reviews{")"}</span>  
            </div>
            )}
            <button onClick={handleContact}>Contact Me</button>
              </div>
            </div>

            <div className="infobox">
              <div className="items">
                <div className="item">
                  <span className="title">From</span>
                  <span className="desc">{dataUser.country}</span>
                </div>
                <div className="item">
                  <span className="title">Member since</span>
                  <span className="desc">December 2023</span>
                </div>

                <div className="item">
                  <span className="title">Avg. Response Time</span>
                  <span className="desc">2 Hours</span>
                </div>

                <div className="item">
                  <span className="title">Last Delivery</span>
                  <span className="desc">2 days ago</span>
                </div>

                <div className="item">
                  <span className="title">Language</span>
                  <span className="desc">English</span>
                </div>

              </div>
              <hr className='line'/>
              <p>
                  {dataUser.desc}
                </p>
            </div>
          </div> )}

          <Reviews skillId={id}/>

          
        </div>
        
        <motion.div animate={{x:0 , opacity:1}} initial={{x:40 , opacity:0}} transition={{ ease: "easeOut", duration: 0.7 }} className="right">
          <div className="price">
            <h3>{data.shortTitle}</h3>
            <h2>RM {data.price.toFixed(2)}</h2>
          </div>
          <p>{data.shortDesc}</p>
          <div className="details">
            <div className="item">
              <img src="/clock.png" alt="" />
              <span>{data.deliveryTime} days Delivery</span>
            </div>

            <div className="item">
              <img src="/revision.png" alt="" />
              <span>{data.revisionNumber} Revisions</span>
            </div>
           
          </div>

          <div className="featured">
            {data.features.map((feature) => 
              <div className="item">
                <img src="/check.png" alt="" />
                <span>{feature}</span>
              </div>
            )}
          </div>
          <hr />
          <div className="booking">
            <span>Booking Date <p>{"(Optional & Only for Online Payment)"}</p></span>
           

            <div className="bookandcontinue">
            <CalenderPicker onDateSelect={setSelectedDate}/>

            <Link>
            <button className='continuebutton' onClick={() => handlePopupOpen(<Paymentmethod selectedDate={selectedDate}/>)}>Continue</button>
            </Link>

            </div>
          

          </div>
          

          

        </motion.div>

      </div>)}
    </div>
  )
}

export default Skill