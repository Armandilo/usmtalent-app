import React from 'react'
import './Homecard.scss'
import { IoIosSearch } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useAnimation } from "framer-motion"
import { useNavigate } from 'react-router-dom';

import { motion } from "framer-motion"
import { Link } from 'react-router-dom';
const Homecard = () => {

    const [inputValue, setInputValue] = useState("");
    const navigate = useNavigate();
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    }

    // function to remove the input value when the remove button is clicked
    const handleRemoveClick = () => {
        setInputValue("");
    };

    const handleSubmit = () => {
        navigate(`/skills?search=${inputValue}`);

    }

    const controls = useAnimation();
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        if (!hasAnimated) {
        controls.start({ x: 0, opacity: 1 });
        setHasAnimated(true);
        }
    }, [controls, hasAnimated]);


  return (
    <div className='homecard'>
        <div className="container">
            <motion.div animate={controls} initial={{x:-60 , opacity:0}} transition={{ ease: "easeOut", duration: 1.5 }} className="leftcontainer">
                <div className="title">
                <h1>Find the right <span><i>talents </i></span></h1>
                <h1>and skills right away</h1>
                </div>

                <div className="search">
                    <div className="searchbar">
                        <input type="text" placeholder="Search for any skill..." value={inputValue} onChange={handleInputChange}/>
                        {inputValue && (
                        <div className="remove" onClick={handleRemoveClick}>
                        <MdCancel size={21}/>
                        </div>
                        )}
                        
                    </div>
                    <button className='searchbutton' onClick={handleSubmit}> <IoIosSearch size={20}/></button>
                   
                    
                </div>
                <div className="popularcat">
                    <span>Popular :</span>
                    <Link to="skills?category=programming" className='link'><button>Programming</button></Link>
                    <Link to="skills?category=design" className='link'><button>Graphic Design</button></Link>
                    <Link to="skills?category=digital" className='link'><button>Marketing</button></Link>
                    <Link to="skills?category=music" className='link'><button>Music</button></Link>
                </div>
            </motion.div>
            <motion.div animate={controls} initial={{x:60 , opacity:0}} transition={{ ease: "easeOut", duration: 1.5 }} className="rightcontainer">
                <img src="grad.png" alt=""/>
            </motion.div>

        </div>
    </div>
  )
}

export default Homecard