import Footer from "./Footer"
import { useLocation } from "react-router-dom"

const Layout = ({ children }) => {
  const location = useLocation()
  
  // Check if we're on a login/register page
  const isAuthPage = location.pathname.includes('/login') || location.pathname.includes('/register')
  
  // Check if we're on a page that uses MUI Box layout
  const isMuiPage = location.pathname.includes('/user/home') || 
                   location.pathname.includes('/publisher/home') ||
                   location.pathname.includes('/ebookinfo')

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="flex-grow">
        {children}
      </div>
      {!isAuthPage && <Footer />}
    </div>
  )
}

export default Layout
