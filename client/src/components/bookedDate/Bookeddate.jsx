import React, { useEffect, useState } from 'react';
import './Bookeddate.scss';
import moment from 'moment';
const Bookeddate = ({ deliveryTime, bookedDate }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(deliveryTime) - +new Date();
        let timeLeft = {};
    
        if (difference > 0) {
          timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
          };
        }
        return timeLeft;
      };
    
      const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    
      useEffect(() => {
        const timer = setTimeout(() => {
          setTimeLeft(calculateTimeLeft());
        }, 1000);
    
        return () => clearTimeout(timer);
      });
    
      return (
        <div className="time-left-to-deliver">
            
        <div className="timeheader">
            <h3>Booking Date</h3>
            
        </div>

        <div className="bookeddate">
            <div className="p">{moment(bookedDate).format('DD MMMM YYYY')}</div>
        </div>
        
        
        
          <div className="time-left">
             <div className="time-unit">
                <span className="number">{timeLeft.days || '0'}</span>
                <span className="label">Days</span>
            </div>
            <div className="block"></div>
           <div className="time-unit">
             <span className="number">{timeLeft.hours || '0'}</span>
             <span className="label">Hours</span>
           </div>
           <div className="block"></div>
           <div className="time-unit">
             <span className="number">{timeLeft.minutes || '0'}</span>
             <span className="label">Minutes</span>
           </div>
           <div className="block"></div>
           <div className="time-unit">
             <span className="number">{timeLeft.seconds || '0'}</span>
             <span className="label">Seconds</span>
           </div>
         </div>
     
       </div>
     );
};

export default Bookeddate;
