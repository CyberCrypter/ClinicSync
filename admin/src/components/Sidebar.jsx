import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'

const Sidebar = () => {

    const {aToken} = useContext(AdminContext)
    const {dToken} = useContext(DoctorContext)

    const desktopLink = (to, icon, label) => (
      <NavLink
        className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F2FF] border-r-4 border-[#5F6FFF]' : ''}`}
        to={to}
      >
        {/* keep icon visible and consistent size on all breakpoints */}
        <img src={icon} alt={label} className='w-7 h-7 object-contain' />
        <p className='hidden md:block'>{label}</p>
      </NavLink>
    )

    const mobileLink = (to, icon, label) => (
      <NavLink
        to={to}
        className={({isActive}) => `flex flex-col items-center justify-center gap-1 py-1 px-2 ${isActive ? 'text-[#5F6FFF] bg-[#c5c5f6]' : 'text-gray-600'}`}
      >
        {/* use slightly larger icons on mobile so they look normal */}
        <img className='w-8 h-8 sm:w-8 sm:h-8 object-contain' src={icon} alt={label} />
        <p className='text-[11px] mt-0.5'>{label}</p>
      </NavLink>
    )

  return (
    <>
      {/* Desktop / tablet sidebar */}
      <div className='min-h-screen bg-white hidden md:block'>
        {aToken && 
            <ul className='text-[#515151] mt-5'>
                {desktopLink('/admin-dashboard', assets.home_icon, 'Dashboard')}
                {desktopLink('/all-appointments', assets.appointments_icon, 'Appointments')}
                {desktopLink('/add-doctor', assets.add_icon, 'Add Doctor')}
                {desktopLink('/doctor-list', assets.list_icon, 'Doctor List')}
            </ul>
        }

        {dToken && 
            <ul className='text-[#515151] mt-5'>
                {desktopLink('/doctor-dashboard', assets.home_icon, 'Dashboard')}
                {desktopLink('/doctor-appointments', assets.appointment_icon, 'Appointments')}
                {desktopLink('/doctor-profile', assets.people_icon, 'Profile')}
            </ul>
        }
      </div>

      {/* Mobile bottom nav - compact and consistent icon sizing */}
      <div className='fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-40'>
        <div className='max-w-screen mx-auto px-4'>
          <div className='flex justify-around items-center py-2'>
            {dToken && (
              <>
                {mobileLink('/doctor-dashboard', assets.home_icon, 'Home')}
                {mobileLink('/doctor-appointments', assets.appointment_icon, 'Appts')}
                {mobileLink('/doctor-profile', assets.people_icon, 'Profile')}
              </>
            )}
            {aToken && (
              <>
                {mobileLink('/admin-dashboard', assets.home_icon, 'Home')}
                {mobileLink('/all-appointments', assets.appointments_icon, 'Appts')}
                {mobileLink('/add-doctor', assets.add_icon, 'Add')}
                {mobileLink('/doctor-list', assets.list_icon, 'Doctor List')}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar