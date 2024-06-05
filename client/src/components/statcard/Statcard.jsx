import React from 'react'
import './Statcard.scss'
import { FiPackage } from "react-icons/fi";

const Statcard = ({item}) => {
  const change = parseFloat(item.change).toFixed(2);
  const isPositive = change >= 0;
  return (
    <div className="statcard">
        <div className="statcontainer">
        <FiPackage size={24}/>
        <div className="text">
            <span className='title'>{item.title}</span>
            <span className='number'>{item.value}</span>
            <span className='detail'>
                <span className={isPositive ? "positive" : "negative" }>{change}%</span> {isPositive ? "more" : "less"} than previous month
            </span>
        </div>

        </div>
    </div>
  )
}

export default Statcard