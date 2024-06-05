import React from 'react'
import './Refund.scss'
import { useQuery } from '@tanstack/react-query'
import newRequest from '../../utils/newRequest'


const Refund = ({orderId}) => {

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const { isLoading: isLoadingOrder, error: errorOrder, data: dataOrder, refetch: refetchOrder} = useQuery({
        queryKey: ["singleorder"],
        queryFn: () =>
          newRequest
            .get(
              `/orders/${orderId}`
            )
            .then((res) => {
              return res.data;
            }),
      });
    
  return (
    <div className='refund'>
        <div className="refundcontainer">
            <div className="refundheader">
                <h3>Got issues with the order?</h3>
            </div>
            <button>Refund Request</button>
        </div>
    </div>
  )
}

export default Refund