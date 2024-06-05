import React from 'react'
import './Skillcard.scss'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import newRequest from '../../utils/newRequest'
const Skillcard = ({item}) => {

    const { isLoading, error, data} = useQuery({
        queryKey: [`${item.userId}`],
        queryFn: () =>
          newRequest
            .get(
              `/users/${item.userId}`
            )
            .then((res) => {
              return res.data;
            }),
      });
  return (
    <Link to={`/skill/${item._id}`} className='link'>
    <div className='skillcard'>
        <div className="container">
        
        <img src={item.cover} alt="" />
    
        
        <div className="info">
            {isLoading ? (
                "loading"
            ): error ? (
                "Something went wrong"
            ) : (
            <div className="user">
                <img src={data.img || "/noavatar.png"} alt="" />
                <span>{data.username}</span>
            </div>
            )}
            <div className="description">
            <p>{item.title.substring(0,70)}...</p>
            </div>
            <div className="rating">
                <img src="star.png" alt="" />
                <span>{!isNaN(item.totalStars / item.starNumber)&& Math.round(item.totalStars / item.starNumber).toFixed(2) || "0.00"}</span>
                <span className='number'>{"("}{item.starNumber} reviews{")"}</span>
            </div>
        </div>
        <hr />
        <div className="details">
            <img src="heart.png" alt="" />
            <div className="price">
                <span>STARTING AT</span>
                <h2>RM {item.price.toFixed(2)}</h2>
            </div>

        </div>
        </div>
    </div>
    </Link>
  )
}

export default Skillcard