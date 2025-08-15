import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Appointment from './pages/Appointment'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ToastContainer, toast } from 'react-toastify';



const App = () => {
  const location = useLocation()

  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Navbar/>
      {/* keyed wrapper triggers mount for each route -> CSS fade-in */}
      <div className="page-transition" key={location.pathname}>
        <Routes location={location}>
          <Route path='/' element={<Home/>} />
          <Route path='/doctors' element={<Doctors/>} />
          <Route path='/doctors/:speciality' element={<Doctors/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/about' element={<About/>} />
          <Route path='/contact' element={<Contact/>} />
          <Route path='/my-profile' element={<MyProfile/>} />
          <Route path='/my-appointments' element={<MyAppointments/>} />
          <Route path='/my-appointments/:id' element={<MyAppointments/>} />
          <Route path='/appointment/:docId' element={<Appointment/>} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App