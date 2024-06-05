import React from 'react'
import './Review.scss'
import { useQuery } from '@tanstack/react-query'
import newRequest from '../../utils/newRequest'
import { Link } from 'react-router-dom'

const Review = ({review}) => {

  const { isLoading, error, data} = useQuery({
    queryKey: [review.userId],
    queryFn: () =>
      newRequest
        .get(
          `/users/${review.userId}`
        )
        .then((res) => {
          return res.data;
        }),
});
  return (
    <div className="review">
        
              {isLoading ? "Loading" : error ? "Something Went Wrong" : 
              (<div className="user">
                <Link className='link' to={`/profile/${data._id}`} ><img className="pp" src={data.img || "/noavatar.png"} alt="" /></Link>
                <div className="info">
                <Link className='link' to={`/profile/${data._id}`} ><span>{data.username}</span></Link>
                  <div className="country">
                    <img src="/malaysia.png" alt="" />
                    <span>{data.country}</span>
                  </div>
                </div>
              </div>)}

              
              <div className="rating">
                {Array(review.star).fill().map((item,i)=>(
                  <img src="/star.png" alt="" key={i}/>
                ))}
          
                  <span>{review.star}</span>
              </div>


                <p>{review.desc}
                </p>

                <div className="helpful">
                  <span>Helpful?</span>
                  <img src="/like.png" alt="" />
                  <span>Yes</span>
                  <img src="/dislike.png" alt="" />
                  <span>No</span>
                </div>
            </div>

  )
}

export default Review