import React from 'react'
import './Getstarted.scss'
import { FaCheck } from "react-icons/fa6";

const Getstarted = () => {
  return (
    <div className='getstarted'>
        <div className="container">
            <div className="title">
                <h1>Focus on the work you love. <br />We'll handle the rest.</h1>
            </div>

            <div className="search">
                <div className="searchbar">
                    <input type="text" placeholder="Enter your Email" />
                </div>
                <button className='searchbutton'>Get Started</button>
            </div>

            <div className="condition">
                <span><FaCheck /> No credit card</span>
                <span><FaCheck /> No spam</span>
                <span><FaCheck /> No Hassle</span>
            </div>
        </div>
        
    </div>
  )
}

export default Getstarted