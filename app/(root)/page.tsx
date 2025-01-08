import { Search } from '@/components/shared/Search'
import { UserButton } from '@clerk/nextjs'
import React from 'react'
const Home = () => {
  return (
    <>
    <h1>home page</h1>

    <section className="home">
      <h1 className='home-heading'>
        Unleash the power of the Picfer
      </h1>

      <Search/>
      
    </section>
   
    {/* <UserButton afterSignOutUrl='/' /> */}
    </>
  )
}
export default Home