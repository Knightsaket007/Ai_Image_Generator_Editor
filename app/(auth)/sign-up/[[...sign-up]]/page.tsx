import React from 'react'
import { SignUp } from '@clerk/nextjs'
const SignUpPage = () => {
  return (
    // <div>SignUpPage</div>
    <SignUp path='/sign-up'></SignUp>
  )
}

export default SignUpPage