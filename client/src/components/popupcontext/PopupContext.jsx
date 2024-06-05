// PopupContext.js
import React, { createContext, useState, useContext } from 'react';
import Popup from '../popup/Popup';

import { AnimatePresence } from 'framer-motion';

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [content, setContent] = useState(null);
  const handlePopupOpen = (content) => {
    setContent(content);
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  return (
    <PopupContext.Provider value={{ isPopupOpen, handlePopupOpen, handleClosePopup }}>
      <AnimatePresence mode='wait'> 
      {isPopupOpen && (
      <Popup trigger={isPopupOpen} onClose={handleClosePopup}>
        {content}
      </Popup>
      )}
      </AnimatePresence>
      {children}
    </PopupContext.Provider>
  );
};

export const usePopup = () => useContext(PopupContext);
