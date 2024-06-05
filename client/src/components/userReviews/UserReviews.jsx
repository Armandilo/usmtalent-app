import React from 'react'
import './UserReviews.scss'
import UserReview from '../userReview/UserReview'
import { useQuery } from '@tanstack/react-query'
import newRequest from '../../utils/newRequest'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const UserReviews = ({bossId}) => {


    const queryClient = useQueryClient()
    const { isLoading, error, data} = useQuery({
        queryKey: ["userreviews"],
        queryFn: () =>
          newRequest
            .get(
              `/userreviews/${bossId}`
            )
            .then((res) => {
              return res.data;
            }),
    });

    const mutation = useMutation({
      mutationFn: (review) => {
        return newRequest.post("/userreviews", review);
      },
      onSuccess:()=>{
        queryClient.invalidateQueries(["reviews"])
      },
      onError:(error)=>{
        // Check if the server response includes a message property
      console.log(error);
      const errorMessage = error.response?.data;
      if (errorMessage) {
      // If the server response includes a message property, display it in an alert
        alert(errorMessage);
      } else {
      // If the server response does not include a message property, display a default error message
        alert("An error occurred while creating the review.");
        console.log(errorMessage);
      }
      }
    });
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const desc = e.target[0].value;
      const star = e.target[1].value;
      mutation.mutate({ bossId, desc, star });
    };

  return (
    <div className="userreviews">
            <div className="reviewheader">
              <h2>Reviews as Seller</h2>

            </div>
            
            {isLoading ? "Loading.." : error ? "Something Went Wrong" : data.length === 0 ? <h2 className='no-review'>No Reviews...</h2> : data.map((review)=>
            <UserReview key={review._id} review={review}/>
            )}
            
            <div className="addReview">
             
              <form className="addForm" action="" onSubmit={handleSubmit}>
                <input type="text" placeholder='Write your review...' />
              
                <select name="" id="">
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
                <button>Send</button>
              </form>
            </div>
            
          </div>
  )
}

export default UserReviews