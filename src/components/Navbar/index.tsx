import React from 'react'
import { Bars3BottomRightIcon , XMarkIcon} from '@heroicons/react/24/solid'
import { useState } from 'react'
import WaterBottle from '../../assets/images/waterbottle.svg';
import CashewNuts from '../../assets/images/peanuts.svg';
import Necklace from '../../assets/images/necklace.svg';
import ChoppingBoard from '../../assets/images/chopping-board.svg';

interface Link {
    name: string;
    link: string;
    icon: string;  
}   

export const Navbar = () => 
{
    let Links:Link[] = [
        {name: 'Water Bottles' , link : '/',icon: WaterBottle },
        {name: 'Cashew Nuts' , link : '/',icon:CashewNuts },
        {name: 'Invisible Necklace' , link : '/',icon:Necklace },
        {name: 'Chopping Board' , link : '/',icon:ChoppingBoard },
    ]

    let [isOpen , setisOpen] = useState(false);
    const [activeLink, setActiveLink] = useState<number | null>(null);

  return (
    <div className='pt-14'>

        <div className='w-full fixed bg-gray-300 z-40'>
            <div className='max-w-7xl h-10 sm:px-6 lg:px-8 flex items-center justify-between mx-auto'>

                {/* Menu Toggle for Mobile */}
                <div onClick={() => setisOpen(!isOpen)}
                className="w-7 h-7 absolute right-6 top-2 cursor-pointer md:hidden">
                {isOpen ? <XMarkIcon /> : <Bars3BottomRightIcon />}
                </div>

                {/* Navigation Links */}
                <ul className={`bg-gray-300 md:flex md:ml-20 md:space-x-20 items-center justify-between w-full md:w-auto absolute md:static md:bg-transparent transition-all duration-700 ease-in-out ${
                    isOpen? "top-10 left-0 w-full flex flex-col items-center py-5 bg-gray-200"
                    : "hidden"}`}>
                {Links.map((link, index) => (
                    <li
                    key={index}
                    className={`font-semibold ${
                        activeLink === index ? "text-sky-500" : "text-black"
                    }`}
                    >
                    <a
                        href={link.link}
                        className="flex items-center h-10 hover:text-sky-500 px-6 py-3 md:px-8 md:py-2 sm:w-full"
                        onClick={(e) => {
                        e.preventDefault();
                        setActiveLink(index);
                        }}
                    >
                        <img
                        src={link.icon}
                        alt={`${link.name} icon`}
                        className="w-5 h-5 mr-2"
                        />
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
