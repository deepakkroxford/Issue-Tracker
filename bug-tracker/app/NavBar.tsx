import React from 'react'
import Link from 'next/link'
import { FaBug } from "react-icons/fa6";
function NavBar() {

    //this is the array with the navigation buttons that will be displayed when the user clicks on the navigation

    /*
    this code reduce the duplication of the code 
    */
    const links = [
        { name: 'DashBoard', href: '/' },
        { name: 'Issue', href: '/isuue' },

    ]


    return (
        <nav className='flex space-x-7 border-b mb-10 px-5 h-16 items-center'>
            <Link href="/"><FaBug /></Link>
            <ul className='flex space-x-7'>
                {links.map(link => (
                    <li
                        key={link.name}>
                        <Link className='text-black-300 hover:text-zinc-300 hover:underline' href={link.href}>{link.name}</Link>
                    </li>
                ))}

            </ul>
        </nav>
    )
}

export default NavBar