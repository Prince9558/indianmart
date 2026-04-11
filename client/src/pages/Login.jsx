import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, googleLogin, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await googleLogin(tokenResponse.access_token);
        toast.success('Logged in successfully with Google');
      } catch (error) {
        toast.error(error.response?.data?.error || 'Google login failed');
      }
    },
    onError: () => {
      toast.error('Google login failed');
    }
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Logged in successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to login');
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="flex w-full max-w-4xl bg-white shadow-lg overflow-hidden h-[500px]">
        <div className="hidden md:flex flex-col w-2/5 bg-primary p-10 text-white justify-between">
          <div>
            <h1 className="text-3xl font-medium mb-4">Login</h1>
            <p className="text-gray-200 text-lg">Get access to your Orders, Wishlist and Recommendations</p>
          </div>
          <div>
            <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png" alt="Login" />
          </div>
        </div>
        
        <div className="w-full md:w-3/5 p-10 flex flex-col justify-center">
          <form onSubmit={submitHandler} className="space-y-6">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-primary peer transition-colors bg-transparent placeholder-transparent"
                placeholder="Enter Email"
                id="email"
              />
              <label htmlFor="email" className="absolute left-0 top-2 text-gray-500 cursor-text transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-primary peer-valid:-top-4 peer-valid:text-xs peer-valid:text-gray-500">
                Enter Email/Mobile number
              </label>
            </div>
            
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-primary peer transition-colors bg-transparent placeholder-transparent"
                placeholder="Enter Password"
                id="password"
              />
              <label htmlFor="password" className="absolute left-0 top-2 text-gray-500 cursor-text transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-primary peer-valid:-top-4 peer-valid:text-xs peer-valid:text-gray-500">
                Enter Password
              </label>
            </div>
            
            <p className="text-xs text-gray-500 mt-6">
              By continuing, you agree to IndianMart's <span className="text-primary cursor-pointer">Terms of Use</span> and <span className="text-primary cursor-pointer">Privacy Policy</span>.
            </p>
            
            <button type="submit" className="w-full bg-secondary text-white py-3 font-bold rounded-sm shadow-md hover:bg-yellow-600 transition">
              Login
            </button>
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <button
              type="button"
              onClick={() => loginWithGoogle()}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-3 font-medium rounded-sm shadow-sm hover:bg-gray-50 transition"
            >
              <FcGoogle className="text-xl" />
              Sign in with Google
            </button>
          </form>
          
          <div className="mt-auto pt-6 text-center text-primary font-medium cursor-pointer">
            <Link to="/register">New to IndianMart? Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
