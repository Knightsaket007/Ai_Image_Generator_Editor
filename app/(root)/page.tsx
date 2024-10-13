import { UserButton } from '@clerk/nextjs'
import React from 'react'
const Home = () => {
  return (
    <>
    <h1>home page... in progress</h1>
    <UserButton afterSignOutUrl='/' />
    </>
  )
}
export default Home