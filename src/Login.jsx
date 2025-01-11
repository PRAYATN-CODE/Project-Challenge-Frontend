import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from './config/axiosConfig';

// Login Form Component
const LoginForm = ({ setIsLogin, setLoginEmail, setLoginPassword, handleLoginSubmit }) => {
    return (
        <div className="bg-gray-800 text-white rounded-2xl shadow-xl flex flex-col w-full items-center max-w-lg p-6 transition-all duration-500 ease-in-out hover:shadow-2xl">
            <h2 className="p-3 text-4xl font-extrabold text-white">Welcome Back!</h2>
            <div className="inline-block border-[1px] w-20 border-gray-400 mb-4"></div>
            <h3 className="text-2xl font-semibold text-gray-300 pt-2">Sign In to Continue</h3>

            {/* Inputs */}
            <div className="flex flex-col items-center justify-center w-full mt-4 space-y-4">
                <input
                    type="email"
                    className="rounded-2xl px-4 py-2 w-4/5 md:w-full border-[1px] bg-gray-600 border-gray-500 focus:outline-none focus:border-blue-400 transition duration-300"
                    placeholder="Email"
                    onChange={(e) => setLoginEmail(e.target.value)}
                />
                <input
                    type="password"
                    className="rounded-2xl px-4 py-2 w-4/5 md:w-full border-[1px] bg-gray-600 border-gray-500 focus:outline-none focus:border-blue-400 transition duration-300"
                    placeholder="Password"
                    onChange={(e) => setLoginPassword(e.target.value)}
                />
                <button
                    className="rounded-2xl text-black bg-white w-4/5 md:w-2/5 px-4 py-2 shadow-lg hover:text-white hover:bg-blue-400 hover:border-blue-400 hover:shadow-xl transition duration-300 ease-in"
                    onClick={handleLoginSubmit}
                >
                    Sign In
                </button>
            </div>

            <div className="inline-block border-[1px] w-20 border-gray-500 mt-4"></div>
            <p className="text-gray-300 mt-2 text-sm cursor-pointer hover:text-blue-400">
                Don't have an account?
            </p>
            <p
                className="text-gray-300 mb-4 text-sm font-medium cursor-pointer hover:text-blue-400"
                onClick={() => setIsLogin(false)}
            >
                Create a New Account
            </p>
        </div>
    );
};

// Sign Up Form Component
const SignUpForm = ({ setIsLogin, setRegisterName, setRegisterEmail, setRegisterPassword, setRegisterDob, handleSignUpSubmit }) => {
    return (
        <div className="bg-gray-800 text-white rounded-2xl shadow-xl flex flex-col w-full items-center max-w-lg p-6 transition-all duration-500 ease-in-out hover:shadow-2xl">
            <h2 className="p-3 text-3xl font-bold text-white">Welcome</h2>
            <div className="inline-block border-[1px] justify-center w-20 border-white mb-4"></div>
            <h3 className="text-xl font-semibold text-white pt-2">Create Account!</h3>

            <div className="flex flex-col items-center justify-center mt-6 w-full max-w-md mx-auto">
                <div className="relative mb-6 w-full">
                    <input
                        type="text"
                        id="name"
                        className="rounded-2xl px-4 py-2 w-full border-[1px] bg-gray-600 border-gray-500 focus:outline-none focus:border-blue-400 transition duration-300"
                        placeholder="Name"
                        onChange={(e) => setRegisterName(e.target.value)}
                    />
                </div>

                <div className="relative mb-6 w-full">
                    <input
                        type="email"
                        id="email"
                        className="rounded-2xl px-4 py-2 w-full border-[1px] bg-gray-600 border-gray-500 focus:outline-none focus:border-blue-400 transition duration-300"
                        placeholder="Email"
                        onChange={(e) => setRegisterEmail(e.target.value)}
                    />
                </div>

                <div className="relative mb-6 w-full">
                    <input
                        type="password"
                        id="password"
                        className="rounded-2xl px-4 py-2 w-full border-[1px] bg-gray-600 border-gray-500 focus:outline-none focus:border-blue-400 transition duration-300"
                        placeholder="Password"
                        onChange={(e) => setRegisterPassword(e.target.value)}
                    />
                </div>



                <button
                    className="rounded-2xl m-4 text-black bg-white w-full sm:w-3/5 px-4 py-2 shadow-md hover:text-white hover:bg-blue-400 transition duration-200 ease-in"
                    onClick={handleSignUpSubmit}
                >
                    Sign Up
                </button>
            </div>

            <div className="inline-block border-[1px] justify-center w-20 border-white mb-4"></div>
            <p className="text-white mt-4 text-sm cursor-pointer hover:text-blue-400">
                Already have an account?
            </p>
            <p
                className="text-white mb-4 text-sm font-medium cursor-pointer hover:text-blue-400"
                onClick={() => setIsLogin(true)}
            >
                Sign In to your Account
            </p>
        </div>
    );
};

// Main Login Component
const Login = () => {
    const [isLogin, setIsLogin] = useState(true);

    // Login form states
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // SignUp form states
    const [registerName, setRegisterName] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const navigate = useNavigate()

    const handleLoginSubmit = async () => {
        try {
            const response = await axios.post('/auth/loginuser', {
                email: loginEmail,
                password: loginPassword,
            });
            localStorage.setItem('token', response.data.Authtoken)
            navigate('/dashboard')
            toast.success('Logged In Successfully')
        } catch (error) {
            console.error('Login Error:', error);
        }
    };
    
    // Handle SignUp Submit
    const handleSignUpSubmit = async () => {
        try {
            const response = await axios.post('/auth/createuser', {
                name: registerName,
                email: registerEmail,
                password: registerPassword,
            });
            localStorage.setItem('token', response.data.Authtoken)
            navigate('/dashboard')
            toast.success('Sign In Successfully')
        } catch (error) {
            console.error('SignUp Error:', error);
        }
    };

    return (
        <div className="bg-gray-900 flex flex-col items-center justify-center min-h-screen md:py-10 px-4">
            <main className="flex items-center justify-center w-full px-2 md:px-20">
                <div className="flex flex-col items-center w-full space-y-6">
                    {isLogin ? (
                        <LoginForm
                            setIsLogin={setIsLogin}
                            setLoginEmail={setLoginEmail}
                            setLoginPassword={setLoginPassword}
                            handleLoginSubmit={handleLoginSubmit}
                        />
                    ) : (
                        <SignUpForm
                            setIsLogin={setIsLogin}
                            setRegisterName={setRegisterName}
                            setRegisterEmail={setRegisterEmail}
                            setRegisterPassword={setRegisterPassword}
                            handleSignUpSubmit={handleSignUpSubmit}
                        />
                    )}
                </div>
            </main>
        </div>
    );
};

export default Login;
