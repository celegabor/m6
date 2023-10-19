import React, { useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';

function SuccessGoogle() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get('callback?code');

  useEffect(() => {
    console.log('Query string:', location.search);
    if (code) {
      console.log('Code:', code);
      localStorage.setItem('loggedInUser', JSON.stringify(code));
      Navigate('/home', { replace: true });
    }
  }, [code, location.search]);
  

  return <div>Attendi...</div>;
}

export default SuccessGoogle;