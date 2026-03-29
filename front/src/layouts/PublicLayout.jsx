import { Outlet } from 'react-router-dom'
import Header from '../shared/Header/Header'
import Footer from '../shared/Footer/Footer'
import CartSidebar from '../features/cart/CartSidebar/CartSidebar'
import styled from 'styled-components'

const Main = styled.main`
  flex: 1;
`

export default function PublicLayout() {
  return (
    <>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
      <CartSidebar />
    </>
  )
}
