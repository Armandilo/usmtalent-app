import React from 'react'
import './Ordertest.scss'
import Timeleft from '../../components/timeleft/Timeleft';
import Verticalstepper from '../../components/verticalstepper/Verticalstepper';
import { useRef } from 'react';
import { AiOutlineFileAdd } from "react-icons/ai";
import { FaRegFileArchive } from "react-icons/fa";
import { AiOutlineDownload } from "react-icons/ai";
import { useState } from 'react';
import { LiaFileDownloadSolid } from "react-icons/lia";
import { BsDownload } from "react-icons/bs";





const Ordertest = () => {
    const fileInputRef = useRef(null);
    const deliveryTime = '2024-06-05T12:00:00';

    const [isHovered, setIsHovered] = useState(false);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        console.log(file);
    }

    const handleUploadClick = () => {
        fileInputRef.current.click();
    }
  return (
    <div className="view-order-page">
    <div className="container">
    <div className="left">
      <div className="order-header">
       
        <div className="order-details">
          <div className="order-info">
            <h2>Order #FO81E446D0308</h2>
            <p>Order completed</p>
          </div>
          <div className="order-amount">
            <h2>$100.00</h2>
          </div>
        </div>
      </div>
      <div className="order-content">
        <div className="order-message">
          <p>Hello dear sir, I'm Jawad...</p>
        </div>
        <table className="order-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Quantity</th>
              <th>Duration</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Draw line arts and vector illustrations</td>
              <td>1</td>
              <td>1 Day</td>
              <td>$100.00</td>
            </tr>
          </tbody>
        </table>

      </div>
        <div className="uploadheader">
            <h2>Upload Delivery</h2>
            <hr />
        </div>

      <div className="upload-section">
            
            <div className="uploadcontainer" onClick={handleUploadClick}>
                <AiOutlineFileAdd size={40} />
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{display: 'none'}}/>
            </div>

            <div className="filecontainer" onMouseEnter={()=> setIsHovered(true)} onMouseLeave={()=> setIsHovered(false)}>
                <div className="filedetail">
                   {isHovered? <BsDownload size={39} /> :<> <FaRegFileArchive size={36} /> <span>delivery.zip</span></>}

                    
                </div>
            </div>
   
        </div>
      </div>

      <div className="right">
        <Timeleft deliveryTime={deliveryTime}/>
        <Verticalstepper/>

        
      </div>
      </div>
    </div>
  )
}

export default Ordertest