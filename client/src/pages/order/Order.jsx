import React from 'react'
import './Order.scss'
import Timeleft from '../../components/timeleft/Timeleft';
import Verticalstepper from '../../components/verticalstepper/Verticalstepper';
import { useRef } from 'react';
import { AiOutlineFileAdd } from "react-icons/ai";
import { FaRegFileArchive } from "react-icons/fa";
import { AiOutlineDownload } from "react-icons/ai";
import { useState } from 'react';
import { LiaFileDownloadSolid } from "react-icons/lia";
import { BsDownload, BsWindowSidebar } from "react-icons/bs";
import { QueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Refund from '../../components/refund/Refund';
import { useQuery } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Contact from '../../components/contact/Contact';
import orderModel from '../../../../api/models/order.model';
import { useQueryClient } from '@tanstack/react-query';
import upload from '../../utils/upload';
import Verticalstepperbarter from '../../components/verticalStepperBarter/Verticalstepperbarter';
import moment from 'moment';
import { set } from 'mongoose';
import Bookeddate from '../../components/bookedDate/Bookeddate';

const Order = () => {
    const fileInputRef = useRef(null);
    //const deliveryTime = '2024-06-05T12:00:00';
    const queryClient = new QueryClient();
    const {id} = useParams();
    const [isHovered, setIsHovered] = useState(false);
    const [descInput, setDescInput] = useState('');
    const [descInput2, setDescInput2] = useState('');
    const [currentStep, setCurrentStep] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [files, setFiles] = useState([]);
    const [initFiles, setInitFiles] = useState([]); 
    const [fileEmpty, setFileEmpty] = useState(true);
    const [showBarterPage, setShowBarterPage] = useState(false);
    const [showBooking, setShowBooking] = useState(false);
    let dueIn;

    const [deliveryTime, setDeliveryTime] = useState('');

    const orderId = id;
    let skillId;
    const statusesToSteps = {
      "Pending": 0,
      "Started": 1,
      "In Progress" : 2,
      "Confirmation": 3,
      "Completed": 4,
      null : 0,
    };

    const { isLoading: isLoadingOrder, error: errorOrder, data: dataOrder, refetch: refetchOrder} = useQuery({
      queryKey: ["singleorder", id],
      queryFn: () =>
        newRequest
          .get(
            `/orders/${id}`
          )
          .then((res) => {
            return res.data;
          }),
    });
  


    const handleFileUpload = async () => {
      setUploading(true);
      try {
        console.log(files);
        const attachfiles = await Promise.all(
          [...files].map(async (file) => {
            const url = await upload(file);
            console.log(url);
            return {url, name: file.name};
          })
        );
        await newRequest.put(`/orders/files/${id}`, { files: attachfiles });
        setUploading(false);
        refetchOrder();  
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    };

    const handleFileChange = async (event) => {
      setFiles([...files, ...event.target.files]);
      console.log("Uploading");
      console.log(files);
      await handleFileUpload();
    };
    

    const handleUploadClick = () => {
        fileInputRef.current.click();
    }

    const handleSubmitDesc = async (e) => {
        e.preventDefault();
        await newRequest.put(`/orders/desc/${id}`, { desc1: descInput });
        await newRequest.put(`/orders/status/${id}`, { status: "Started" });
        // Refetch the order data to update the UI
        queryClient.refetchQueries(["singleorder"]);
        setCurrentStep(1);
        window.location.reload();
    };

    const handleSubmitDesc2 = async (e) => {
      e.preventDefault();
      await newRequest.put(`/orders/desc/${id}`, { desc1: descInput });
      queryClient.refetchQueries(["singleorder"]);
      if(dataOrder?.desc2 !== null && dataOrder?.desc2 !== ""){
        await newRequest.put(`/orders/status/${id}`, { status: "Started" });
        setCurrentStep(1);
        window.location.reload();
      }
      
      // Refetch the order data to update the UI
      queryClient.refetchQueries(["singleorder"]);
      
      window.location.reload();
  };

  const handleSubmitDesc3 = async (e) => {
    e.preventDefault();
    await newRequest.put(`/orders/desc2/${id}`, { desc2: descInput2 });

    if(dataOrder?.desc1 !== null && dataOrder?.desc1 !== ""){
      await newRequest.put(`/orders/status/${id}`, { status: "Started" });
      setCurrentStep(1);
      window.location.reload();
    }
    
    // Refetch the order data to update the UI
    queryClient.refetchQueries(["singleorder"]);
    
    window.location.reload();
};

    const downloadFile = async (url, name) => {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };



    

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let userId = currentUser._id === dataOrder?.sellerId ? dataOrder?.buyerId : dataOrder?.sellerId;
    const { isLoading: isLoadingUser, error: errorUser, data: dataUser, refetch: refetchUser} = useQuery({
      queryKey: ["useropposite", userId],
      queryFn: () =>
        newRequest
          .get(
            `/users/${userId}`
          )
          .then((res) => {
            return res.data;
          }),
          enabled: !!dataOrder,
    });

    const userSellerId = dataOrder?.sellerId;
    const { isLoading: isLoadingUserSeller, error: errorUserSeller, data: dataUserSeller} = useQuery({
      queryKey: ["userseller", userSellerId],
      queryFn: () =>
        newRequest
          .get(
            `/users/${userSellerId}`
          )
          .then((res) => {
            return res.data;
          }),
          enabled: !!dataOrder,
    });

    const userBuyerId = dataOrder?.buyerId;
    const { isLoading: isLoadingUserBuyer, error: errorUserBuyer, data: dataUserBuyer} = useQuery({
      queryKey: ["userbuyer", userBuyerId],
      queryFn: () =>
        newRequest
          .get(
            `/users/${userBuyerId}`
          )
          .then((res) => {
            return res.data;
          }),
          enabled: !!dataOrder,
    });

 

    if(dataOrder){
      skillId = dataOrder.skillId1;
    }

    const { isLoading: isLoadingSkill, error: errorSkill, data: dataSkill} = useQuery({
      queryKey: ["Orderskill", dataOrder?.skillId1],
      queryFn: () =>
        newRequest
          .get(
            `/skills/single/${dataOrder?.skillId1}`
          )
          .then((res) => {
            return res.data;
          }),
          enabled: !!dataOrder,
    });

    const { isLoading: isLoadingSkill2, error: errorSkill2, data: dataSkill2} = useQuery({
      queryKey: ["Orderskill2", dataOrder?.skillId2],
      queryFn: () =>
        newRequest
          .get(
            `/skills/single/${dataOrder?.skillId2}`
          )
          .then((res) => {
            return res.data;
          }),
          enabled: !!dataOrder && dataOrder?.type ==="Barter",
    });

    useEffect(() => {

      
      if (dataOrder?.status) {
        setCurrentStep(statusesToSteps[dataOrder.status]);
      }

      if(dataOrder?.type === "Barter"){
        setShowBarterPage(true);
      }

      if(dataOrder?.files){
        setInitFiles(dataOrder.files);
        setFileEmpty(false);
      }

      

      if(dataOrder?.datesBooked !== null && dataOrder?.datesBooked !== undefined){
        setShowBooking(true);
        dueIn = moment(dataOrder?.datesBooked).format('YYYY-MM-DDTHH:mm:ss');
        console.log(dueIn);
        setDeliveryTime(dueIn);
      }
      else{
        dueIn = moment(dataOrder?.createdAt).add(dataSkill?.deliveryTime, 'days').format('YYYY-MM-DDTHH:mm:ss');
        console.log(dueIn);
        setDeliveryTime(dueIn);
      }
     
    }, [dataOrder, dataSkill]);

    

  return (
    <div className="view-order-page">

    
    <div className="container">
    {isLoadingOrder ? ("Loading") : errorOrder ? ("Something went wrong") : ( 
    <span className='breadcrumbs'><Link to="/dashboard" className="link">Dashboard</Link> {">"} Order {((dataOrder._id).substring(0,10).toUpperCase())}</span>
    )}
    {!showBarterPage && (
    <>
    <div className="leftrightcontainer">
    {isLoadingOrder ? ("Loading") : errorOrder ? ("Something went wrong") : 
    (
    <div className="left">
      <div className="order-header">
       
        <div className="order-details">
          <div className="order-info">
            <h2>Order #{((dataOrder._id).substring(0,10)).toUpperCase()}</h2>
            <p>Order {dataOrder.status}</p>
            {isLoadingUserBuyer ? ("Loading") : errorUserBuyer ? ("Something went wrong") : (
            <p>Ordered By : {dataUserBuyer?.username}</p>)}
          </div>
          <div className="order-amount">
            <h2>RM {(dataOrder.price).toFixed(2)}</h2>
          </div>
        </div>
      </div>
      <div className="order-content">
        <div className="order-message">
          {!dataOrder.desc1 && currentUser._id === dataOrder.buyerId ? 
          (
            <>
            <div className="requirements">
            <form onSubmit={handleSubmitDesc}>
              <label > <p>Enter your requirements:</p>
              <textarea 
                value={descInput} 
                onChange={e => setDescInput(e.target.value)} 
                style={{resize: 'none', whiteSpace: 'pre-wrap'}}
              />
              </label>
              <button type="submit">Submit</button>
            </form>
            </div>
            </>
          ) : 
          (
          <p style={{whiteSpace: 'pre-wrap'}}>{dataOrder?.desc1 ? dataOrder.desc1 : "No Requirements Submitted Yet"}</p>
          )}
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
          {isLoadingSkill ? ("Loading") : errorSkill ? ("Something went wrong") : (
          <tbody>
            <tr>
              <td>{dataSkill.title}</td>
              <td>1</td>
              <td>{dataSkill.deliveryTime}</td>
              <td>RM {(dataOrder.price).toFixed(2)}</td>
            </tr>
          </tbody>
          )}
        </table>

      </div>
        <div className="uploadheader">
            <h2>File Upload</h2>
            
        </div>

      <div className="upload-section">
            
            <div className="uploadcontainer" onClick={handleUploadClick}>
                <AiOutlineFileAdd size={40} />
                <input type="file" ref={fileInputRef} multiple onChange={(e)=> setFiles(e.target.files)} style={{display: 'none'}}/>
            </div>
            
            {fileEmpty ? <p>No files uploaded</p> : (
            <>
            {initFiles.map((file,index) =>
            
            <div className="filecontainer" key={index} onClick={()=> downloadFile(file.url,file.name)}>
                <div className="filedetail">
                   <FaRegFileArchive size={36} /> <span>{file.name}</span>
                </div>
            </div>
           
            )} 
            </>
            )}

                <button className="uploadbutton" onClick={handleFileUpload}>
                    {uploading ? "Uploading..." : "Upload"}
                </button>
        </div>

     
      </div>
    )}

      <div className="right">
        <Contact dataUser={dataUser}/>
        {!showBooking && (<Timeleft deliveryTime={deliveryTime}/>)}
        {showBooking && (<Bookeddate deliveryTime={deliveryTime} bookedDate={dataOrder.datesBooked}/>)}
        <Verticalstepper currentStep={currentStep} setCurrentStep={setCurrentStep} orderId={orderId}/>
        <Refund orderId={orderId}/>
        
        
      </div>
      
      </div>
      </>
    )} 





    {/* Barter Page */} 

    {showBarterPage && (
    <>
    <div className="leftrightcontainer">
    {isLoadingOrder ? ("Loading") : errorOrder ? ("Something went wrong") : 
    (
    <div className="left">
      <div className="order-header">
       
        <div className="order-details">
          <div className="order-info">
            <h2>Order #{((dataOrder._id).substring(0,10)).toUpperCase()}</h2>
            <p>Order {dataOrder.status}</p>
            <p>Payment Method: Barter</p>
            {isLoadingUser ? ("Loading") : errorUser ? ("Something went wrong") : (
            <p>Ordered By : {dataUserBuyer?.username}</p>)}
          </div>
          <div className="order-amount">
            <h2>RM {(dataOrder.price).toFixed(2)}</h2>
          </div>
        </div>
      </div>
      <div className="order-content">

        <div className="order-message">
          {!dataOrder.desc1 && currentUser._id === dataOrder.buyerId ? 
          (
            <>
            <div className="requirements">
              {dataUserBuyer && (<h3>{dataUserBuyer?.username}'s Requirement</h3>)}
            <form onSubmit={handleSubmitDesc2}>
              <label > <p>Enter your requirements:</p>
              <textarea 
                value={descInput} 
                onChange={e => setDescInput(e.target.value)} 
                style={{resize: 'none', whiteSpace: 'pre-wrap'}}
              />
              </label>
              <button type="submit">Submit</button>
            </form>
            </div>
            </>
          ) : 
          (
           <> 
          {dataUserBuyer && (<h3>{dataUserBuyer?.username}'s Requirement</h3>)}
          <p style={{whiteSpace: 'pre-wrap'}}>{dataOrder?.desc1 ? dataOrder.desc1 : "No Requirements Submitted Yet"}</p>
          </>
          )}
        </div>
        <div className="order-message">
          {!dataOrder.desc2 && currentUser._id === dataOrder.sellerId ? 
          (
            <>
            <div className="requirements">
            {dataUserSeller && (<h3>{dataUserSeller?.username}'s Requirement</h3>)}
            <form onSubmit={handleSubmitDesc3}>
              <label > <p>Enter your requirements:</p>
              <textarea 
                value={descInput2} 
                onChange={e => setDescInput2(e.target.value)} 
                style={{resize: 'none', whiteSpace: 'pre-wrap'}}
              />
              </label>
              <button type="submit">Submit</button>
            </form>
            </div>
            </>
          ) : 
          (
            <>
          {dataUserSeller && (<h3>{dataUserSeller?.username}'s Requirement</h3>)}
          <p style={{whiteSpace: 'pre-wrap'}}>{dataOrder?.desc2 ? dataOrder.desc2 : "No Requirements Submitted Yet"}</p>
          </>
          )}
        </div>
        <table className="order-table">
          <thead>
            <tr>
              {dataUserSeller && (<th>Service {`( ${dataUserSeller?.username} )`}</th>)}
              <th>Quantity</th>
              <th>Duration</th>
              <th>Original Amount</th>
            </tr>
          </thead>
          {isLoadingSkill ? ("Loading") : errorSkill ? ("Something went wrong") : (
          <tbody>
            <tr>
              <td>{dataSkill.title}</td>
              <td>1</td>
              <td>{dataSkill.deliveryTime}</td>
              <td>RM {(dataSkill.price).toFixed(2)}</td>
            </tr>
          </tbody>
          )}
        </table>

        <table className="order-table">
          <thead>
            <tr>
              {dataUserBuyer && (<th>Service {`( ${dataUserBuyer?.username} )`}</th>)}
              <th>Quantity</th>
              <th>Duration</th>
              <th>Original Amount</th>
            </tr>
          </thead>
          {isLoadingSkill2 ? ("Loading") : errorSkill2 ? ("Something went wrong") : (
          <tbody>
            <tr>
              <td>{dataSkill2.title}</td>
              <td>1</td>
              <td>{dataSkill2.deliveryTime}</td>
              <td>RM {(dataSkill2.price).toFixed(2)}</td>
            </tr>
          </tbody>
          )}
        </table>

      </div>
        <div className="uploadheader">
            <h2>Files Upload</h2>
            
        </div>

      <div className="upload-section">
            
            <div className="uploadcontainer" onClick={handleUploadClick}>
                <AiOutlineFileAdd size={40} />
                <input type="file" ref={fileInputRef} multiple onChange={(e)=> setFiles(e.target.files)} style={{display: 'none'}}/>
            </div>
            
            {fileEmpty ? <p>No files uploaded</p> : (
            <>
            {initFiles.map((file,index) =>
            
            <div className="filecontainer" key={index} onClick={()=> downloadFile(file.url,file.name)}>
                <div className="filedetail">
                   <FaRegFileArchive size={36} /> <span>{file.name}</span>
                </div>
            </div>
           
            )} 
            </>
            )}

                <button className="uploadbutton" onClick={handleFileUpload}>
                    {uploading ? "Uploading..." : "Upload"}
                </button>
        </div>

     
      </div>
    )}

      <div className="right">
        <Contact dataUser={dataUser}/>
        <Timeleft deliveryTime={deliveryTime}/>
        <Verticalstepperbarter currentStep={currentStep} setCurrentStep={setCurrentStep} orderId={orderId}/>
        <Refund orderId={orderId}/>
        
        
      </div>
      
      </div>
      </>
    )}         


      </div>
    </div>
  )
}

export default Order