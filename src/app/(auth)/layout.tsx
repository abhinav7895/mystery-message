import React, { ReactNode } from 'react'

const Auth = ({children} : {children : ReactNode}) => {
  return (
    <div className=' flex justify-center p-2 items-center bg-neutral-950'>
        {children}
    </div>
  )
}

export default Auth