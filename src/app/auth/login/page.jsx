"use client"
import { backendBaseUrl } from '@/app/api/api';
import { error, success } from '@/app/functions/notifyUser';
import axios from 'axios';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { CircularProgress } from '@mui/material';
import { showSpinner } from '@/app/functions/respondToUser';
import { addUserToken } from '@/app/redux/reducers/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { handleLoginWithGoogle } from '@/app/functions/googleAuth';
import { getAuth } from 'firebase/auth';
import { Apple } from 'lucide-react';
import { setCart } from '@/app/redux/reducers/cartSlice';




export default function Login() {
    let [otp, setOtp] = useState("");
    let [isLoginClicked, setLoginClicked] = useState(false);
    let [isVerifyOtpClicked, setVerifyOtpClicked] = useState(false);
    let [isLoginPasswordMatch, setLoginPasswordMatch] = useState(false);
    let [userEmail, setUserEmail] = useState("");
    let [count, setCount] = useState(0);
    let [redirectCount, setRedirectCount] = useState(0);
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector((state) => state.user.token);



    const hanldeSubmit = (event) => {
        event.preventDefault();

        try {

            console.log(event.nativeEvent.submitter.value);


            if (event.nativeEvent.submitter.value == "loginBtn") {
                console.log("Login btn clicked");
                setLoginClicked(true);
                const formData = new FormData(event.target);
                const formDataObject = {};
                formData.forEach((value, key) => formDataObject[key] = value);

                console.log(formDataObject);
                console.log(otp);
                axios.post(`${backendBaseUrl}/user/login`, formDataObject)
                    .then(res => res.data)
                    .then(finalRes => {
                        console.log(finalRes);

                        if (finalRes.status) {
                            success(toast, finalRes.message);
                            setUserEmail(formDataObject.email);
                            setLoginPasswordMatch(true);
                            setCount(120);

                        } else {
                            error(toast, finalRes.message);
                            setLoginClicked(false);
                            setLoginPasswordMatch(false);
                        }
                    })
            }

            if (event.nativeEvent.submitter.value == "verifyOtpBtn") {
                console.log("Verify otp btn clicked");
                setVerifyOtpClicked(true);
                console.log(otp);
                console.log(otp.length);
                axios.post(`${backendBaseUrl}/user/verify-login-otp`, { email: userEmail, otp })
                    .then(res => res.data)
                    .then(finalRes => {
                        console.log(finalRes);
                        if (finalRes.status) {
                            // success(toast, finalRes.message);
                            toast.success(<div><h1>{finalRes.message}</h1><h2><b>Welcome {finalRes.name}</b></h2></div>)
                            setCount(0);
                            setVerifyOtpClicked(false);
                            dispatch(addUserToken(finalRes.token));
                            dispatch(setCart(finalRes.cart));
                            localStorage.setItem('jaiswal-retail-userToken', JSON.stringify(finalRes.token));
                            localStorage.setItem('jaiswal-retail-userCart',JSON.stringify(finalRes.cart));
                            setRedirectCount(5);
                            setTimeout(() => {
                                router.replace('/');
                            }, 5000);
                        } else {
                            error(toast, finalRes.message);
                            setVerifyOtpClicked(false);
                        }
                    })

            }
        } catch (error) {
            error(toast, "Axios Error");
        }


    }
    useEffect(() => {
        if (count > 0) {
            const id = setInterval(() => {
                setCount(count => count - 1);
            }, 1000)
            return () => clearInterval(id);
        }
    }, [count])

    useEffect(() => {
        if (redirectCount > 0) {
            const id = setInterval(() => {
                setRedirectCount(redirectCount => redirectCount - 1);
            }, 1000)
            return () => clearInterval(id);
        }
    }, [redirectCount])


    let minutes = Math.floor(count / 60);
    let seconds = count - minutes * 60;

    let [isResendOtpClicked, setResendOtpClicked] = useState(false);


    let hanldeResendOtp = () => {
        console.log("Resend Otp btn clicked");
        setResendOtpClicked(true);
        axios.post(`${backendBaseUrl}/user/resend-login-otp`, { email: userEmail })
            .then(res => res.data)
            .then(finalRes => {
                console.log(finalRes);
                if (finalRes.status) {
                    success(toast, finalRes.message);
                    setResendOtpClicked(false);
                    setCount(5);
                } else {
                    error(toast, finalRes.message);
                    setResendOtpClicked(false);
                }
            })
    }

    return (
        <div>
            <div className='mx-auto max-w-[1460px]'>
                <ToastContainer />
                <form onSubmit={hanldeSubmit} className='flex flex-col shadow-lg w-[400px] mx-auto mt-[100px] p-[30px] gap-[20px]'>
                    <h3 className='font-bold text-[20px]'>Login</h3>
                    <label className='flex flex-col'>
                        Email
                        <input autoFocus className='outline-none border-2 border-gray-400 px-[10px] py-[4px]' type='email' name='email' autoComplete='username' required {...(isLoginPasswordMatch ? { readOnly: true } : {})} />
                    </label>
                    <label className='flex flex-col'>
                        Password
                        <input className='outline-none border-2 border-gray-400 px-[10px] py-[4px]' type='password' name='password' autoComplete='current-password' required  {...(isLoginPasswordMatch ? { readOnly: true } : {})} />
                        <h2 className='text-right text-[12px] text-blue-500'>Forgot password?</h2>
                    </label>

                    {/* veify otp btn view */}
                    <div className={`${!isLoginPasswordMatch ? "hidden" : ""} flex flex-col gap-[20px] justify-center items-center`}>
                        <div className='flex flex-col items-center justify-center'>
                            <h2>A 6 digit one-time-password has been sent to</h2>
                            <h3 className='font-bold'>{userEmail}</h3>
                        </div>
                        <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} value={otp} onChange={(otp) => setOtp(otp)} >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} className='border-2 border-gray-700 m-[4px]' />
                                <InputOTPSlot index={1} className='border-2 border-gray-700 m-[4px]' />
                                <InputOTPSlot index={2} className='border-2 border-gray-700 m-[4px]' />
                                <InputOTPSlot index={3} className='border-2 border-gray-700 m-[4px]' />
                                <InputOTPSlot index={4} className='border-2 border-gray-700 m-[4px]' />
                                <InputOTPSlot index={5} className='border-2 border-gray-700 m-[4px]' />
                            </InputOTPGroup>
                        </InputOTP>
                        <button type={`${isLoginPasswordMatch ? "submit" : "button"}`} value="verifyOtpBtn" className={`${otp.length == 6 ? (!user ? "bg-blue-500" : "bg-transparent") : "bg-gray-400"} py-[5px] w-[120px] ${!user ? "text-white" : "text-blue-500"}`} {...(otp.length != 6 || user ? { disabled: true } : {})} >
                            {showSpinner(isVerifyOtpClicked, `${!user ? "Veify Otp" : `Redirecting  in ${redirectCount}s`}`)}
                        </button>

                        <h2 className='text-[13px]'>
                            <button onClick={hanldeResendOtp} {...(count != 0 || user ? { disabled: true } : {})} type='button' className={`${count == 0 && !user ? "text-blue-500 text-[13.5px]" : ""}`}>

                                {showSpinner(isResendOtpClicked, "Resend")}

                            </button>
                            <span className={`${count == 0 ? "hidden" : ""}`}> in {minutes < 10 ? '0' + minutes : minutes}:{seconds < 10 ? '0' + seconds : seconds}</span></h2>
                    </div>

                    {/* login btn view */}
                    <div className={`${isLoginPasswordMatch ? "hidden" : ""} flex flex-col gap-[20px]`}>
                        <button type={`${!isLoginPasswordMatch ? "submit" : "button"}`} value="loginBtn" className='bg-blue-500 py-[5px] text-white'>
                            {
                                isLoginClicked ?
                                    <CircularProgress size='20px' color='white' />
                                    :
                                    "Login"
                            }


                        </button>
                        <hr />
                        <button onClick={() => handleLoginWithGoogle(toast, dispatch, router, setRedirectCount)} type='button' className={`${user ? "border-0" : "border-2"} py-[5px] flex justify-center items-center gap-[10px]`} {...(user ? { disabled: true } : {})}>
                            {
                                !user ?
                                    <div className='flex justify-center items-center gap-[10px]'><img className='w-[25px] h-[25px]' src='/images/google-logo2.png' />
                                        Login with google
                                    </div>
                                    :
                                    <h2 className='text-blue-500'>Redirecting in {redirectCount}s</h2>
                            }

                        </button>
                        <h2 className='text-[13px]'>Don't have account?
                            <Link href="/auth/register">
                                <span className='text-blue-500'> Register</span>
                            </Link>
                        </h2>
                    </div>

                </form>
            </div>
        </div>
    )
}


