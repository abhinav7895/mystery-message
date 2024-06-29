"use client"

import { buttonVariants } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp'
import React, { useEffect, useRef, useState } from 'react'
import { FiLoader } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/ApiResponse'

const Verify = ({ params }: { params: { username: string } }) => {

    const [isVerifying, setIsVerifying] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const verifyCode = useRef<null | string>(null);
    const router = useRouter();
    const { username } = params;

    const handleCodeValidation = (code: string) => {
        if (code.length === 6) {
            setIsValid(true);
            verifyCode.current = code;
            return;
        }
        verifyCode.current = null;
        setIsValid(false);
    }

    const handleVerification = async () => {
        if (verifyCode && !verifyCode.current) {
            return;
        }
        console.log(verifyCode.current);

        setIsVerifying(true);
        try {
            const response = await axios.post<ApiResponse>("/api/verify-code", {
                username, verifyCode : verifyCode.current
            })
            toast.success(response.data.message);
            router.replace("/signin");
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message ?? "Failed to verify your account")
        } finally {
            setIsVerifying(false);
        }
    }

    useEffect(() => {

        const handleKeyPress = (event: KeyboardEvent) => {

            if (event.key === 'Enter') {
                handleVerification();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };

    }, []);

    return (
        <div className='max-w-[400px] bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 py-6 px-3 sm:p-6 mt-[100px] rounded-xl  border border-neutral-800  '>
            <h1 className='text-3xl text-center text-neutral-200'>Verify your account</h1>
            <p className=' text-neutral-300 text-center pt-3 pb-9  '>Enter the  <span className='bg-gradient-to-br from-red-950 via-red-800 to-red-900 py-[1px] px-1'>verification code</span> sent to your email</p>
            <div className='w-full flex gap-7 flex-col  items-center '>
                <InputOTP onSubmit={() => console.log("Submit")} onChange={handleCodeValidation} maxLength={6}>
                    <InputOTPGroup className=' text-white'>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator className='text-white' />
                    <InputOTPGroup className=' text-white '>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
                <button disabled={!isValid} onClick={handleVerification} className={buttonVariants({
                    className: "bg-gradient-to-br from-red-950 via-red-800 to-red-900 border border-red-800 w-[80px] "
                })}>
                    {isVerifying ? <FiLoader className='animate-spin text-xl' /> : "Verify"}
                </button>
            </div>
        </div>
    )
}

export default Verify