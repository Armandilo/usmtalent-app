import React from 'react'
import './Requestcard.scss'
import { IoTimeOutline } from "react-icons/io5";
import { useQuery } from '@tanstack/react-query'
import newRequest from '../../utils/newRequest'
import { Link } from 'react-router-dom';
import moment from 'moment';
const Requestcard = ({barter}) => {

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));


    const { isLoading: isLoadingUser, error: errorUser, data: dataUser} = useQuery({
        queryKey: ["userRequest"],
        queryFn: () =>
        newRequest
            .get(
            `/users/${barter.sellerId}`
        )
        .then((res) => {
            return res.data;
        }),
        enabled: !!barter,
    });

    const price = (barter.finalPrice - barter.discount).toFixed(2);
  return (
    <div className="requestcard">
        <div className="requestcontainer">
            <div className="user">
                <img className='serviceimage' src={barter.img} alt="" />
                {dataUser && <img className='userimage' src={dataUser.img} alt="" />}
                {dataUser && <span>{dataUser.username}</span>}
            </div>
            <div className="requestdetail">
                <div className="price">
                    <span className='head'>Price</span>
                    <span>RM {price}</span>
                </div>
                <div className="date">
                    <span className='head'>Requested Time</span>
                    <span><IoTimeOutline/> {moment(barter.createdAt).format('DD/MM/YYYY')}</span>
                </div>
                <div className="status">
                    <span className='head'>Status</span>
                    <div className={`progress ${barter.status.toLowerCase()}`}>
                        <span>{(barter.status.toUpperCase())}</span>
                    </div>
                </div>
                <Link to={`/barter/${barter._id}`} className='link'>
                <button>View</button>
                </Link>
            </div>

        </div>
    </div>
  )
}

export default Requestcard