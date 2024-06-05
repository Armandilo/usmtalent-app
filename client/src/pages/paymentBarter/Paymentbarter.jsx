import React, { useEffect, useState } from "react";
import "./Paymentbarter.scss";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import newRequest from "../../utils/newRequest";
import { useParams } from "react-router-dom";
import CheckoutForm from "../../components/checkoutForm/CheckoutForm";

const stripePromise = loadStripe(
  "pk_test_51OzqoX08XPZNhqJiohk6WkPdX9N19F8fzy3Iz0IBlaBivx4mgsvkJxh62bLLXsNZLW4NdFPxiTh6TDUDsJXof9gu00lVU1ByAg"
);

const Paymentbarter = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [orderData, setOrderData] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const res = await newRequest.post(
          `/orders/create-barter-intent/${id}`
        );
        setClientSecret(res.data.clientSecret);
        
        const orderRes = await newRequest.get(`/orders/${res.data.orderId}`);
        setOrderData({
          ...orderRes.data,
          cover: res.data.cover,
          discount: res.data.discount,
          skilltitle: res.data.skilltitle,
        });
      } catch (err) {
        console.log(err);
      }
    };
    makeRequest();
  }, []);



  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return <div className="pay">
    {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm orderData={orderData}/>
        </Elements>
      )}
  </div>;
};

export default Paymentbarter;