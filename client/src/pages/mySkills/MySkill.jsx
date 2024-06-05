import React from 'react'
import './MySkill.scss' 
import { Link } from 'react-router-dom'
import { FaCirclePlus } from "react-icons/fa6";
import { FiPlus } from "react-icons/fi";
import { useQuery } from '@tanstack/react-query'
import newRequest from '../../utils/newRequest'
import {motion} from 'framer-motion'




const MySkill = () => { 
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const { isLoading, error, data} = useQuery({
    queryKey: ["mySkills"],
    queryFn: () =>
      newRequest
        .get(
          `/skills?userId=${currentUser._id}`
        )
        .then((res) => {
          return res.data;
        }),
  });





  return (
    <div className='myskill'>
      {isLoading ? ("Loading") : error ? ("Something went wrong") : (<div className="container">
        
        <div className="menucontainer">
      
            <motion.div animate={{opacity:1}} initial={{opacity:0}} transition={{ ease: "easeOut", duration: 0.5 }} className="title">
            <div className="inner-container">
            <h1>Skills</h1>
            <Link to="/addSkills">
            <button><FaCirclePlus className='icon'/>Add New Skill</button>
            </Link>
            </div>
            </motion.div>
           
            
        </div>

        
        



        <motion.div animate={{x:0,opacity:1}} initial={{x:-20 , opacity:0}} transition={{ ease: "easeOut", duration: 1 }} className="skillcontainer">
        <div className="cards">
        
        <Link to="/addSkills" className='link'>
        <div className="addCard">
        <FiPlus className='icon' size={24} />
        <p>Add New Skill</p>
        </div>
        </Link>


        
        {data.map((skill) => (
          <Link to={`/editSkills/${skill._id}`} className='link'>
          <div className="skillcard" key={skill._id}>
          <img src={skill.cover} alt="" />   
          <div className="info">
              <div className="user">
                  <img src={currentUser.img} alt="" />
                  <span>{currentUser.username}</span>
              </div>
              <p>{skill.title.substring(0,50)}</p>
              <div className="rating">
                  <img src="/star.png" alt="" />
                  <span>{Math.round(skill.totalStars / skill.starNumber)}</span>
                  <span className='number'>({skill.sales})</span>
              </div>

          </div>
        </div>
        </Link>))}

       

       

        </div>
        </motion.div>


      </div>)}
    </div>
  )
}

export default MySkill