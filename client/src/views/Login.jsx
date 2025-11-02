import { Link } from 'react-router';
import { useState } from 'react';
import axios from 'axios';
function Login() {

const [user, setUser] = useState({
    email: "",
    password: ""
});

const loginUser = async () => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, user);
  if(response?.data?.success){
    localStorage.setItem("loggedInUser",JSON.stringify(response.data.user));
  window.location.href="/";
  }   
  console.log(response.data)};


  return (
          <div className='max-w-[400px] mx-auto borer-1 border-gray-500
        py-10 px-14 rounded'>
          <h1 className='text-center text-4xl my-4'>Login Page</h1>
          <div>
              <input type="email" placeholder='Email'
               className="border p-2 rounded w-full mb-4" 
               value={user.email}
               onChange={(e)=>{
             setUser({ ...user, email:e.target.value})
               }}/>
      
              <input type="password" placeholder='Password'
               className="border p-2 rounded w-full mb-4" 
               value={user.password}
                onChange={(e)=>{
             setUser({ ...user, password:e.target.value})
               }}/>
             
              <button className='bg-gray-700 text-white px-6 py-2 border-md'
               type='button'
               onClick={loginUser}>
                Login</button>
                <p>
                    Don't have an account? {""}
                    <Link to="/signup" className=" text-blue-500 underline" >
                    Sign up 
                    </Link>
                </p>
          </div>

          </div>
  )
}

export default Login
