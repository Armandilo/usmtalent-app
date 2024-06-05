import React from 'react'
import './Transactioncard.scss'
import { IoTimeOutline } from "react-icons/io5";
import { useQuery } from '@tanstack/react-query'
import newRequest from '../../utils/newRequest'
import { useEffect } from 'react';
import { useState } from 'react';
import moment from 'moment';

const Transactioncard = ({order}) => {

    var orderid;
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if(currentUser._id === order.buyerId){
        orderid = order.sellerId;
    }else{
        orderid = order.buyerId;
    }

    const { isLoading: isLoadingUser, error: errorUser, data: dataUser3} = useQuery({
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
        queryKey: ["thisskill", order.skillId1],
        queryFn: () =>
          newRequest
            .get(
              `/skills/single/${order.skillId1}`
            )
            .then((res) => {
              return res.data;
            }),
      });

    
      console.log(dataSkill);

    const price = order.price.toFixed(2);
    const formattedDate = moment(order.createdAt).format('DD/MM/YYYY');
  return (
    <div className="transactioncard">
        
        <div className="cardcontainer">
            <div className="user">
                
                <img className='userimage' src={dataUser3 ? dataUser3.img : '../noavatar.png'} alt="" />
                <span>{dataUser3 ? dataUser3.username : ''}</span>
            </div>
            <div className="orderdetail">
                <div className="skill">
                    <span>{dataSkill ? dataSkill.title : ''}</span>
                </div>
                <div className={currentUser._id === order.sellerId ? 'positive' : 'negative'}>
                    <span>{currentUser._id === order.sellerId ? '+' : '-'} RM {price}</span>
                </div>
                <div className="date">
                    <span><IoTimeOutline/> {formattedDate}</span>
                </div>
                <div className="status">
                    <div className='progress'>
                        <span>COMPLETED</span>
                    </div>
                </div>

                
            </div>

        </div>
    </div>
  )
}

export default Transactioncard