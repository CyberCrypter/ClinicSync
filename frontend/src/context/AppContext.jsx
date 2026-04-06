import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'

export const AppContext = createContext()

const AppContextProvider = (props)=>{

    const storedToken = localStorage.getItem('token')
    const initialToken = storedToken && storedToken !== 'undefined' && storedToken !== 'null' ? storedToken : false

    const currencySymbol = '$'
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [doctors,setDoctors] = useState([])
    const [token,setToken] = useState(initialToken)
    const [userData,setUserData] = useState(false)


    const getDoctorsData = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/doctor/list')
            if (data.success){
                setDoctors(data.doctors)

            }else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
            
        }
    }

    const loadUserProfileData = async () => {
        if(!token) return

        try {
            const { data } = await axios.get(backendUrl + '/api/user/get-profile',{headers:{token}})
            if(data.success){
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            const statusCode = error?.response?.status

            if(statusCode === 401 || statusCode === 403){
                localStorage.removeItem('token')
                setToken(false)
                setUserData(false)
                return
            }

            toast.error(error.message)
        }
    }

        const value ={
        doctors,getDoctorsData,
        currencySymbol,
        token,
        setToken,
        backendUrl,
        userData,
        setUserData,
        loadUserProfileData
    }

    useEffect(()=>{
        getDoctorsData()
    },[])

    useEffect(()=>{
        if(token){
            loadUserProfileData()
        } else {
            setUserData(false)
        }
    },[token])

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider