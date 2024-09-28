import React from 'react'

const Header = ({ title, subtitle }: { title: string, subtitle?: string }) => {
    return (
        <>
            <h1>{title}</h1>
            <p>{subtitle}</p>

        </>
    )
}

export default Header