import React, { useEffect } from 'react'
import './Ordercard.scss'
import { IoTimeOutline } from "react-icons/io5";
import { useQuery } from '@tanstack/react-query'
import newRequest from '../../utils/newRequest'
import { Link } from 'react-router-dom';
import { useState } from 'react';
import moment from 'moment';

const Ordercard = ({order}) => {
    var orderid;
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const [deliveryTime, setDeliveryTime] = useState(null);
    const [isBarter, setIsBarter] = useState(false);
    const [skill, setSkill] = useState(null);
    if(currentUser._id === order.buyerId){
        orderid = order.sellerId;
    }else{
        orderid = order.buyerId;
    }

    const fetchSkill = async (id) => {
        const response = await newRequest.get(`/skills/single/${id}`);
        setSkill(response.data);
        setDeliveryTime(response.data.deliveryTime);

    };

    const { isLoading: isLoadingUser, error: errorUser, data: dataUser2} = useQuery({
        queryKey: ["myUser", orderid],
        queryFn: () =>
        newRequest
            .get(
            `/users/${orderid}`
        )
        .then((res) => {
            return res.data;
        }),
        
    });

    const { isLoading, error, data: dataSkill} = useQuery({
        queryKey: ["thisskillorder", order.skillId1],
        queryFn: () =>
          newRequest
            .get(
              `/skills/single/${order.skillId1}`
            )
            .then((res) => {
              return res.data;
            }),
      });

    useEffect(() => {
        if(order.type === 'Barter'){
            setIsBarter(true);
        }
    }, [order])



    useEffect(() => {
        if(isBarter && currentUser){
            const idOpposite = currentUser._id === order.buyerId ? order.skillId1 : order.skillId2;
            fetchSkill(idOpposite); // Fetch the skill when isBarter is true and currentUser._id matches order.sellerId or order.buyerId
        }

        if(!isBarter){
            fetchSkill(order.skillId1);
        }
    }, [isBarter, currentUser._id, order.sellerId, order.buyerId])


    const price = order.price.toFixed(2);
    const dueIn = order.datesBooked 
  ? moment(order.datesBooked).fromNow() 
  : deliveryTime 
    ? moment(order.createdAt).add(deliveryTime, 'days').fromNow() 
    : 'N/A';
  return (
    <div className="ordercard">
        <div className="cardcontainer">
            <div className="user">
                {!isBarter && (<img className='serviceimage' src={order.img} alt="" />)}
                {isBarter && skill && (<img className='serviceimage' src={skill.cover} alt="" />)}
                {dataUser2 && <img className='userimage' src={dataUser2.img} alt="" />}

                <div className="skilluser">
                    {dataUser2 && <span>{dataUser2.username}</span>}
                    {!isBarter && dataSkill && <span className='title'>{dataSkill.title}</span>}
                    {isBarter && skill && <span className='title'>{skill.title}</span>}
                </div>
                
            </div>
            <div className="orderdetail">
                <div className="price">
                    <span className='head'>Price</span>
                    <span>RM {price}</span>
                </div>
                <div className="date">
                    <span className='head'>Due In</span>
                    <span><IoTimeOutline/> {dueIn}</span>
                </div>
                <div className="status">
                    <span className='head'>Status</span>
                    <div className={`progress ${order.status.toLowerCase()}`}>
                        <span>{(order.status).toUpperCase()}</span>
                    </div>
                </div>
                <Link to={`/order/${order._id}`} className='link'>
                <button>View</button>
                </Link>
            </div>

        </div>
    </div>
  )
}

export default Ordercard