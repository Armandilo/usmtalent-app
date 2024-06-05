import React from 'react'
import './Footer.scss'
const Footer = () => {
  return (
  <div className='footer'>
    
    <div className="container">
    <hr className="divider" />
        <div className="topcontainer">

        <div className="navigation">
            <div className="title">
              <h2>Navigation</h2>
            </div>
            <div className="item">
              <span>Explore</span>
              <span>About Us</span>
              <span>Contact</span>
              <span>Services</span>
              <span>Sign Up</span>
            </div>
          </div>

          <div className="item">
            
            <div className="title">
                <h2>Categories</h2>
            </div>

            <div className="categories">

              <div className="itemcat">
                <span>Graphics & Design</span>
                <span>Digital Marketing</span>
                <span>Writing & Translation</span>
                <span>Video & Animation</span>
                <span>Music & Audio</span>
              </div>
            </div>

          </div>

          <div className="item">
            <div className="title">
                <h2>Categories</h2>
            </div>
            <div className="categories">

              <div className="itemcat">
                <span>Programming & Tech</span>
                <span>Business</span>
                <span>Events</span>
                <span>Education</span>
                <span>Others</span>
              </div>
            </div>
          </div>



          <div className="address">
            <div className="title">
              <h2>Address</h2>
            </div>
             
                <span>Universiti Sains Malaysia</span>
                <span>11700 Gelugor</span>
                <span>Pulau Pinang</span>
                <span>Malaysia</span>
            </div>

          <div className="telephone">
            <div className="title">
              <h2>Contact Us</h2>
            </div>
            <div className="contact">
              <span>Tel: +604-653 3647 / 2158 / 2155</span>
              <span>Fax: +604-653 3684</span>
              <span>Email: usmtalent@gmail.com</span>
            </div>
          </div>

      </div>
        <hr />

            <div className="bottomcontainer">
              <div className="left">
                <h2>usm<span>talent.</span></h2>
             
              </div>
              <div className="right">
                <span>© 2024 Universiti Sains Malaysia, All Rights Reserved</span>
              </div>
            </div>

    </div>
  </div>
  )
}

export default Footer