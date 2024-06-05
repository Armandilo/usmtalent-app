import React from 'react'
import './Orders.scss' 
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import newRequest from '../../utils/newRequest'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCallback } from 'react'


const Orders = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const { isLoading, error, data} = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      newRequest
        .get(
          `/orders`
        )
        .then((res) => {
          return res.data;
        }),
  });

  const navigate = useNavigate(); 
  const handleContact = async (order) =>{
    const sellerId = order.sellerId;
    const buyerId = order.buyerId;
    const id = sellerId + buyerId;

    try {
      const res = await newRequest.get(`/conversations/single/${[order.sellerId, order.buyerId].sort().join('')}`);
      navigate(`/chat`);
      
    } catch (err) {
      if(err.response.status === 404){
        const res = await newRequest.post(`/conversations`, {to:sellerId , from:buyerId});
        navigate(`/chat`);
      }
    }
    
  }

  
  return (
    <div className='orders'>
      {isLoading ? ("Loading") : error ? ("Something went wrong") : 
      (!data || data.length===0) ? ( 
      
      <div className="container">
        <div className="titlecontainer">
          <div className="titlecontent">
            <div className="title">
            <h1>Orders</h1>
            </div>

          </div>
        
        </div>
        <div className="noorder">
          <img src="/no-order.jpeg" alt="" />
        </div>
      </div>
       
      ) :
      (
      <div className="container">
        <div className="titlecontainer">
          <div className="titlecontent">
            <div className="title">
            <h1>Orders</h1>
            </div>

          </div>
        
        </div>


        <div className="table">

        
        <table>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Contact</th>
          </tr>

          {data.map((order) => (
            <tr key={order._id}>
            <td>
              <img className='skill' src={order.img} alt="" />
            </td>
            <td>{order.title}</td>
            <td>RM{order.price.toFixed(2)}</td>
            
            <td className='action'> 
              <img className='message' src="message.png" alt="" onClick={()=>handleContact(order)} />
    
            </td>
          </tr>))}

        </table>
      </div>


      </div>)}
    </div>
  )
}

export default Orders