import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Spinner from '../ui/Spinner/Spinner'
import styled from 'styled-components'

const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`

export default function AdminRoutes() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <Center>
        <Spinner size="lg" />
      </Center>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
