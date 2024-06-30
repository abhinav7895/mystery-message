"use client";

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useDebounceCallback, useDebounceValue } from "usehooks-ts";
import axios, { AxiosError } from "axios";
import { ApiResponse } from '@/types/ApiResponse';
import { buttonVariants } from "@/components/ui/button"
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import { SignUpSchema } from '@/schemas/signUpSchema';
import { FiLoader } from "react-icons/fi";
import { Raleway } from 'next/font/google';
import Link from 'next/link';
const ralewayDots = Raleway({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"]
})

const Signup = () => {
  const [userName, setUsername] = useState("");
  const debounced = useDebounceCallback(setUsername, 300);
  const [isUsernameChecking, setIsUsernameChecking] = useState(false);
  const [userNameMessage, setUserNameMessage] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: ""
    }
  })


  const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
    if (!userNameMessage.includes("unique")) {
      return;
    }

    setIsSubmit(true);
    try {
      const response = await axios.post<ApiResponse>("/api/signup", data);
      console.log(response);
      router.replace(`/verify/${userName}`)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? "Failed to signup, try again")
    } finally {
      setIsSubmit(false);
    }
  }

  useEffect(
    () => {
      const checkUserNameUnique = async () => {
        setIsUsernameChecking(true);
        try {
          if (!userName) {
            return;
          }
          const response = await axios.get<ApiResponse>(`/api/check-username-unique?username=${userName}`);
          console.log(response);
          setUserNameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          console.log(axiosError);
          setUserNameMessage(axiosError.response?.data.message ?? "Error while checking the username");
        } finally {
          setIsUsernameChecking(false);
        }
      }
      checkUserNameUnique();
    }
    , [userName]);

  return (
    <div className='max-w-[440px] w-full bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 py-6 px-3 sm:p-6 mt-[100px] rounded-xl  border border-neutral-800 '>
      <h1 className={'text-center text-2xl sm:text-3xl pb-2 text-neutral-200 ' + ralewayDots.className}>ShadowChat</h1>
      <p className="text-center sm:text-base text-neutral-300">
        Sign up to share <span className='bg-gradient-to-br from-red-950 via-red-800 to-red-900 py-[2px] px-1'>anonymous</span> feedback.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-5">
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem className='relative'>
                <FormLabel className='text-neutral-300 text-lg'>Username</FormLabel>
                <FormControl>
                  <Input className=' placeholder:text-neutral-500 bg-neutral-800 border text-neutral-300 border-neutral-700  focus-visible:ring-neutral-400  text-base ' placeholder=""
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                  />
                </FormControl>

                <FormMessage className='text-red-900' />
                {
                  isUsernameChecking && <FiLoader className='animate-spin text-neutral-500 text-lg absolute right-2 top-[37px] ' />
                }
                {(userNameMessage.length > 0) && (userName.length > 0) && <p className={`${userNameMessage.includes("unique") ? "text-green-700" : "text-red-700"} text-xs`}>{userNameMessage}</p>}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className='relative'>
                <FormLabel className='text-neutral-300 text-lg'>Email</FormLabel>
                <FormControl>
                  <Input className=' placeholder:text-neutral-500 bg-neutral-800 border text-neutral-300 border-neutral-700  focus-visible:ring-neutral-400  text-base ' placeholder=""
                    {...field}
                  />
                </FormControl>

                <FormMessage className='text-red-900' />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className='relative'>
                <FormLabel className='text-neutral-300 text-lg'>Password</FormLabel>
                <FormControl>
                  <Input type='password' className=' placeholder:text-neutral-500 bg-neutral-800 border text-neutral-300 border-neutral-700  focus-visible:ring-neutral-400  text-base ' placeholder=""
                    {...field}
                  />
                </FormControl>

                <FormMessage className='text-red-900' />
              </FormItem>
            )}
          />
          <button disabled={isSubmit} className={buttonVariants({
            className: "bg-gradient-to-br from-red-950 via-red-800 to-red-900 border border-red-800 w-[80px]"
          })}>
            {isSubmit ? <FiLoader className='animate-spin text-xl' /> : "Signin"}
          </button>
        </form>
      </Form>
      <p className='pt-5 text-neutral-500'>Already have an account? <Link className='text-neutral-400' href="/signin">Signin</Link> </p>
    </div>
  )
}

export default Signup