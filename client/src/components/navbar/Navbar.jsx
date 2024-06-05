import React, { useEffect } from 'react'
import './Navbar.scss'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { IoIosSearch } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import { usePopup } from '../popupcontext/PopupContext.jsx';
import newRequest from '../../utils/newRequest';
import { useNavigate } from 'react-router-dom';
import Login from '../../pages/login/Login.jsx';




const Navbar = () => {
    //=============Login================
    const {handlePopupOpen} = usePopup();
    //=============Login=================

    const [inputValue, setInputValue] = useState("");
    
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    }

    const [scroll, setScroll] = useState(false);
    // State to determine whether the 2nd navbar is shown or not
    const [show, handleShow] = useState(false);
    //Function to handle the dropdown menu 
    const [dropdown, setDropdown] = useState(false);
    //UseEffect function with event listener to detect whether the webpage has been scrolled or not. If scroll y > 0, show = true 
    useEffect(() => {
        window.addEventListener("scroll", () => {
        if (window.scrollY > 10) {
            handleShow(true);
        } else handleShow(false);
        });
    //Clean up function to remove event listener
        return () => {
            window.removeEventListener("scroll", window.scrollY > 0 ? handleShow(true) : handleShow(false));
        };
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", () => {
            if(window.scrollY > 100) {
                setScroll(true);
            } else setScroll(false);
        });
        return () => {
            window.removeEventListener("scroll", window.scrollY > 30 ? setScroll(true) : setScroll(false));
        };
    }, []);

    
    const navigate = useNavigate();

            

    const {pathname} = useLocation();

    //Dummy current user
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    //Function to handle the logout
    const handleLogout = async () => {
        try {
            await newRequest.post("/auth/logout")
            localStorage.setItem("currentUser", null);
            navigate("/");
        } catch (err) {
            console.log(err);
            
        }
    };


   //Function to handle the dropdown menu
    const handleDropdown = () => {
        setDropdown(!dropdown);
    }

    const handleSubmit = () => {
        navigate(`/skills?search=${inputValue}`);

    }

    return (
        
        <div className={show || pathname !=="/" ? "navbar active" : "navbar" }>
        
            <div className="container">
                <Link to="/" className='link'>
                <div className="logo">
                    <span className='firstlogo'>usm</span>
                    <span className={show || pathname !=="/" ? "secondlogo active" : "secondlogo"}>talent</span>
                    <span className={show || pathname !=="/" ? "dot active" : "dot"}>.</span>
                </div>
                </Link >
                {(scroll || pathname !=="/") && (
                <div className={show || pathname !=="/" ? "search active" : "search"}>
                    <div className="searchbar">
                        <input type="text" placeholder="Search for skills..." value={inputValue} onChange={handleInputChange}/>
      
                    </div>
                    <button onClick={handleSubmit}><IoIosSearch size={18}/></button> 
                </div>
                )}


                <div className={show || pathname !=="/" ? "links active" : "links"}>
                    <Link to="/skills?" className='link'><span>Explore</span></Link>
                    <Link to="/faq" className='link'><span className='faq'>FAQs</span></Link>
                    {!currentUser && <span onClick={() => handlePopupOpen(<Login/>)}>Sign In</span>}

                    {/* If there is no current user, show the Join button */}
                    {!currentUser && <Link to= "/register" className='link' ><button className={show || pathname !=="/" ? "button active" : "button"}>Join</button></Link>}
                    {currentUser && (
                    <div className="user" onClick={handleDropdown}>
                    <img src={currentUser.img || "/noavatar.png"} alt="user"/>
                    <span>{currentUser?.username}</span>
                    {dropdown && (
                    <div className={`dropdown ${dropdown? 'active' : 'inactive'}`}>
                        <span>
                            <Link className='link' to={`/profile/${currentUser._id}`}>
                                
                                Profile
                            </Link>
                        </span>
                        <span>
                            <Link className='link' to={`/dashboard`}>
                                
                                Dashboard
                            </Link>
                        </span>
                        <span>
                            <Link className='link' to="/mySkills">
                                
                                My Skills
                            </Link>
                        </span>
                        <span>
                            <Link className='link' to="/chat">
                                Messages
                            </Link>
                        </span>
                    
                        <span>
                            <Link className='link' onClick={handleLogout}>
                                Logout
                            </Link>
                        </span>
                    </div>
                    )}

                    </div>
                    )}
                </div>
            </div>
            {/* These component only show up when active == true */}
            {(scroll || pathname !=="/") && (
            <>
            <hr />
            {/* Navbar Menu Links That Are Hidden Until Webpage are scrolled down */}
            <div className={scroll || pathname !=="/" ? "menu active" : "menu"}>

                <Link to="/skills?category=design" className='link'><span>Graphics & Design</span></Link>
                <Link to="/skills?category=digital" className='link'><span>Digital Marketing</span></Link>
                <Link to="/skills?category=writing" className='link'><span>Writing & Translation</span></Link>
                <Link to="/skills?category=video" className='link'><span>Video & Animation</span></Link>
                <Link to="/skills?category=music" className='link'><span>Music & Audio</span></Link>
                <Link to="/skills?category=programming" className='link'><span>Programming & Tech</span></Link>
                <Link to="/skills?category=business" className='link'><span>Business</span></Link>
                <Link to="/skills?category=events" className='link'><span>Events</span></Link>
                <Link to="/skills?category=education" className='link'><span>Education</span></Link>
                <Link to="/skills?category=others" className='link'><span>Others</span></Link>
            </div>
            <hr />
            </>
            )}
        

        </div>
    
        

    )
}

export default Navbar