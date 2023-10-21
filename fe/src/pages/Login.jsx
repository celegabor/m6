import React,{ useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './login.css'
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';


function Login() {

    const [loginData, setLoginData] = useState({})
    const [login, setLogin] = useState(null)
    const [error, setError] = useState(false)

    const navigate = useNavigate();

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
                setError(false)
                localStorage.setItem('loggedInUser', JSON.stringify(data.token));
                navigate('/home');
                console.log('vado a home');
            } else {
                setError(true)
            }

            setLogin(data)
            
        } catch (e) {
            console.log(e);
        }
    }

    const redirectHandlerGitHub = ()=>{
        window.location.href = `${process.env.REACT_APP_SERVER_BASE_URL}/auth/github`
    }
    const redirectHandlerGoogle = ()=>{
        window.location.href = `${process.env.REACT_APP_SERVER_BASE_URL}/auth/google`
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

                <button className='button-login' type="submit">accedi</button>

            </form>
            {error && <i className='error-custom'>..ops..password o email errate!!</i> }


                <Button onClick={()=>redirectHandlerGitHub()} className='custom-login bg-dark text-white'>
                    <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="logo gitHub" />
                    login with GitHub
                </Button>

                <Button onClick={()=>redirectHandlerGoogle()} className='custom-login bg-dark text-white'>
                    <img src="https://play-lh.googleusercontent.com/6UgEjh8Xuts4nwdWzTnWH8QtLuHqRMUB7dp24JYVE2xcYzq4HA8hFfcAbU-R-PC_9uA1=s94-rw" alt="logo google" />
                    login with Google 
                    <p className='text-danger'>non funziona login con google</p>
                </Button>

                
                <p className='w-100 text-center m-3'>oppure schiaccia qua per</p>

            <Link to={`/addUser`}>
                <p className='' variant="success"> aggiungere un nuovo UTENTE</p>
            </Link>
        
        </div>
    </>

  )
}

export default Login