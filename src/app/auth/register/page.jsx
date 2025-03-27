"use client"
import { backendBaseUrl } from '@/app/api/api';
import { handleGoogleSignup } from '@/app/functions/googleAuth';
import { error } from '@/app/functions/notifyUser';
import { showSpinner } from '@/app/functions/respondToUser';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';


// const provider = new GoogleAuthProvider();

export default function Register() {
  const router = useRouter()
  let [isRegisterBtnClicked, setRegisterBtnClicked] = useState(false);
  // const auth = getAuth(app);



  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Register button clicked");
    setRegisterBtnClicked(true);

    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;

    if (password != confirmPassword) {
      console.log("Passwords does not match");
      toast.error("Passwords does not match");
      setRegisterBtnClicked(false);
    } else {
      toast.dismiss();
      setRegisterBtnClicked(true);
      const formData = new FormData(event.target);
      const formDataObject = {};
      formData.forEach((value, key) => formDataObject[key] = value);

      console.log(formDataObject);
      axios.post(`${backendBaseUrl}/user/register`, formDataObject)
        .then(res => res.data)
        .then(finalRes => {
          console.log(finalRes);
          if (finalRes.status) {
            router.push(`/auth/please-verify-email/${encodeURIComponent(formDataObject.email)}`);
          } else {
            error(toast, <div><h1>{finalRes.message}</h1><h2><b>Please try login instead</b></h2></div>)
            setRegisterBtnClicked(false);
          }
        })
        .catch((error) => {
          console.log("Something xrong with axios");
          error(toast,finalRes.message);
          setRegisterBtnClicked(false);
        })
    }

  }


  return (
    <div>
      <div className='mx-auto max-w-[1460px]'>
        <ToastContainer />
        <form onSubmit={handleSubmit} className='flex flex-col shadow-lg w-[400px] mx-auto mt-[100px] p-[30px] gap-[10px]'>
          <h3 className='font-bold text-[20px]'>Register</h3>
          <label className='flex flex-col'>
            Name
            <input className='outline-none border-2 border-gray-400 px-[10px] py-[4px]' type='text' name='name' required />
          </label>
          <label className='flex flex-col'>
            Email
            <input className='outline-none border-2 border-gray-400 px-[10px] py-[4px]' type='email' name='email' autoComplete='username' required />
          </label>
          <label className='flex flex-col'>
            Phone
            <input className='outline-none border-2 border-gray-400 px-[10px] py-[4px]' type='text' title="Enter a 10-digit phone number" name='phone' pattern="^[0-9]{10}$" required />
          </label>
          <label className='flex flex-col'>
            Password
            <input className='outline-none border-2 border-gray-400 px-[10px] py-[4px]' type='password' name='password' autoComplete='new-password' required />
          </label>
          <label className='flex flex-col'>
            Confirm password
            <input className='outline-none border-2 border-gray-400 px-[10px] py-[4px]' type='password' name='confirmPassword' autoComplete='new-password' required />
          </label>
          <button className='bg-blue-500 py-[5px] text-white'>
            {showSpinner(isRegisterBtnClicked, "Register")}
          </button>
          <hr />
          <button onClick={() => handleGoogleSignup(toast)} type='button' className='border-2 py-[5px] flex justify-center items-center gap-[10px]'>
            <img className='w-[25px] h-[25px]' src='/images/google-logo2.png' />
            Signup with google
          </button>
          <h2 className='text-[13px]'>Already have account?
            <Link href="/auth/login">
              <span className='text-blue-500'> Login</span>
            </Link>
          </h2>


        </form>
      </div>
    </div>
  )
}

