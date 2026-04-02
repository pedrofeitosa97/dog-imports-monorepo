import { Link, useNavigate } from 'react-router-dom'
import { Heart, ShoppingBag, LogOut, User } from 'lucide-react'
import Button from '../../ui/Button/Button'
import { useAuth } from '../../hooks/useAuth'
import { useWishlist } from '../../hooks/useWishlist'
import { useCart } from '../../hooks/useCart'
import Breadcrumb from '../../shared/Breadcrumb/Breadcrumb'
import styled from 'styled-components'

const PageWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[8]} 8px`};

  @media (min-width: 480px) {
    padding: ${({ theme }) => `${theme.spacing[10]} clamp(16px, 5vw, 48px)`};
  }
`

const PageLabel = styled.p`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 6px;
`

const Title = styled.h1`
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`

const ProfileCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[6]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[5]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`

const Avatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.brandLight};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.brand};
  flex-shrink: 0;
`

const ProfileInfo = styled.div`
  flex: 1;
`

const ProfileName = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`

const ProfileEmail = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 2px;
`

const QuickLinks = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

const QuickCard = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[5]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-decoration: none;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.brand};
  }
`

const QuickIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  background: ${({ theme }) => theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  flex-shrink: 0;
`

const QuickText = styled.div``

const QuickTitle = styled.p`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`

const QuickSub = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 2px;
`

const breadcrumb = [
  { label: 'Início', to: '/' },
  { label: 'Minha conta' },
]

export default function AccountPage() {
  const { user, logout } = useAuth()
  const { items: wishItems } = useWishlist()
  const { totalItems } = useCart()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  if (!user) {
    navigate('/login', { replace: true })
    return null
  }

  return (
    <PageWrapper>
      <Breadcrumb items={breadcrumb} />
      <PageLabel>Minha conta</PageLabel>
      <Title>Olá, {user.name?.split(' ')[0] ?? 'Cliente'}</Title>

      <ProfileCard>
        <Avatar><User size={24} /></Avatar>
        <ProfileInfo>
          <ProfileName>{user.name ?? 'Cliente'}</ProfileName>
          <ProfileEmail>{user.email}</ProfileEmail>
        </ProfileInfo>
      </ProfileCard>

      <QuickLinks>
        <QuickCard to="/favoritos">
          <QuickIcon><Heart size={20} /></QuickIcon>
          <QuickText>
            <QuickTitle>Favoritos</QuickTitle>
            <QuickSub>{wishItems.length} {wishItems.length === 1 ? 'item salvo' : 'itens salvos'}</QuickSub>
          </QuickText>
        </QuickCard>

        <QuickCard to="/carrinho">
          <QuickIcon><ShoppingBag size={20} /></QuickIcon>
          <QuickText>
            <QuickTitle>Carrinho</QuickTitle>
            <QuickSub>{totalItems} {totalItems === 1 ? 'item' : 'itens'}</QuickSub>
          </QuickText>
        </QuickCard>
      </QuickLinks>

      <Button variant="ghost" size="md" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <LogOut size={16} /> Sair da conta
      </Button>
    </PageWrapper>
  )
}
