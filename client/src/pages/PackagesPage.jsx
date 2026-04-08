import { useNavigate } from 'react-router-dom'
import { BackHeader, MobileNav, PageContainer } from '../components/layout'
import MenuPage from './MenuPage'

// PackagesPage just renders MenuPage with packages tab selected
export default function PackagesPage() {
  return <MenuPage />
}
