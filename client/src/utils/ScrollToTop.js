// ScrollToTop.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ScrollToTop({ router }) {
  useEffect(() => {
    return router.listen(() => {
      window.scrollTo(0, 0);
    });
  }, [router]);

  return null;
}

export default ScrollToTop;