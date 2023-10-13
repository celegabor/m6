import React,{ useState } from 'react'
import './login.css'

function Login() {

    const [loginData, setLoginData] = useState({})
    const [login, setLogin] = useState(null)

    const handleInputChange = (e) =>{
        const {name, value} = e.target;

        setLoginData({
            ...loginData,
            [name]: value
        })
    }

    const onSubmit = async(e)=>{
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/login`,{
                headers:{
                    "Content-Type": "application/json"
                },
                method: 'POST',
                body: JSON.stringify(loginData)
            })
            const data = await response.json()

            if(data.token){
                localStorage.setItem('loggedInUser', JSON.stringify(data.token))
            }

            setLogin(data)
            
        } catch (e) {
            console.log(e);
        }
    }

  return (
    <>
        <div className="div-form-login">
            <form className='form-login' onSubmit={onSubmit}>
                <label className='label-login' htmlFor="email">email</label>
                <input className='input-login' 
                type="email" 
                name='email' 
                required
                onChange={handleInputChange}
                 />
                <label className='label-login' htmlFor="password">password</label>
                <input className='input-login' 
                type="password" 
                name='password' 
                required
                onChange={handleInputChange}
                />

                <button className='button-login'>accedi</button>
            </form>
        
        </div>    
    </>

  )
}

export default Login