import React, { useState } from 'react'
import './Reviews.scss'
import Review from '../review/Review'
import { useQuery } from '@tanstack/react-query'
import newRequest from '../../utils/newRequest'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FaStar } from 'react-icons/fa'


const Reviews = ({skillId}) => {

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const queryClient = useQueryClient()
    const { isLoading, error, data} = useQuery({
        queryKey: ["reviews"],
        queryFn: () =>
          newRequest
            .get(
              `/reviews/${skillId}`
            )
            .then((res) => {
              return res.data;
            }),
    });

    const [rating, setRating] = useState(null);
    const [hover, setHover] = useState(null);
    const [desc, setDesc] = useState("");

    const mutation = useMutation({
      mutationFn: (review) => {
        return newRequest.post("/reviews", review);
      },
      onSuccess:()=>{
        setDesc("");
        setRating(null);
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
      if (rating === null) {
        alert("Please select a star rating");
        return;
      }
      mutation.mutate({ skillId, desc, star: rating });
    };

    
 
  return (
    <div className="reviews">
            <h2>Reviews</h2>
            {isLoading ? "Loading.." : error ? "Something Went Wrong" :  data.map((review)=>
            <Review key={review._id} review={review}/>
            )}
            <hr />
            <div className="addReview">
              <h3>Add a review</h3>
              <form onSubmit={handleSubmit}>
              <div className="starrating">
                {[...Array(5)].map((star, index) => {
                  const currentRating = index + 1;
                  return(
                    <label type="radio" name="rating" value={currentRating} onClick = {()=> setRating(currentRating)}>
                      <FaStar className='star' color={currentRating <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                      onMouseEnter={()=> setHover(currentRating)}
                      onMouseLeave={()=> setHover(null)}
                      />
                    </label>
                  );
                })}
              </div>
              <input type="text" placeholder='Write your review...' value={desc} onChange={e => setDesc(e.target.value)}/>
              <button>Send</button>
              </form>
            </div>
            
          </div>
  )
}

export default Reviews