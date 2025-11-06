import React from 'react'

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {

    const tokenFromStorage = localStorage.getItem('token')

    if (!tokenFromStorage) {
        window.location.href = '/login'
        return null
    }

    return <>{children}</>
}

export default ProtectedRoutes
