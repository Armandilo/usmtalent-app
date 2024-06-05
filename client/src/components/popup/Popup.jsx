import React from 'react'
import './Popup.scss'
import ReactDom from 'react-dom'
import { useEffect } from 'react';
import { motion } from 'framer-motion';

function Popup({trigger,children,onClose}) {
  const popupRef = React.useRef();

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if(popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };

    if(trigger) {
      // Only add the event listener and disable scrolling when the popup is open
      document.addEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);

      // Only re-enable scrolling when the popup is closed
        document.body.style.overflow = 'unset';
      
    };
  }, [onClose, trigger]); // Add trigger to the dependency array

  if(!trigger) return null;

  return(
    <div className='popup'>
      <div className="popup-background" onClick={onClose}></div>
        <motion.div animate={{y:0, opacity:1}} initial={{y:-30 , opacity:0}} exit={{y:0, opacity:0}} transition={{ ease: "easeOut", duration: 0.5 }} className='popup-inner' ref={popupRef}>
            {children}
        </motion.div>
    </div>
    
  );
}

export default Popup