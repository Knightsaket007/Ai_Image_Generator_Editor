import React from 'react'
import Sidebar from '@/components/shared/Sidebar'
import { Sliders } from 'lucide-react'
import MobileNav from '@/components/shared/MobileNav'
const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className='root'>
            <Sidebar/>
            <MobileNav/>
            <div className='root_container'>
                <div className='wrapper'>
                    {children}
                </div>
            </div>
        </main>
    )
}

export default layout