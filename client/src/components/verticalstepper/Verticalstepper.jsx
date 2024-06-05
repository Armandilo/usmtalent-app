import React, { useState } from "react";
import "./Verticalstepper.scss";
import { TiTick } from "react-icons/ti";
import newRequest from "../../utils/newRequest";
import { useQuery } from "@tanstack/react-query";

const Verticalstepper = ({currentStep, setCurrentStep, orderId}) => {
  const steps = ["Requirements submitted", "Order in progress", "File Submitted", "Finished"];
  const statuses = ["Pending", "Started","In Progress", "Confirmation", "Completed"];

  const updateStatus = async (status) => {
    try {
      await newRequest.put(`/orders/status/${orderId}`, { status });
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const { isLoading: isLoadingOrder, error: errorOrder, data: dataOrder, refetch: refetchOrder} = useQuery({
    queryKey: ["singleorder", orderId],
    queryFn: () =>
      newRequest
        .get(
          `/orders/${orderId}`
        )
        .then((res) => {
          return res.data;
        }),
  });

  

  const { isLoading: isLoadingSkill, error: errorSkill, data: dataSkill} = useQuery({
    queryKey: ["Orderskill", dataOrder?.skillId1],
    queryFn: () =>
      newRequest
        .get(
          `/skills/single/${dataOrder?.skillId1}`
        )
        .then((res) => {
          return res.data;
        }),
        enabled: !!dataOrder,
  });
  const [complete, setComplete] = useState(false);

  return (
    <div className="vertical-stepper">
      <div className="order-container">
        <div className="order-details">
          <h3>Order Details</h3>
          {isLoadingSkill ? ( "Loading" ) : errorSkill ? ("Something went wrong") : (
          <div className="order-summary">
            <img src={dataSkill?.cover} alt="order" />
            
            <div>
              <p>{dataSkill?.shortTitle}</p>
              {isLoadingOrder ? ( "Loading" ) : errorOrder ? ("Something went wrong") : (
              <span className="status-badge">{dataOrder.status}</span>
              )}
            </div>
            
          </div>
          )}
        </div>
        
        <div className="track-order">
          <h3>Track Order</h3>
          <div className="stepper-container">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`step-item ${currentStep === i + 1 ? "active" : ""} ${
                  i + 1 < currentStep + 1 || complete ? "complete" : ""
                }`}
              >
                <div className="step">
                  {i + 1 < currentStep + 1 || complete ? <TiTick size={16} /> : <div className="circle"></div>}
                </div>
                <p className="step-label">{step}</p>
              </div>
            ))}
          </div>
          {!complete && currentStep !== 0 && currentStep !== 4 && currentUser._id === dataOrder?.sellerId && (
          <button
          className="btn"
          onClick={async () => {
            if (currentStep === steps.length - 1) {
              setComplete(true);
              await updateStatus(statuses[currentStep+1]);
            } else {
              const nextStep = currentStep + 1;
              await updateStatus(statuses[nextStep]);
              setCurrentStep(nextStep);
            }
          }}
        >
          {currentStep === steps.length - 1 ? "Deliver Now" : "Next"}
        </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Verticalstepper;
