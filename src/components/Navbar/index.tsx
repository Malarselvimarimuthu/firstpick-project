import React from 'react'
import { Bars3BottomRightIcon , XMarkIcon} from '@heroicons/react/24/solid'
import { useState } from 'react'
import WaterBottle from '../assets/images/tabler--bottle-filled.svg';

export const Navbar = () => 
{
    let Links = [
        {name: 'Water Bottles' , link : '/'},
        {name: 'Cashew Nuts' , link : '/'},
        {name: 'Invisible Necklace' , link : '/'},
        {name: 'Chopping Board' , link : '/'},
    ]

    let [isOpen , setisOpen] = useState(false);
    const [activeLink, setActiveLink] = useState<number | null>(null);

  return (
    <div>
        <div className='w-full fixed bg-gray2'>
            <div className='max-w-7xl h-10 sm:px-6 lg:px-8 flex items-center justify-between mx-auto'>
                {/* Menu Toggle for Mobile */}

                <div
                    onClick={() => setisOpen(!isOpen)}
                    className='w-7 h-7 absolute right-8 top-6 cursor-pointer md:hidden'
                >
                    {isOpen ? <XMarkIcon /> : <Bars3BottomRightIcon />}
                </div>

                {/* Navigation Links */}
                <ul
                    className={`hidden md:flex items-center w-full justify-between ${
                        isOpen ? 'block' : ''
                    }`}
                >
                    {Links.map((link, index) => (
                        <li
                            key={index}
                            className={`font-semibold ${
                                activeLink === index ? 'text-blue' : 'text-black'
                            }`}
                        >
                            <a
                                href={link.link}
                                className='hover:text-blue-500 px-20'
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveLink(index);
                                }}
                            >
                                {link.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

    </div>
  )
}
