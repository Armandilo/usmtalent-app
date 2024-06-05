import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import './CheckoutForm.scss';
import newRequest from "../../utils/newRequest";




const CheckoutForm = ({orderData}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
     
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);


  


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "https://usmtalent-app.vercel.app/success",
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
    //paymentMethodOrder: ['fpx'],
  };

  return (

    <div className="checkoutform">

    <div className="container">

    <div className="skillcontainer">
        <div className="header">
          <h1>Order Details</h1>
        </div>
        <div className="skilldetail">
          <span>{orderData?.skilltitle !== null && orderData?.skilltitle !== undefined ? orderData.skilltitle : orderData.title}</span>
          <img src={orderData?.cover !== null && orderData?.cover !== undefined ? orderData.cover : orderData.img} alt="" />
        </div>
        <div className="pricesub">
          <div className="title">Subtotal</div>
          <div className="amount">RM {orderData.price.toFixed(2)}</div>
        </div>
        <div className="pricebarter">
          <div className="title">Barter Discount</div>
          <div className="amount">- RM {orderData?.discount !== null && orderData?.discount !== undefined ? orderData.discount : "0.00"}</div>
        </div>
        <hr />
        <div className="pricetotal">
          <div className="title">Total</div>
          <div className="amount">RM {orderData.price.toFixed(2)}</div>
        </div>


    </div>

    <div className="checkoutcontainer">
      

      <div className="checkout">
        <h1>Checkout</h1>
        <p>Enter your email and payment information to complete your purchase.</p>

      </div>
  
    <div className="paymentdetail">
    <form id="payment-form" onSubmit={handleSubmit}>
      <LinkAuthenticationElement
        id="link-authentication-element"
        onChange={(e) => setEmail(e.target.value)}
      />
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
    </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;