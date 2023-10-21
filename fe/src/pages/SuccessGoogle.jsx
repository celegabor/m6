import React, { useEffect } from 'react';
import { useLocation, useParams, Navigate } from 'react-router-dom';

function SuccessGoogle() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get('code');

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
// const { code } = useParams();

// console.log(code);

// useEffect(() => {
//   localStorage.setItem('loggedInUser', JSON.stringify(code));
// }, [code]);

// return <Navigate to="/home" replace={true} />;
// }

export default SuccessGoogle;