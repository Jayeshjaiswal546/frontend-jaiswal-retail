"use client"
import { useParams } from 'next/navigation';
import React from 'react'
import { MdEmail } from "react-icons/md";


export default function PleaseVerifyEmail() {
    let param = useParams();
    console.log(param);
    return (
        <div className='bg-blue-100'>
            <div className='mx-auto max-w-[1460px]'>
                <div className='h-[100vh] bg-blue-100 flex justify-center items-center'>
                    <div className='flex flex-col justify-center items-center gap-[10px] '>
                        <div className='w-[100px] h-[100px] rounded-full bg-blue-200 flex justify-center items-center'>
                            <MdEmail className='text-blue-500 text-[60px]' />
                        </div>
                        <p className='font-bold text-[30px] my-[10px]'>Please verify your email</p>
                        <p>You're almost there! We sent an email to</p>
                        <p className='font-bold'>{decodeURIComponent(param.email)}</p>
                        {/* <p className='font-bold'>{param.email}</p> */}

                        <p>Just click on link in the email to complete your signup. If you don't</p>
                        <p>see it, you may need to check your spam folder.</p>
                        <p className='my-[20px] text-gray-500'>Still can't find the email? No problem.</p>
                        <button className='bg-blue-500 py-[5px] rounded px-[30px] text-white'>Resend Verification Email</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
