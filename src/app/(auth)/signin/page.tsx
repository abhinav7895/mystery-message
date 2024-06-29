"use client";

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axios, { AxiosError } from "axios";
import { ApiResponse } from '@/types/ApiResponse';
import { buttonVariants } from "@/components/ui/button"
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import { SignUpSchema } from '@/schemas/signUpSchema';
import { FiLoader } from "react-icons/fi";
import { Raleway } from 'next/font/google';
import Link from 'next/link';
import { SignInSchema } from '@/schemas/signInSchema';
const ralewayDots = Raleway({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"]
})

const Signin = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      identifier: "",
      password: ""
    }
  })


  const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
    setIsSubmit(true);
  }

  

  return (
    <div className='max-w-[400px] bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 py-6 px-3 sm:p-6 mt-[100px] rounded-xl  border border-neutral-800 '>
      <h1 className={'text-center text-2xl sm:text-3xl pb-2 text-neutral-200 ' + ralewayDots.className}>MysteryMessage</h1>
      <p className="text-center sm:text-base text-neutral-300">
        Sign in to ask questions <span className='bg-gradient-to-br from-red-950 via-red-800 to-red-900 py-[2px] px-1'>anonymously</span>
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-5">
        <FormField
            control={form.control}
            name="identifier"
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
      <p className='pt-5 text-neutral-500'>Don&apos;t have an account? <Link className='text-neutral-400' href="/signup">Sign up</Link></p>
    </div>
  )
}

export default Signin