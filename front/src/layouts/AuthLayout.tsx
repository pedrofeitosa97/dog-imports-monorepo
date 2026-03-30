import { Outlet } from 'react-router-dom'
import styled from 'styled-components'

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.adminBg};
  padding: ${({ theme }) => theme.spacing[4]};
`

const Card = styled.div`
  width: 100%;
  max-width: 420px;
  background: ${({ theme }) => theme.colors.adminSidebar};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[8]};
  box-shadow: ${({ theme }) => theme.shadows.xl};
`

export default function AuthLayout() {
  return (
    <Wrapper>
      <Card>
        <Outlet />
      </Card>
    </Wrapper>
  )
}
