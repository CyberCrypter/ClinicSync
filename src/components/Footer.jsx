import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
        <div>
            {/* -----Left section----- */}
            <div>
                <img src={assets.logo} alt="" />
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus quos rerum velit explicabo ea voluptates illo facere magnam esse laboriosam, cumque quidem, sunt voluptas dicta itaque optio autem corrupti a.</p>
            </div>
            {/* -----Center section----- */}
            <div>
                <p>COMPANY</p>
                <ul>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Contact Us</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>
            {/* -----Right section----- */}
            <div>
                <p>GET IN TOUCH</p>
                <ul>
                    <li>+919547510174</li>
                    <li>jitendas@gmail.com</li>
                </ul>
            </div>
        </div>
        {/* -----Copy right text----- */}
        <div>
            <hr />
            <p>Copyright 2025@ ClinicSync - All Right Reserved</p>
        </div>
    </div>
  )
}

export default Footer