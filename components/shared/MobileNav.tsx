"use client"

import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Link from 'next/link'
import Image from 'next/image'
import { SignedIn, UserButton } from '@clerk/nextjs'
import { navLinks } from '@/constants'
import { usePathname } from 'next/navigation'


const MobileNav = () => {
  const pathname = usePathname();
  return (
    <header className='header'>
      <Link href='/' className='flex item-center gap-2 md:py-1'>
        <Image
          src="/assets/icons/home.svg"
          alt="logo"
          width={28}
          height={28}
          className='cursor-pointer'
        />
      </Link>
      <nav className="flex gap-3">
        <SignedIn>
          <UserButton afterSignOutUrl='/' />

          <Sheet>
            <SheetTrigger>
              <Image src="/assets/icons/menu.svg" alt='menu' width={30} height={30} />
            </SheetTrigger>
            <SheetContent>
              <Image
                src='/assets/icons/home.svg'
                alt='brand-logo'
                width={28}
                height={28}
                className='cursor-pointer'
              />

              <ul className="header-nav_elements scroll">
                {navLinks.slice(0, 6).map((link) => {
                  const isActive = link.route === pathname

                  return (
                    <li key={link.route} className={`sidebar-nav_element group ${isActive ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:bg-green-500' : 'text-gray-700'
                      }`}>
                      <Link className="sidebar-link" href={link.route}>
                        <Image
                          src={link.icon}
                          alt="logo"
                          width={24}
                          height={24}
                          className={`${isActive && 'filter-white brightness-400'}`}
                        />
                        {link.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>

              <ul className="header-nav_elements">
                {navLinks.slice(6).map((link) => {
                  const isActive = link.route === pathname

                  return (
                    <li key={link.route} className={`sidebar-nav_element group ${isActive ? 'bg-gradient-to-r from-green-500 to-green-700 text-white' : 'text-gray-700'
                      }`}>
                      <Link className="sidebar-link" href={link.route}>
                        <Image
                          src={link.icon}
                          alt="logo"
                          width={24}
                          height={24}
                          className={`${isActive && 'filter-white brightness-400'}`}
                        />
                        {link.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>

            </SheetContent>


          </Sheet>

        </SignedIn>
      </nav>
    </header>
  )
}

export default MobileNav