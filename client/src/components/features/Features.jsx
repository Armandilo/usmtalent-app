import React from 'react'
import './Features.scss'
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { MdPersonSearch } from "react-icons/md";



const Features = () => {
  return (
    <div className='features'>
        <div className="container">
            <div className="left">
            <h1>Discover a World of <i>Talents</i> Within <br /> Your University</h1>
            
            <div className="list">
            <div className="item">
                <div className="icon">
                    {/*<MdPersonSearch size={60}/>*/}
                    <img src="talentorange.png" alt="" width={84} height={84} />
                </div>

                <div className="divider"></div>
            
                <div className="itemcontent">
                    <h2 className='title'>Find the right <span>talent.</span></h2>
                    <p className='desc'>Find the right talent for your project or team by browsing through</p>
                    <p className='desc'>our extensive list of students and their projects.</p>  
                </div>
            </div>

            <div className="item">
                <div className="icon">
                    {/*<MdPersonSearch size={60}/>*/}
                    <img src="exchangeorange.png" alt="" width={60} height={60} />
                </div>

                <div className="divider"></div>
            
                <div className="itemcontent">
                    <h2 className='title'>Exchange <span>expertise.</span></h2>
                    <p className='desc'>Exchange skills and services to enhance your personal development</p>
                    <p className='desc'>in University.</p>  
                </div>
            </div>

            <div className="item">
                <div className="icon">
                    {/*<MdPersonSearch size={60}/>*/}
                    <img src="teamworkorange.png" alt="" width={64} height={64} />
                </div>

                <div className="divider"></div>
                <div className="itemcontent">
                    <h2 className='title'>Expand your <span>network.</span></h2>
                    <p className='desc'>Expand your network and collaborate with talented individuals</p>
                    <p className='desc'>with the extensive list of students and their projects.</p>  
                </div>
            </div>

            </div>
          
          

            </div>
            <div className="right">
                <img src="mancomp-removebg.png" alt="" />
                
            </div>
        </div>
    </div>
  )
}

export default Features