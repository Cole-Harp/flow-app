import React from "react"


export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}

const AuthLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className = "flex items-center justify-center h-full">
      {children}
    </div>
  )
}
export default AuthLayout
