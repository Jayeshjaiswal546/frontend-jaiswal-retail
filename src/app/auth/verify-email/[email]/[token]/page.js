"use client"
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaCheck } from "react-icons/fa";
import { ProgressSpinner } from 'primereact/progressspinner';
import { backendBaseUrl } from '@/app/api/api';
import axios from 'axios';
import Link from 'next/link';
import { CircularProgress } from '@mui/material';


export default function page() {
    const params = useParams();
    const email = decodeURIComponent(params.email);
    const token = params.token;
    let [isVerified, setVerifed] = useState(false);
    let [clicked, setClicked] = useState(false);


    useEffect(() => {
        console.log(email);
        console.log(token);
        let tempObj = { email, token };
        axios.post(`${backendBaseUrl}/user/verify-email`, tempObj)
            .then(res => res.data)
            .then(finalRes => {
                console.log(finalRes);
                if (finalRes.status) {
                    if (finalRes.message == 'Email already verified') {
                        setVerifed("AlreadyVerified");
                        console.log(isVerified)
                    } else if (finalRes.message == 'Email verified successfully') {
                        setVerifed("EmailVerified");
                    } else if (finalRes.message == 'Invalid Token') {
                        setVerifed("InvalidToken");
                    }
                } else {
                    console.log(finalRes.message);
                }
            })
    }, [])

    return (
        <div className='bg-green-100'>
            <div className='mx-auto max-w-[1460px]' >
                <div className='h-[100vh] flex items-center justify-center bg-green-100'>
                    {!isVerified ?
                        <CircularProgress size='30px' />

                        :
                        isVerified == "EmailVerified" ?
                            <div className='flex flex-col justify-center items-center gap-[10px]'>
                                <div className='border-4 border-green-500 rounded-full w-[100px] h-[100px] mb-[20px] flex justify-center items-center'>
                                    <FaCheck className='text-green-500 text-[40px]' />
                                </div>
                                <p className='text-[25px]'>Email Verified</p>
                                <p className='text-gray-500'>Your email address was successfully verified.</p>
                                <Link href="/auth/login">
                                    <button onClick={() => setClicked(true)} className='bg-blue-400 text-white py-[5px] w-[120px] flex justify-center items-center gap-[10px]'>
                                        {
                                            clicked ?
                                                <CircularProgress size='23px' color='white' />
                                                :
                                                'Go to Login'

                                        }
                                    </button>
                                </Link>
                            </div>
                            :
                            isVerified == "AlreadyVerified" ?
                                <p>Email already verified</p>
                                :
                                <p>Invalid Token</p>

                    }
                </div>
            </div>
        </div>
    )
}

