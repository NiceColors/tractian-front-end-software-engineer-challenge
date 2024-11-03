import React from 'react'
import Navbar from './navbar'

export default function RootLayout({ children }: { children?: React.ReactNode }) {
    return (
        <div className="flex flex-col h-screen bg-[#E3EAEF]">
            <Navbar />
            <main className='max-w-screen-2xl w-full mx-auto p-2 h-full'>
                {children}
            </main>
        </div>
    )
}
