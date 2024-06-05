import React from 'react'
import './Skills.scss'
import { useState } from 'react'
import Skillcard from '../../components/skillcard/Skillcard'

import { useEffect } from 'react'
import { motion } from "framer-motion"
import { useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import newRequest from '../../utils/newRequest'
import { Link } from 'react-router-dom'
const Skills = () => {

  const [open, setOpen] = useState(false)
  const [sort,setSort] = useState('sales')
  
  const [category, setCategory] = useState('');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');

  const { search } = useLocation();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["skills"],
    queryFn: () => {
      let url = `/skills`;
      let params = [];
  
      if (search) params.push(search.slice(1)); // remove leading '?'
      if (min) params.push(`min=${min}`);
      if (max) params.push(`max=${max}`);
      if (sort) params.push(`sort=${sort}`);
      if (category) params.push(`category=${category}`);
  
      if (params.length > 0) {
        url += '?' + params.join('&');
      }
  
      return newRequest
        .get(url)
        .then((res) => {
          return res.data;
        });
    },
  });
  console.log(data);
  

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  }

  useEffect(() => {
    refetch();
  }, [sort,search,category]);

  const apply = () => {
    refetch();
  };


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const params = new URLSearchParams(search);
  const categoryURL = params.get("category");
  const displayCategory = categoryURL === 'music' ? "Music & Audio" : categoryURL === 'design' ? "Graphics & Design" : categoryURL === 'digital' ? "Digital Marketing" : categoryURL === 'writing' ? "Writing & Translation" : categoryURL === 'video' ? "Video & Animation" : categoryURL === 'programming' ? "Programming & Tech" : categoryURL === 'business' ? "Business" : categoryURL === 'events' ? "Events" : categoryURL === 'education' ? "Education" : categoryURL === 'other' ? "Other" : "Explore";
  const displayText = categoryURL === 'music' ? "Dive into the world of sound and rhythm. From soulful melodies to dynamic soundscapes, let your music resonate with our talented musicians and audio experts." : categoryURL === 'design' ? "Unleash your creativity with our talented designers. From stunning logos to captivating visuals, explore the limitless possibilities of graphic design." : categoryURL === 'digital' ? "Navigate the digital landscape with expertise. Elevate your brand's online presence and engage your audience with strategic digital marketing solutions." : categoryURL === 'writing' ? "Craft compelling narratives and bridge language barriers with our diverse community of writers and translators. Let words transcend boundaries." : categoryURL === 'video' ? "Bring stories to life through the magic of video and animation. From captivating motion graphics to immersive storytelling, ignite imagination." : categoryURL === 'programming' ? "Enter the realm of innovation and problem-solving. Empower yourself with cutting-edge programming and tech solutions, shaping the future one line of code at a time." : categoryURL === 'business' ? "Forge ahead in the world of commerce and entrepreneurship. From strategic planning to operational excellence, unlock the tools to thrive in the dynamic business landscape." : categoryURL === 'events' ? "Create unforgettable experiences and moments to cherish. From meticulous planning to flawless execution, let our event experts turn your vision into reality." : categoryURL === 'education' ? "Ignite curiosity and inspire learning. Explore a world of knowledge and expertise with our diverse educational resources and passionate educators." : categoryURL === 'other' ? "Discover the unexpected and embrace the unique. From niche interests to specialized services, find the extraordinary in our diverse array of offerings." : "Dive into a world of endless talent and creativity. Explore diverse categories and discover a wealth of skills waiting to amaze you."; 


  return (
    <div className='skills'>
      <div className="container">

      <div className="menucontainer">
        <motion.div animate={{opacity:1}} initial={{opacity:0}} transition={{ ease: "easeOut", duration: 1.5 }} className="menucontent">
          <span className="breadcrumbs"><Link className="link" to="/">USMTALENT</Link> {">"} {displayCategory.toUpperCase()} </span>
          <h1>{displayCategory}</h1>
          <p>{displayText}</p>
        
      

      <div className="menu">
        <div className="left">
          <span>Budget</span>
          <input value={min} type="text" placeholder='Min' onChange={(e)=> setMin(e.target.value)}/>
          <input value={max} type="text" placeholder='Max' onChange={(e)=>setMax(e.target.value)}/>
          <button onClick={apply}>Apply</button>
        </div>
        <div className="right">
          <span className='sortBy'>Sort By</span>
          <span className="sortType">{sort === "sales" ? "Best Selling" : "Newest"}</span>
          <img src="down-arrow-white.png" alt="" onClick={()=>setOpen(!open)}/>

          {open && ( 
          <div className="rightmenu">
            {sort === "sales" ? (
            <span onClick={()=>reSort("createdAt")}>Newest</span>
            ) : (
            <span onClick={()=>reSort("sales")}>Best Selling</span>
            )}
            <span onClick={() => reSort("sales")}>Popular</span>
          </div> )}
        </div>
        </div>

    
      </motion.div>
      </div>
      
      <div className="cardcontainer">
      <motion.div animate={{scale:1}} initial={{scale:0.5}} transition={{ ease: "easeOut", duration: .5 }} className="cards">
        {isLoading
          ? "Loading..."
          : error
          ? "An error has occurred: " + error.message
          : data.map((skill) => (
              <Skillcard item={skill} key={skill._id} />
          ))
        }
      </motion.div>
      </div>
      </div>
    </div>
  )
}

export default Skills