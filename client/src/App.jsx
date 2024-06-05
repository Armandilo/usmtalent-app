import Navbar from "./components/navbar/Navbar";
import Home from "./pages/home/Home";
import Footer from "./components/footer/Footer";
import React, { useEffect, useState } from "react";
import Skills from "./pages/skills/Skills";
import Orders from "./pages/orders/Orders";
import MySkill from "./pages/mySkills/MySkill";
import Messages from "./pages/messages/Messages";
import AddSkills from "./pages/addSkills/AddSkills";
import EditSkills from "./pages/editSkills/EditSkills";
import Message from "./pages/message/Message";
import Skill from "./pages/skill/Skill";
import UserProfile from "./pages/userProfile/UserProfile";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard.jsx";

import "./app.scss";
import { PopupProvider } from "./components/popupcontext/PopupContext.jsx";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLocation
} from "react-router-dom";
import Profile from "./pages/userProfile/UserProfile";
import Popup from "./components/popup/Popup";
import Register from "./pages/register/Register.jsx";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import Payment from "./pages/payment/Payment.jsx";
import Success from "./pages/success/Success.jsx";
import Chat from "./pages/chat/Chat.jsx";
import ScrollToTop from "./utils/ScrollToTop.js";
import Barter from "./pages/barter/Barter.jsx";
import Paymentmethod from "./pages/paymentmethod/Paymentmethod.jsx";
import Order from "./pages/order/Order.jsx";
import Ordertest from "./pages/orderTest/Ordertest.jsx";
import Paymentbarter from "./pages/paymentBarter/Paymentbarter.jsx";
import Faq from "./pages/barterinfo/Faq.jsx";







/* Main App component : basically like index.js file */
function App() {





  const queryClient = new QueryClient();  

  const [isPopupOpen, setPopupOpen] = useState(false);

  const handleLoginClick = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };



  

  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}>
      <PopupProvider>
      <div className="app">
        
        <Navbar/>
        <Outlet/>
        <Footer />
        
      </div>
      </PopupProvider>
      </QueryClientProvider>
    );
  };

  {/* Router for navigation and layout */}
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout/>,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/skills",
          element: <Skills />,
        },
        {
          path: "/profile/:id",
          element: <UserProfile />,
        },
        {
          path: "/skill/:id",
          element: <Skill />,
        },
        {
          path: "/orders",
          element: <Orders/>,
        },
        {
          path: "/mySkills",
          element: <MySkill />,
        },
        {
          path: "/messages",
          element: <Messages />,
        },
        {
          path: "/addSkills",
          element: <AddSkills />,
        },
        {
          path: "/editSkills/:id",
          element: <EditSkills />,
        },
        {
          path: "/message/:id",
          element: <Message />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/payment/:id",
          element: <Payment />,
        },
        {
          path: "/payment/:id/:selectedDate",
          element: <Payment />,
        },
        {
          path: "/paymentbarter/:id",
          element: <Paymentbarter/>
        },
        {
          path: "/success",
          element: <Success />,
        },
        {
          path: "/chat",
          element: <Chat />,
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/barter/:id",
          element: <Barter />,
        },
        {
          path: "/paymentmethod",
          element: <Paymentmethod />,
        },
        {
          path: "/order/:id",
          element: <Order />,
        },
        {
          path: "/orderTest",
          element: <Ordertest/>,
        },
        {
          path: "/faq",
          element: <Faq/>,
        },
        
       
      ]
    },
  ]);


  return (
    <div>
      <RouterProvider router={router}>
        <ScrollToTop router={router}/>
       </RouterProvider>

    </div>
    
  )
}

export default App

