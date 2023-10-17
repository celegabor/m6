import { useNavigate, Outlet } from "react-router-dom"
import jwtDecode from "jwt-decode"
import Login from "../pages/Login"
import { useEffect } from "react"
import { isAuth } from "../middlewares/ProtectedRoutes"

const useSession = ()=>{
    const session = isAuth();
    const decodedSession = session ? jwtDecode(session) : null;

    const navigate = useNavigate()

    const checkTokenExpirationTime = ()=>{
        if(session.exp){
            const convertUnixDateToMillisecond = decodedSession.exp * 1000
            const expirationDate = new Date(convertUnixDateToMillisecond)
            const currentDate = new Date()
    
            if(expirationDate < currentDate) {
                localStorage.clear()
                console.log('clear token');
            }
        }
    }

    useEffect(()=>{

        if(!session){
            navigate('/', {replace: true});
        }

        checkTokenExpirationTime();

    },[navigate, session])

    return decodedSession;

}

export default useSession;

// const useSession = () => {
//     const session = isAuth();
//     const decodedSession = session ? jwtDecode(session) : null;
  
//     const navigate = useNavigate();
  
//     const checkTokenExpirationTime = () => {
//       if (session && session.exp) {
//         const convertUnixDateToMillisecond = decodedSession.exp * 1000;
//         const expirationDate = new Date(convertUnixDateToMillisecond);
//         const currentDate = new Date();
  
//         if (expirationDate < currentDate) {
//           // Invalid session
//           return null;
//         }
//       }
  
//       return decodedSession;
//     };
  
//     useEffect(() => {
//       if (!session) {
//         navigate('/', { replace: true });
//       }
  
//       const updatedSession = checkTokenExpirationTime();
  
//       if (!updatedSession) {
//         // Session is invalid, notify the calling component or clear state
//         // depending on your needs.
//         // For example, you can call a callback to handle session invalidation.
//       }
//     }, [navigate, session]);
  
//     return decodedSession;
//   };
  
//   export default useSession;
  