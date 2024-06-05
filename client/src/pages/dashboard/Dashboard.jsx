import React from 'react'
import './Dashboard.scss'
import { IoLocationSharp } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";
import { useQuery } from '@tanstack/react-query'
import newRequest from '../../utils/newRequest'
import { motion } from "framer-motion"
import { useEffect } from 'react'
import Chart from '../../components/areachart/Chart';
import { LuPackage } from "react-icons/lu";
import Ordercard from '../../components/ordercard/Ordercard';
import { useState } from 'react';
import Statcard from '../../components/statcard/Statcard';
import Transactioncard from '../../components/transcationcard/Transactioncard';
import { TbReportAnalytics } from "react-icons/tb";
import moment from 'moment';
import * as XLSX from 'xlsx';
import Requestcard from '../../components/requestcard/Requestcard';
import { Link } from 'react-router-dom';
import ExcelJS from 'exceljs';

const Dashboard = () => {

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const id = currentUser._id;
    const [activeTab, setActiveTab] = useState('tab1');
    let completedOrdersThisMonth = [];
    let totalEarningsThisMonth = 0;
    const { isLoading: isLoadingOrder, error: errorOrder, data: orderData} = useQuery({
        queryKey: ["orders"],
        queryFn: () =>
        newRequest
            .get(
            `/orders`
            )
            .then((res) => {
            return res.data;
            }),
    });

    const { isLoading: isLoadingBarter, error: errorBarter, data: dataBarter} = useQuery({
        queryKey: ["barters"],
        queryFn: () =>
        newRequest
            .get(
            `/barter`
        )
        .then((res) => {
            return res.data;
        }),
    });

    console.log(dataBarter);
    const currentMonth = moment().month();
    const currentYear = moment().year();
    if (orderData) {
        completedOrdersThisMonth = orderData.filter((order) => {
          const orderMonth = moment(order.createdAt).month();
          const orderYear = moment(order.createdAt).year();
      
          return order.isCompleted && order.sellerId == currentUser._id && orderMonth === currentMonth && orderYear === currentYear;
        });
      
        totalEarningsThisMonth = completedOrdersThisMonth.reduce((total, order) => total + order.price, 0);
      }
    console.log("Total Earning")
    console.log(totalEarningsThisMonth);
  
    const { isLoading: isLoadingUser, error: errorUser, data: dataUser} = useQuery({
      queryKey: ["myUser"],
      queryFn: () =>
        newRequest
          .get(
            `/users/${id}`
          )
          .then((res) => {
            return res.data;
          }),
    });
  
    useEffect(() => {
      window.scrollTo(0, 0);
  
    }, []);


    let ordersCompleted = 0;
    let totalEarnings = 0;
    let ordersChange = 0;
    let earningsChange = 0;
    let barterCompleted = 0;
    let barterChange = 0;
    
    if (orderData) {
        const completedOrdersThisMonth = orderData.filter((order) => {
          const orderMonth = moment(order.createdAt).month();
          const orderYear = moment(order.createdAt).year();
      
          return order.isCompleted && order.sellerId == currentUser._id && orderMonth === currentMonth && orderYear === currentYear;
        });
      
        const totalEarningsThisMonth = completedOrdersThisMonth.reduce((total, order) => total + order.price, 0);
    
        const completedOrdersLastMonth = orderData.filter((order) => {
          const orderMonth = moment(order.createdAt).month();
          const orderYear = moment(order.createdAt).year();
      
          return order.isCompleted && order.sellerId == currentUser._id && orderMonth === currentMonth - 1 && orderYear === (currentMonth === 0 ? currentYear - 1 : currentYear);
        });

        const completedOrdersAll = orderData.filter((order) => {
            return order.isCompleted;
        });

        const completedOrdersSeller = orderData.filter((order) => {
            return order.isCompleted && order.sellerId == currentUser._id;
        });
      
        const totalEarningsLastMonth = completedOrdersLastMonth.reduce((total, order) => total + order.price, 0);
        
        ordersCompleted = completedOrdersAll.length;
        totalEarnings = completedOrdersSeller.reduce((total, order) => total + order.price, 0);;
    

        ordersChange = ((completedOrdersThisMonth.length - completedOrdersLastMonth.length) / completedOrdersLastMonth.length) * 100;
        earningsChange = ((totalEarningsThisMonth - totalEarningsLastMonth) / totalEarningsLastMonth) * 100;

    }

    if (orderData) {
        const barterOrdersThisMonth = orderData.filter((order) => {
            const orderMonth = moment(order.createdAt).month();
            const orderYear = moment(order.createdAt).year();
    
            return order.type === "Barter" && (order.sellerId == currentUser._id || order.buyerId == currentUser._id) && orderMonth === currentMonth && orderYear === currentYear;
        });
    
        const barterOrdersLastMonth = orderData.filter((order) => {
            const orderMonth = moment(order.createdAt).month();
            const orderYear = moment(order.createdAt).year();
    
            return order.type === "Barter" && (order.sellerId == currentUser._id || order.buyerId == currentUser._id) && orderMonth === currentMonth - 1 && orderYear === (currentMonth === 0 ? currentYear - 1 : currentYear);
        });
    
        barterCompleted = barterOrdersThisMonth.length;
        barterChange = ((barterOrdersThisMonth.length - barterOrdersLastMonth.length) / barterOrdersLastMonth.length) * 100;
    }

    const fetchUser = async (id) => {
        const response = await newRequest.get(`/users/${id}`);
        return response.data.username;
    };

    const fetchSkill = async (id) => {
        const response = await newRequest.get(`/skills/single/${id}`);
        return response.data.title;
    };

    const handleDownload = async () => {
        const data = await Promise.all(orderData.map(async order => {
            const buyerName = await fetchUser(order.buyerId);
            const sellerName = await fetchUser(order.sellerId);
            const skillName = await fetchSkill(order.skillId1);
    
            return {
                id: order._id,
                buyerName: buyerName,
                sellerName: sellerName,
                skillName: skillName,
                paymentMethod: order.type !== 'Barter' ? 'Online Payment' : 'Barter',
                price: order.price.toFixed(2),
                orderDate: moment(order.createdAt).format('DD/MM/YYYY'),
            };
        }));
    
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');
    
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Buyer Name', key: 'buyerName', width: 32 },
            { header: 'Seller Name', key: 'sellerName', width: 32 },
            { header: 'Skill Name', key: 'skillName', width: 32 },
            { header: 'Payment Method', key: 'paymentMethod', width: 15 },
            { header: 'Price', key: 'price', width: 10 },
            { header: 'Order Date', key: 'orderDate', width: 15 },
        ];
    
        data.forEach((e, index) => {
            worksheet.addRow({
                id: e.id,
                buyerName: e.buyerName,
                sellerName: e.sellerName,
                skillName: e.skillName,
                paymentMethod: e.paymentMethod,
                price: e.price,
                orderDate: e.orderDate,
            });
    
            if (index === 0) {
                // Apply style to the header row
                ["A1", "B1", "C1", "D1", "E1", "F1", "G1"].forEach((key) => {
                    worksheet.getCell(key).fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFFFAA00' },
                    };
                    worksheet.getCell(key).font = {
                        bold: true,
                    };
                });
            }
        });
    
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'report.xlsx';
            a.click();
        });
    };

    const stats = [
        { title: 'Orders Completed', value: ordersCompleted, change: isFinite(ordersChange) ? ordersChange : 0 },
        { title: 'Total Earnings', value: `RM ${totalEarnings.toFixed(2)}`, change: isFinite(earningsChange) ? earningsChange : 0},
        { title: 'Barter Completed', value: barterCompleted, change: isFinite(barterChange) ? barterChange : 0 },
    ]

    let lastDelivery = "No deliveries yet";

    if (orderData) {
        const completedOrders = orderData.filter((order) => {
            return order.isCompleted && order.sellerId == currentUser._id;
        });

        if (completedOrders.length > 0) {
            completedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            lastDelivery = moment(completedOrders[0].createdAt).fromNow();
        }
    }
    
  return (
    <div className="dashboard">
        <div className="container">

        <div className="horizontalbar">
            <h1>Dashboard</h1>

            <div className="tab">
                <span className={activeTab === 'tab1' ? 'active' : ''} onClick={() => setActiveTab('tab1')}>Overview</span>
                <span className={activeTab === 'tab2' ? 'active' : ''} onClick={() => setActiveTab('tab2')}>Orders</span>
                <span className={activeTab === 'tab3' ? 'active' : ''} onClick={() => setActiveTab('tab3')}>Transaction</span>
                <span className={activeTab === 'tab4' ? 'active' : ''} onClick={() => setActiveTab('tab4')}>Barter Requests</span>
               
            </div>
            <hr />
        </div>

        <div className="content">

        {isLoadingUser ? ("Loading" ) : errorUser ? ("Something Went Wrong") : (<motion.div animate={{x:0 , opacity:1}} initial={{x:-40 , opacity:0}} transition={{ ease: "easeOut", duration: 0.7 }} className="left">

        <div className="leftuser">
            
            <div className="userdetails">
                <img src={dataUser.img || "/noavatar.png" } alt="" />
                <span>{dataUser.username}</span>
                {currentUser._id !== id && (
                <button>Contact Me</button>
                )}
            </div>
            <hr />
            <div className="infobox">
                <div className="items">
       
                <div className="item">
                    <span className="title"><FaUser />&nbsp;&nbsp;&nbsp;&nbsp;User Rating</span>
                    <span className="desc">{!isNaN(dataUser.totalStars/dataUser.starNumber) && (dataUser.totalStars/dataUser.starNumber).toFixed(2) || "0.0"}/5.0</span>
                </div>
                <div className="item">
                    <span className="title"><IoTimeOutline />&nbsp;&nbsp;&nbsp;&nbsp;Response Time</span>
                    <span className="desc">1 hour</span>
                </div>

                <div className="item">
                    <span className="title"><IoIosSend />&nbsp;&nbsp;&nbsp;&nbsp;Last Delivery</span>
                    <span className="desc">{lastDelivery}</span>
                </div>
                </div>

            </div>
            

            </div> 

            <div className="leftdesc">
            <span className="title">Earned in {moment().format('MMMM')}</span>
            <span className="desc">RM {(totalEarningsThisMonth.toFixed(2))}</span>
            </div>


            </motion.div>)}

            <div className="right">
                {activeTab === 'tab2' && (
                <>
                <div className="rightheader">
                    <span>Orders</span>
                </div>

                <div className="rightcard">
                {orderData?.length === 0 
                    ? <img className="no-order" src="./no-order-transparent.png" alt="No orders" />
                    : orderData.slice().reverse().map((order) => (
                        <Ordercard key={order._id} order={order}/>
                    ))
                }
                                </div>
                </>
                )}
            
            {activeTab === 'tab1' && (
            <>      
            <div className="rightchart">
                <div className="chartheader">
                    <span>Sales</span>
                </div>
                <Chart orderData={orderData} />
            </div>

            <div className="rightstats">
                    {stats.map((item,index) =>(
                        <Statcard key={index} item={item}/>
                    ))}
                   
            </div>
            </>
            )}

            {activeTab === 'tab3' && (
                <>
               <div className="rightheader">
                    <span>Transaction History</span>
                </div>

                <div className="rightcard2">
                    {orderData?.length === 0
                    ? <img className="no-order" src="./no-transaction-transparent.png" alt="No orders" />
                    : orderData.slice().reverse().map((order) => (
                    <Transactioncard key={order._id} order={order}/>
                    ))}
                    <div className="download">
                        {orderData?.length === 0 ? <div className="empty"></div> : <button onClick={handleDownload}>Download </button>}
                    </div>
                </div>
                </>
            )}

            {activeTab === 'tab4' && (
                <>
                <div className="rightheader">
                    <span>Barter Requests</span>
                </div>

                <div className="rightcard">

                    {dataBarter?.length === 0 ?
                    <img className="no-order" src="./no-barter-request.png" alt="No orders" />
                    : dataBarter.slice().reverse().map((barter) => (
                    <Requestcard key={barter._id} barter={barter}/>
                    ))}
                </div>
                </>
            )}
                
            
            </div>

        </div>
        

        </div>
    </div>
  )
}

export default Dashboard