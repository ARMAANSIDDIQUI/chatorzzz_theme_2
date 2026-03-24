import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function AutoScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Instantly scroll to top when path changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
}
