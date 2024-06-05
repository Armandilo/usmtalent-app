import React, { useState } from "react";
import "./Verticalstepperbarter.scss";
import { TiTick } from "react-icons/ti";
import newRequest from "../../utils/newRequest";
import { useQuery } from "@tanstack/react-query";

const Verticalstepperbarter = ({currentStep, setCurrentStep, orderId}) => {
  const steps = ["Requirements submitted", "Order in progress", "File Submitted", "Finished"];
  const statuses = ["Pending", "Started","In Progress", "Awaiting Confirmation", "Completed"];

  const updateStatus = async (status) => {
    try {
      await newRequest.put(`/orders/status/${orderId}`, { status });
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

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

  const { isLoading: isLoadingSkill, error: errorSkill, data: dataSkill} = useQuery({
    queryKey: ["Orderskillbarter1", dataOrder?.skillId1],
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

  const { isLoading: isLoadingSkill2, error: errorSkill2, data: dataSkill2} = useQuery({
    queryKey: ["Orderedskillbarter2", dataOrder?.skillId2],
    queryFn: () =>
      newRequest
        .get(
          `/skills/single/${dataOrder?.skillId2}`
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
        <div className="orderheader"><h3>Order Details</h3></div>
          
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
          {isLoadingSkill2 ? ( "Loading" ) : errorSkill2 ? ("Something went wrong") : (
          <div className="order-summary">
            <img src={dataSkill2?.cover} alt="order" />
            
            <div>
              <p>{dataSkill2?.shortTitle}</p>
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
          {!complete && currentStep !== 0 && currentStep !== 4 && (
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

export default Verticalstepperbarter;
