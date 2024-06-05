import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Success.scss";
import { useState } from "react";
import { useRef } from "react";

const Success = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const payment_intent = params.get("payment_intent");


  useEffect(() => {
    const makeRequest = async () => {
      if (payment_intent) {
        try {
          const response = await newRequest.put("/orders", { payment_intent });
          const orderId = response.data._id;
  
          setTimeout(() => {
            navigate(`/order/${orderId}`);
          }, 5000);
        } catch (err) {
          console.log(err);
        }
      }
    };

    makeRequest();
  }, []); // Only run once when the component mounts


  return (
    <div className="success">
      Payment successful. <br/>You are being redirected to the order page...
    </div>
  );
};

export default Success;