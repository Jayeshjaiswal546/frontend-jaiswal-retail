"use client"
import React from 'react'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from 'input-otp'

export default function TestShadcnOtp() {
    const [value, setValue] = React.useState("")
    const hanldeSubmit = (event) => {
        event.preventDefault();
        console.log(value);
    }

    return (
        <div>This is the test page
            <form className='flex flex-col gap-[20px] justify-center items-center' onSubmit={hanldeSubmit}>
                <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} value={value} onChange={(value) => setValue(value)}>
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
                <button className='bg-blue-500 py-[5px] w-[120px] text-white' >Veify Otp</button>
            </form>

        </div>

    )
}
