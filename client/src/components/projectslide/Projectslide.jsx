import React from 'react'
import './Projectslide.scss'
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";


import Slider from 'infinite-react-carousel';
import { useState } from 'react';



const Projectslide = ({children,slidesToShow,arrowsScroll}) => {
  let sliderRef = React.createRef();

  //Function for button onClick to go to the next slide on carousel
  const nextSlide = () => {
    for (let i = 0; i < arrowsScroll; i++) {
      sliderRef.current.slickNext();
    }
  };

  //Function for button onClick to go to the previous slide on carousel
  const prevSlide = () => {
    for (let i = 0; i < arrowsScroll; i++) {
      sliderRef.current.slickPrev();
    }
  };

  //Function to pause the carousel when the user hovers over the button
  const pauseSlide = () => {
    sliderRef.current.slickPause();
  };

  //Function to play the carousel
  const playSlide = () => {
    sliderRef.current.slickPlay();
  };

  return (
    <div className='projectslide'>
        <button onClick={prevSlide} onMouseEnter={pauseSlide} onMouseLeave={playSlide} className='prevarrow'><IoIosArrowBack size={18} className='icon'/></button>
      <div className="container">
      <div className="title">
        <h1>Inspiring work made on usm<span className='logo'>talent</span>.</h1>
      </div>
        <Slider ref={sliderRef} className="slide" slidesToShow={slidesToShow} arrowsScroll={arrowsScroll} arrows={false} autoplay={true} autoplayScroll={3} duration={500} autoplaySpeed={6000}>
          {children}
        </Slider>
  
      </div>
      <button onClick={nextSlide} onMouseEnter={pauseSlide} onMouseLeave={playSlide} className='nextarrow'><IoIosArrowForward size={18} className='icon'/></button>
    </div>
  )
}

export default Projectslide