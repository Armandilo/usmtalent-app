"use client"
import "./Chart.scss"
import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import moment from "moment";


const Chart = ({orderData}) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const currentMonthIndex = moment().month();
  const months = moment.months().slice(0, currentMonthIndex + 1);
  let data = [];
  if(orderData){
  data = months.map(month => {
    const monthlyOrders = orderData.filter(order => {
      return order.isCompleted && order.sellerId === currentUser._id && moment(order.createdAt).format('MMMM') === month;
    });

    const monthlyEarnings = monthlyOrders.reduce((total, order) => total + order.price, 0);
    return { name: month, RM: monthlyEarnings.toFixed(2) };
  });
}

  return (
    
    <div className="chart">
      {(!orderData || orderData?.length === 0 || !orderData.some(order => order.sellerId === currentUser._id && order.price >0)) ? <img className="no-order" src="./no-sales.png" alt="No orders" />
      : (<ResponsiveContainer width="100%" height="90%">
        <AreaChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >

        <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF7600" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#FF7600" stopOpacity={0}/>
            </linearGradient>
           
          </defs>
          
          <XAxis dataKey="name" axisLine={false} tickLine={false} tickFormatter={(value) => value !== 0 ? value : ''}/>
          <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => value !== 0 ? value : ''}/>
          <Tooltip />
          <Area type="monotone" dataKey="RM" stroke="#FF7600"  strokeWidth={1} fill="url(#colorUv)" />
        </AreaChart>
      </ResponsiveContainer>)}
    </div>
  )
}

export default Chart