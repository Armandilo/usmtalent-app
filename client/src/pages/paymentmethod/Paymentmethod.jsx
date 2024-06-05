import React, { useState } from "react";
import "./Paymentmethod.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { usePopup } from "../../components/popupcontext/PopupContext";
import { useParams } from "react-router-dom";
import 'ldrs/waveform'
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Selectslider from "../../components/selectSlider/Selectslider";
import Progressbar from "../../components/progressbar/Progressbar";




function Paymentmethod({selectedDate}) {
  const {id} = useParams();
  const [error, setError] = useState(null);

  const { handleClosePopup } = usePopup();
  
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState(false);
  const [showSkillList, setShowSkillList] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  const [message, setMessage] = useState('Calculating the equivalency...');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [result, setResult] = useState(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);


  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const { isLoading, error: errorSkill, data} = useQuery({
    queryKey: ["mySkillsSelect"],
    queryFn: () =>
      newRequest
        .get(
          `/skills?userId=${currentUser._id}`
        )
        .then((res) => {
          return res.data;
        }),
  });

  const { isLoading: isLoading2, error:error2, data:dataSkill2} = useQuery({
    queryKey: ["Userskill"],
    queryFn: () =>
      newRequest
        .get(
          `/skills/single/${id}`
        )
        .then((res) => {
          return res.data;
        }),
  });

  const userId = dataSkill2?.userId;

  const { isLoading: isLoadingUser2, error: errorUser2, data: dataUser2, refetch: refetchUser} = useQuery({
    queryKey: ["user2"],
    queryFn: () =>
      newRequest
        .get(
          `/users/${userId}`
        )
        .then((res) => {
          return res.data;
        }),
        enabled: !!userId,
  });

  const calculateEquivalency = (user1,user2, skill1,skill2) => {

    const minRating = 1;
    const userRating1 = user1.starNumber !== 0 ? user1.totalStars / user1.starNumber : minRating;
    const userRating2 = user2.starNumber !== 0 ? user2.totalStars / user2.starNumber : minRating;
    console.log("User Rating 1: ", userRating1);
    console.log("User Rating 2: ", userRating2);
    const skillRating1 = skill1.starNumber !== 0 ? skill1.totalStars / skill1.starNumber : minRating;
    const skillRating2 = skill2.starNumber !== 0 ? skill2.totalStars / skill2.starNumber : minRating;
    console.log("Skill Rating 1: ", skillRating1);
    console.log("Skill Rating 2: ", skillRating2);
    const categorySkill1 = skill1.category;
    console.log("Category Skill 1: ", categorySkill1);
    const categorySkill2 = skill2.category;
    console.log("Category Skill 2: ", categorySkill2);
    const categoryWeightage1 = categorySkill1 === 'music' ? 0.65 : categorySkill1 === 'design' ? 0.80 : categorySkill1 === 'digital' ? 0.85 : categorySkill1 === 'writing' ? 0.70 : categorySkill1 === 'video' ? 0.9 : categorySkill1 === 'programming' ? 1.0 : categorySkill1 === 'business' ? 0.75 : categorySkill1 === 'events' ? 0.60 : categorySkill1 === 'education' ? 0.70 : categorySkill1 === 'other' ? 0.5 : 0;
    const categoryWeightage2 = categorySkill2 === 'music' ? 0.65 : categorySkill2 === 'design' ? 0.80 : categorySkill2 === 'digital' ? 0.85 : categorySkill2 === 'writing' ? 0.70 : categorySkill2 === 'video' ? 0.9 : categorySkill2 === 'programming' ? 1.0 : categorySkill2 === 'business' ? 0.75 : categorySkill2 === 'events' ? 0.60 : categorySkill2 === 'education' ? 0.70 : categorySkill2 === 'other' ? 0.5 : 0;
    console.log("Category Weightage 1: ", categoryWeightage1);
    console.log("Category Weightage 2: ", categoryWeightage2);
    //Requestor
    const skillValue1 = skill1.price * categoryWeightage1 * userRating1 * skillRating1;
    //Seller
    const skillValue2 = skill2.price * categoryWeightage2 * userRating2 * skillRating2;
    console.log("Skill Value 1: ", skillValue1);
    console.log("Skill Value 2: ", skillValue2);
    const equivalency = (Math.min(skillValue1, skillValue2) / Math.max(skillValue1, skillValue2)) * 100;
    console.log("Equivalency: ", equivalency);
    return {
      userRating1,
      userRating2,
      skillRating1,
      skillRating2,
      categorySkill1,
      categorySkill2,
      categoryWeightage1,
      categoryWeightage2,
      skillValue1,
      skillValue2,
      equivalency
    };
  }

  useEffect(() => {
    console.log("Selected Date in Payment Method", selectedDate);
    if (paymentMethod && !isLoading) {
      setShowSkillList(true);
    }
  }, [paymentMethod, isLoading]); 

  const handleContinue = (selectedSkill) => {
    setShowSkillList(false);
    setShowLoader(true);
    setSelectedSkill(selectedSkill);
    const newresult = calculateEquivalency(currentUser,dataUser2, selectedSkill, dataSkill2);
    setResult(newresult);
    console.log(calculateEquivalency(currentUser,dataUser2, selectedSkill, dataSkill2));
    const messages = [
      'Calculating skill equivalency...',
      'Success score calculated...',
      'Comparison of skill...',
      // Add more messages as needed
    ];
    let currentMessageIndex = 0;

    const intervalId = setInterval(() => {
      currentMessageIndex = (currentMessageIndex + 1) % messages.length;
      setMessage(messages[currentMessageIndex]);
    }, 2000); // Change message every 2 seconds

    // Change content after 6 seconds
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      setShowLoader(false);
      setShowAgreement(true);
    }, 6000); // 6 seconds

    // Clean up interval and timeout on component unmount or when paymentMethod changes
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  };

  const createBarter = async () => {
    const newBarter = {
      //Seller
      skillId1: dataSkill2._id,
      //Requestor
      skillId2: selectedSkill._id,
      img: dataSkill2.cover,
      title: dataSkill2.title,
      //Requestor
      priceSkill1: selectedSkill.price,
      //Seller
      priceSkill2: dataSkill2.price,
      finalPrice : result.skillValue1 > result.skillValue2 ? selectedSkill.price : dataSkill2.price,
      //Requstor
      skillValue1: result?.skillValue1,
      //Seller
      skillValue2: result?.skillValue2,
      skillRating1: result.skillRating1,
      skillRating2: result.skillRating2,
      equivalency: result.equivalency,
      discount: result.equivalency >= 80 ? (result.skillValue1 > result.skillValue2 ? selectedSkill.price : dataSkill2.price) : (result.skillValue1 > result.skillValue2 ? selectedSkill.price : dataSkill2.price) * (result.equivalency / 100),
      sellerId: dataSkill2.userId,
      buyerId: currentUser._id,
      isAccepted: false,
    };
    try {
      console.log(newBarter);
      const response = newRequest.post('/barter', newBarter);
      console.log(response.data);
      handleClosePopup();
      navigate(`/`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="paymentmethod">

    
      {!paymentMethod && (
        <>
      <form >
        <div className="header">
            <h1>Choose your payment method</h1>
            <p>Learn more about <Link to="/register">payment methods</Link></p>

        </div>

        <div className="paymentoption">
           
            <div className="left" onClick={() => setPaymentMethod(true)}>
                {/*<span>Barter</span>*/}
            </div>
         
            <Link to ={selectedDate  ? `/payment/${id}/${selectedDate}` : `/payment/${id}`  } onClick={handleClosePopup}>
            <div className="right">
                {/*<span>Online Payment</span>*/}
            </div>
            </Link>

        </div>
      </form>
      <div className="terms">
        <p>By selecting a payment method, you agree to the USMTalent Terms of Service regarding Payment.</p>
      </div>
      </>
      )}
     

      <div className={showSkillList ? "section active" : "section"}>
      {paymentMethod && showSkillList && (
        <>
        <div className="selectSkill">
            <div className="skillheader">
              <h1>Select Your Skill</h1>
              <p>Learn more about <Link to="/register">skill equivalency</Link></p>
            </div>
            
            <div className="cards">
            {isLoading? (
              <div className="loader">
                <l-waveform
                  size="35"
                  stroke="3.5"
                  speed="1"
                  color="black" 
                ></l-waveform>
              </div>
            ) : (
            data && data.length > 0 && (
            <Selectslider key={data.length} slidesToShow={1} arrowsScroll={1}>
            {data.map((skill) => (
              
              <div className="skillcard" key={skill._id} onClick={() => handleContinue(skill)}>
              <img src={skill.cover} alt="" />   
              <div className="info">
                  <p>{skill.title.substring(0,50)}</p>
                  <div className="rating">
                      <img src="/star.png" alt="" />
                      <span>{Math.round(skill.totalStars / skill.starNumber)}</span>
                      <span className='number'>({skill.starNumber})</span>
                  </div>

              </div>
            </div>
            ))}
            </Selectslider>
            )
            )}
            </div>
        </div>
        </>
      )}
      </div>
      
      <div className={showLoader ? "section active" : "section"}>
      {paymentMethod && showLoader && (
        <>
        <div className="loader">
          <l-waveform
            size="35"
            stroke="3.5"
            speed="1"
            color="black" 
          ></l-waveform>
            <p>{message}</p>
          </div>
          </>
      )

      }
      </div>



      <div className={showAgreement ? "section active" : "section"}>
      { showAgreement && (
      <>
        <div className="agreement">

          <div className="agreementheader">
            <h1>Equivalency Result</h1>
            <p>Based on the skills, user and category ratings, the equivalency score is calculated.</p>
          </div>
          <div className="items">
          <div className="item">
            <span>Your Skill Value&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;</span>
            <span>{(result.skillValue1).toFixed(2)}</span>
          </div>

          <div className="item">
            <span>Other Skill Value&nbsp;&nbsp;:&nbsp;&nbsp;</span>
            <span>{(result.skillValue2).toFixed(2)}</span>
          </div>
          </div>
          <div className="bar">
            <Progressbar targetPercentage={result.equivalency}/>
          </div>

          

          <div className="buttondiv">
            <div className="terms-agreement">
              <input
                type="checkbox"
                id="agree-to-terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              />
              <label htmlFor="agree-to-terms">I agree to the terms and conditions</label>
            </div>
            <button disabled={!agreeToTerms} onClick={createBarter}>Proceed</button>
          </div>
          
        </div>
      </>
      )

      }
      </div>


     
    </div>
  );
}

export default Paymentmethod;