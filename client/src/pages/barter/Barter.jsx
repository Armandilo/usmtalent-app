import React from 'react'
import './Barter.scss'
import Timeleft from '../../components/timeleft/Timeleft';
import Verticalstepper from '../../components/verticalstepper/Verticalstepper';
import { useRef } from 'react';
import { AiOutlineFileAdd } from "react-icons/ai";
import { FaRegFileArchive } from "react-icons/fa";
import { AiOutlineDownload } from "react-icons/ai";
import { useState } from 'react';
import { LiaFileDownloadSolid } from "react-icons/lia";
import { BsDownload } from "react-icons/bs";

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
import Progressbar from '../../components/progressbar/Progressbar';
import Progressbar2 from '../../components/progressbar2/Progressbar2';
const Barter = () => {
    const fileInputRef = useRef(null);
    const deliveryTime = '2024-06-05T12:00:00';
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const {id} = useParams();
    let currentUserSkillValue;
    let oppositeUserSkillValue;
    const [showPayDiv, setShowPayDiv] = useState(false);
    const [barterCompleted, setBarterCompleted] = useState(false);
    const [showProceedPaymentDiv, setShowProceedPaymentDiv] = useState(false);
    let priceComp;
    const { isLoading: isLoadingBarter, error: errorBarter, data: dataBarter} = useQuery({
      queryKey: ["Onebarters"],
      queryFn: () =>
      newRequest
          .get(
          `/barter/${id}`
      )
      .then((res) => {
          return res.data;
      }),
  });


  const { isLoading: isLoadingUser, error: errorUser, data: dataUser} = useQuery({
    queryKey: ["sellerUser"],
    queryFn: () =>
      newRequest
        .get(
          `/users/${dataBarter.buyerId}`
        )
        .then((res) => {
          return res.data;
        }),
        enabled: !!dataBarter,
  });

 
  const { isLoading: isLoadingUser2, error: errorUser2, data: dataUser2} = useQuery({
    queryKey: ["oppositeUser2"],
    queryFn: () =>
      newRequest
        .get(
          `/users/${currentUser._id === dataBarter.buyerId ? dataBarter.sellerId : dataBarter.buyerId}`
        )
        .then((res) => {
          return res.data;
        }),
        enabled: !!dataBarter,
  });

  const { isLoading: isLoadingSkill1, error: errorSkill1, data: dataSkill1} = useQuery({
    queryKey: ["Orderskill1"],
    queryFn: () =>
      newRequest
        .get(
          `/skills/single/${dataBarter.skillId1}`
        )
        .then((res) => {
          return res.data;
        }),
        enabled: !!dataBarter,
  });

  const { isLoading: isLoadingSkill2, error: errorSkill2, data: dataSkill2} = useQuery({
    queryKey: ["Orderskill2"],
    queryFn: () =>
      newRequest
        .get(
          `/skills/single/${dataBarter.skillId2}`
        )
        .then((res) => {
          return res.data;
        }),
        enabled: !!dataBarter,
  });

  if (dataSkill1 && dataBarter) {
    currentUserSkillValue = currentUser._id === dataSkill1.userId ? dataBarter.skillValue2 : dataBarter.skillValue1;
    oppositeUserSkillValue = currentUser._id === dataSkill1.userId ? dataBarter.skillValue1 : dataBarter.skillValue2;
  }

  if(dataBarter){
    if(dataBarter.skillValue1 > dataBarter.skillValue2){
      priceComp = dataBarter.priceSkill1 - dataBarter.discount;
    }
    else{
      priceComp = dataBarter.priceSkill2 - dataBarter.discount;
    }
  }


  useEffect(() => {
    if (dataBarter?.status === "Pending" && currentUser._id === dataBarter.sellerId) {
      setShowPayDiv(true);
    } else {
      setShowPayDiv(false);
    }

    if(dataBarter?.status === "Rejected"){
      setShowPayDiv(false);
      setShowProceedPaymentDiv(false);
    }

    if(dataBarter?.status === "Awaiting Payment" && currentUser._id === dataBarter.buyerId){
      setShowProceedPaymentDiv(true);
    }else {
      setShowProceedPaymentDiv(false);
    }

    if(dataBarter?.status === "Completed"){
      setShowPayDiv(false);
      setShowProceedPaymentDiv(false);
      setBarterCompleted(true);
    }

  }, [dataBarter, currentUser]);

  const handleProceed = async () => {
    if (dataBarter?.equivalency >= 80) {
      // Update the Barter status to "Completed"
      try {
        await newRequest.put(`/barter/status/${id}`, { status: 'Completed' });
        await newRequest.post(`/orders/create-barter/${id}`);
        window.location.reload();
      } catch (error) {
        console.error(error);
      }
     
    } else {
      
      try {
        await newRequest.put(`/barter/status/${id}`, { status: 'Awaiting Payment' });
        window.location.reload();
      } catch (error) {
        console.error(error);
      } 
      
    }
  };

  const handleReject = async () => {
    try {
      await newRequest.put(`/barter/status/${id}`, { status: 'Rejected' });
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
    
  };

  const { isLoading: isLoadingOrder, error: errorOrder, data: dataOrder, refetch: refetchOrder} = useQuery({
    queryKey: ["singleorder", id],
    queryFn: () =>
      newRequest
        .get(
          `/orders/barter/${id}`
        )
        .then((res) => {
          return res.data;
        }),
        enabled: !!dataBarter && dataBarter?.status === "Completed",
  });

  

  return (
    <div className="view-barter-page">

    
    <div className="container">
    {isLoadingBarter ? ("Loading") : errorBarter ? ("Something went wrong") : ( 
    <span className='breadcrumbs'><Link to="/dashboard" className="link">Dashboard</Link> {">"} Barter {((dataBarter._id).substring(0,10).toUpperCase())}</span>
    )}
    <div className="leftrightcontainer">
    {isLoadingBarter ? ("Loading") : errorBarter ? ("Something went wrong") : 
    (
    <div className="left">
      <div className="order-header">
       
        <div className="order-details">
          <div className="order-info">
            <h2>Barter #{((dataBarter._id).substring(0,10)).toUpperCase()}</h2>
            <p>Barter {dataBarter.status}</p>
            {isLoadingUser ? ("Loading") : errorUser ? ("Something went wrong") : (
            <p>Requested By : {dataUser.username}</p>)}
            {barterCompleted && dataOrder && (<p>Refer to Order <Link to={`/order/${dataOrder?._id}`}>#{((dataOrder?._id).substring(0,10).toUpperCase())}</Link></p>)}
          </div>
          <div className="order-amount">
            <h2>RM {(dataBarter.finalPrice - dataBarter.discount).toFixed(2)}</h2>
          </div>
        </div>
      </div>

      
      <div className="order-content">
        <div className="equivalencestatcontainer">
          <div className="bar">
              <h3>Skill Equivalency Score</h3>
              <Progressbar2 targetPercentage={dataBarter.equivalency} />
          </div>
        
          <div className="statistics">
              <h3>Your Skill Score</h3>
              <div className="value">
                <div className="inner">
                <p>{(currentUserSkillValue?.toFixed(2))}</p>
                </div>
              </div>
              
          </div>
          
          <div className="statistics">
              {dataUser2 && ( <h3>{dataUser2.username}'s Skill Score</h3> )}
              <div className="value">
                <div className="inner">
                <p>{(oppositeUserSkillValue?.toFixed(2))}</p>
                </div>
              </div>
              
          </div>

          <div className="statistics">
              <h3>Discount</h3>
              <div className="value">
                <div className="inner">
                <p>RM {(dataBarter.discount.toFixed(2))}</p>
                </div>
              </div>
              
          </div>
          
        </div>
        <table className="order-table">
          <thead>
            <tr>
              <th>Service Requested</th>
              <th>Quantity</th>
              <th>Duration</th>
              <th>Original Amount</th>
            </tr>
          </thead>
          {isLoadingSkill1 ? ("Loading") : errorSkill1 ? ("Something went wrong") : (
          <tbody>
            <tr>
              <td>{dataSkill1.title}</td>
              <td>1</td>
              <td>{dataSkill1.deliveryTime} day</td>
              <td>RM {(dataSkill1.price).toFixed(2)}</td>
            </tr>
          </tbody>
          )}
        </table>


        <table className="order-table">
          <thead>
            <tr>
              <th>Service Offered</th>
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
              <td>{dataSkill2.deliveryTime} day</td>
              <td>RM {(dataSkill2.price).toFixed(2)}</td>
            </tr>
          </tbody>
          )}
        </table>

      </div>

     
      </div>
    )}

      <div className="right">
        {dataUser2 && (<Contact dataUser={dataUser2}/>)}
        {showPayDiv && (
        <div className="pay">

          <div className="payheader">
            <h3>Accept Barter?</h3>
          </div>
          <div className="actions">
            <button className='proceedbtn' onClick={handleProceed}>Proceed</button>
            <button className='rejectbtn' onClick={handleReject}>Reject</button>
          </div>
          <div className="terms">
            <p>By Accepting to Proceed, Order will commence.</p>
          </div>
          
        </div>
        )}

        {showProceedPaymentDiv && (
        <div className="proceedpayment">
          <div className="paymentheader">
            <h3>Proceed to Payment</h3>
            {dataBarter && (<h4>RM {(dataBarter.finalPrice - dataBarter.discount).toFixed(2)}</h4>)}
          </div>
          <div className="actions">
            <Link to={`/paymentbarter/${id}`}>
            <button className='proceedbtn'>Proceed</button>
            </Link>
          </div>
        </div>
        )}
        
      </div>
      </div>
      </div>
    </div>
  )
}

export default Barter