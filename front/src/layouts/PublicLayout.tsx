import { Outlet, useLocation } from 'react-router-dom'
import Header from '../shared/Header/Header'
import Footer from '../shared/Footer/Footer'
import CartSidebar from '../features/cart/CartSidebar/CartSidebar'
import SitePopup from '../features/popup/SitePopup/SitePopup'
import WhatsAppButton from '../features/whatsapp/WhatsAppButton/WhatsAppButton'
import CookieBanner from '../features/lgpd/CookieBanner/CookieBanner'
import styled from 'styled-components'

const Main = styled.main`
  flex: 1;
`

export default function PublicLayout() {
  const location = useLocation()
  return (
    <>
      <Header transparent={location.pathname === '/'} />
      <Main>
        <Outlet />
      </Main>
      <Footer />
      <CartSidebar />
      <SitePopup />
      <WhatsAppButton />
      <CookieBanner />
    </>
  )
}
