import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            {/* -----Left section----- */}
            <div>
                <img className='mb-5 w-40' src={assets.logo} alt="" />
                <p className='w-full md:w-2/3 text-gray-600 leading-6' >Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus quos rerum velit explicabo ea voluptates illo facere magnam esse laboriosam, cumque quidem, sunt voluptas dicta itaque optio autem corrupti a.</p>
            </div>
            {/* -----Center section----- */}
            <div>
                <p className='text-xl font-medium mb-5' >COMPANY</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Contact Us</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>
            {/* -----Right section----- */}
            <div>
                <p className='text-xl font-medium mb-5' >GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600' >
                    <li>+919547510174</li>
                    <li>jitendas@gmail.com</li>
                </ul>
            </div>
        </div>
        {/* -----Copy right text----- */}
        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2025@ ClinicSync - All Right Reserved</p>
        </div>
    </div>
  )
}

export default Footer