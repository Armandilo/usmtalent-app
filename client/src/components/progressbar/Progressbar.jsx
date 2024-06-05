import React from 'react'
import './Progressbar.scss'
import { useState, useEffect } from 'react'

const Progressbar = ({targetPercentage}) => {
    const [percentage, setPercentage] = useState(0);
    const totalLength = 472;
  
    useEffect(() => {
      const interval = setInterval(() => {
        setPercentage(prevPercentage => {
          if (prevPercentage < targetPercentage) {
            return prevPercentage + 1;
          }
          clearInterval(interval);
          return prevPercentage;
        });
      }, 20);
      return () => clearInterval(interval);
    }, [targetPercentage]);

    const strokeDashoffset = totalLength - (totalLength * (percentage / 100));
  

  return (
    <div className='progressbar' style={{'--stroke-dashoffset' : strokeDashoffset}}>
        <div className="container">
            <div className="outer">
                <div className="inner">
                    <div id='number'>
                        {percentage.toFixed(0)}%
                    </div>
                </div>
            </div>

            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="160px" height="160px">
                <defs>
                    <linearGradient id="GradientColor">
                    <stop offset="0%" stop-color="#e91e63" />
                    <stop offset="100%" stop-color="#673ab7" />
                    </linearGradient>
                </defs>
                <circle cx="80" cy="80" r="70" stroke-linecap="round" />
            </svg>
        </div>

    </div>
  )
}

export default Progressbar