import React, { useEffect, useState } from "react";
import "./Payment.scss";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import newRequest from "../../utils/newRequest";
import { useParams } from "react-router-dom";
import CheckoutForm from "../../components/checkoutForm/CheckoutForm";
import { useLocation } from "react-router-dom";

const stripePromise = loadStripe(
  "pk_test_51OzqoX08XPZNhqJiohk6WkPdX9N19F8fzy3Iz0IBlaBivx4mgsvkJxh62bLLXsNZLW4NdFPxiTh6TDUDsJXof9gu00lVU1ByAg"
);

const Payment = () => {
  const [clientSecret, setClientSecret] = useState("");

  const { id, selectedDate = null } = useParams();


  console.log("selected date in payment", selectedDate);
  useEffect(() => {
    const makeRequest = async () => {
      try {
        const res = await newRequest.post(
          `/orders/create-payment-intent/${id}`, {datesBooked: selectedDate ? selectedDate : null}
        );
        console.log("Selected Date in make Request",selectedDate);
        setClientSecret(res.data.clientSecret);

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
          <CheckoutForm/>
        </Elements>
      )}
  </div>;
};

export default Payment;