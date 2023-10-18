import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'



const ProtectedRoutes = () => {
let auth = sessionStorage.getItem("userToken")
// let userToken =  {'token':false}

  return (
    auth ? <Outlet /> : <Navigate to="/login"/>
  )
}

export default ProtectedRoutes