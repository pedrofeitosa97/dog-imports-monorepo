import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, ChevronRight, QrCode, CreditCard, FileText } from 'lucide-react'
import Button from '../../ui/Button/Button'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import { orderService } from '../../services/orderService'
import { formatCurrency } from '../../utils/formatCurrency'
import { getImageUrl } from '../../utils/getImageUrl'
import styled from 'styled-components'

/* ── Layout ──────────────────────────────────────────────────────────────── */

const PageWrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[8]} 8px`};

  @media (min-width: 480px) {
    padding: ${({ theme }) => `${theme.spacing[8]} clamp(16px, 5vw, 48px)`};
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

const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[8]};
  align-items: start;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 360px;
  }
`

/* ── Form ────────────────────────────────────────────────────────────────── */

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[8]};
`

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`

const SectionTitle = styled.h2`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding-bottom: ${({ theme }) => theme.spacing[3]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const FieldRow = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[3]};
  grid-template-columns: 1fr;

  &[data-cols="2"] {
    @media (min-width: 480px) { grid-template-columns: 1fr 1fr; }
  }

  &[data-cols="3-1"] {
    @media (min-width: 480px) { grid-template-columns: 2fr 1fr; }
  }
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const FieldLabel = styled.label`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
`

const Input = styled.input`
  width: 100%;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  padding: 11px 14px;
  font-size: 14px;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.textPrimary};
  outline: none;
  transition: border-color ${({ theme }) => theme.transitions.fast};
  box-sizing: border-box;

  &::placeholder { color: ${({ theme }) => theme.colors.textSecondary}; }
  &:focus { border-color: ${({ theme }) => theme.colors.brand}; }
`

/* ── Payment methods ─────────────────────────────────────────────────────── */

const PaymentOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`

const PaymentOption = styled.label<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border: 1.5px solid ${({ $selected, theme }) => $selected ? theme.colors.brand : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  cursor: pointer;
  transition: border-color ${({ theme }) => theme.transitions.fast};
  background: ${({ $selected, theme }) => $selected ? theme.colors.brandLight : 'transparent'};

  input[type="radio"] { display: none; }
`

const PaymentIcon = styled.div<{ $selected: boolean }>`
  color: ${({ $selected, theme }) => $selected ? theme.colors.brand : theme.colors.textSecondary};
  display: flex;
  align-items: center;
`

const PaymentInfo = styled.div``

const PaymentName = styled.p<{ $selected: boolean }>`
  font-size: 13px;
  font-weight: 700;
  color: ${({ $selected, theme }) => $selected ? theme.colors.textPrimary : theme.colors.textSecondary};
`

const PaymentDesc = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 2px;
`

/* ── Summary sidebar ─────────────────────────────────────────────────────── */

const Summary = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[6]};
  position: sticky;
  top: 100px;
`

const SummaryTitle = styled.h3`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding-bottom: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`

const SummaryItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`

const SummaryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const ItemImg = styled.img`
  width: 52px;
  height: 64px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: ${({ theme }) => theme.colors.surface};
  flex-shrink: 0;
`

const ItemImgPlaceholder = styled.div`
  width: 52px;
  height: 64px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: ${({ theme }) => theme.colors.surface};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`

const ItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const ItemName = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ItemMeta = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 2px;
`

const ItemPrice = styled.p`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => `${theme.spacing[3]} 0`};
`

const SummaryRow = styled.div<{ $total?: boolean }>`
  display: flex;
  justify-content: space-between;
  font-size: ${({ $total }) => $total ? '15px' : '13px'};
  font-weight: ${({ $total }) => $total ? 700 : 400};
  color: ${({ $total, theme }) => $total ? theme.colors.textPrimary : theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing[2]};
`

const ErrorMsg = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.accentRed};
  padding: 10px 14px;
  background: rgba(239,68,68,0.08);
  border-radius: ${({ theme }) => theme.borderRadius.base};
  border: 1px solid rgba(239,68,68,0.18);
`

const EmptyWrapper = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[20]};
  color: ${({ theme }) => theme.colors.textSecondary};
`

const PAYMENT_METHODS = [
  { value: 'pix', label: 'PIX', desc: '5% de desconto', icon: <QrCode size={20} /> },
  { value: 'cartao', label: 'Cartão de crédito', desc: 'Em até 12x sem juros', icon: <CreditCard size={20} /> },
  { value: 'boleto', label: 'Boleto bancário', desc: 'Vencimento em 3 dias úteis', icon: <FileText size={20} /> },
]

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [cep, setCep] = useState('')
  const [street, setStreet] = useState('')
  const [number, setNumber] = useState('')
  const [complement, setComplement] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [payment, setPayment] = useState('pix')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (items.length === 0) {
    return (
      <PageWrapper>
        <EmptyWrapper>
          <ShoppingBag size={48} strokeWidth={1} style={{ opacity: 0.3, margin: '0 auto 16px' }} />
          <p style={{ marginBottom: 16 }}>Seu carrinho está vazio.</p>
          <Button as={Link} to="/produtos" variant="primary">Ver produtos</Button>
        </EmptyWrapper>
      </PageWrapper>
    )
  }

  const address = `${street}, ${number}${complement ? `, ${complement}` : ''} — ${neighborhood}, ${city}/${state}, CEP ${cep}`

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const order = await orderService.create(
        items,
        { customerName: name, customerEmail: email, address, paymentMethod: payment },
        totalPrice,
      )
      clearCart()
      navigate(`/pedido-confirmado/${order.id}`)
    } catch {
      setError('Erro ao finalizar pedido. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <PageLabel>Finalizar compra</PageLabel>
      <Title>Checkout</Title>

      <Grid>
        <Form onSubmit={handleSubmit}>
          {error && <ErrorMsg>{error}</ErrorMsg>}

          {/* Dados pessoais */}
          <Section>
            <SectionTitle>Dados pessoais</SectionTitle>
            <FieldRow data-cols="2">
              <Field>
                <FieldLabel htmlFor="name">Nome completo</FieldLabel>
                <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Seu nome" />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="seu@email.com" />
              </Field>
            </FieldRow>
          </Section>

          {/* Endereço */}
          <Section>
            <SectionTitle>Endereço de entrega</SectionTitle>
            <FieldRow data-cols="3-1">
              <Field>
                <FieldLabel htmlFor="street">Rua / Avenida</FieldLabel>
                <Input id="street" type="text" value={street} onChange={(e) => setStreet(e.target.value)} required placeholder="Nome da rua" />
              </Field>
              <Field>
                <FieldLabel htmlFor="number">Número</FieldLabel>
                <Input id="number" type="text" value={number} onChange={(e) => setNumber(e.target.value)} required placeholder="123" />
              </Field>
            </FieldRow>
            <FieldRow data-cols="2">
              <Field>
                <FieldLabel htmlFor="complement">Complemento</FieldLabel>
                <Input id="complement" type="text" value={complement} onChange={(e) => setComplement(e.target.value)} placeholder="Apto, bloco..." />
              </Field>
              <Field>
                <FieldLabel htmlFor="neighborhood">Bairro</FieldLabel>
                <Input id="neighborhood" type="text" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} required placeholder="Bairro" />
              </Field>
            </FieldRow>
            <FieldRow data-cols="2">
              <Field>
                <FieldLabel htmlFor="city">Cidade</FieldLabel>
                <Input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} required placeholder="Cidade" />
              </Field>
              <Field>
                <FieldLabel htmlFor="state">Estado</FieldLabel>
                <Input id="state" type="text" value={state} onChange={(e) => setState(e.target.value)} required placeholder="SP" maxLength={2} style={{ textTransform: 'uppercase' }} />
              </Field>
            </FieldRow>
            <Field>
              <FieldLabel htmlFor="cep">CEP</FieldLabel>
              <Input id="cep" type="text" value={cep} onChange={(e) => setCep(e.target.value)} required placeholder="00000-000" maxLength={9} style={{ maxWidth: 200 }} />
            </Field>
          </Section>

          {/* Pagamento */}
          <Section>
            <SectionTitle>Forma de pagamento</SectionTitle>
            <PaymentOptions>
              {PAYMENT_METHODS.map((m) => (
                <PaymentOption key={m.value} $selected={payment === m.value}>
                  <input type="radio" name="payment" value={m.value} checked={payment === m.value} onChange={() => setPayment(m.value)} />
                  <PaymentIcon $selected={payment === m.value}>{m.icon}</PaymentIcon>
                  <PaymentInfo>
                    <PaymentName $selected={payment === m.value}>{m.label}</PaymentName>
                    <PaymentDesc>{m.desc}</PaymentDesc>
                  </PaymentInfo>
                </PaymentOption>
              ))}
            </PaymentOptions>
          </Section>

          <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
            {loading ? 'Finalizando...' : `Finalizar pedido · ${formatCurrency(totalPrice)}`}
            {!loading && <ChevronRight size={18} style={{ marginLeft: 4 }} />}
          </Button>
        </Form>

        {/* Order summary */}
        <Summary>
          <SummaryTitle>Resumo do pedido</SummaryTitle>
          <SummaryItems>
            {items.map((item, idx) => (
              <SummaryItem key={idx}>
                {item.product.images?.[0]
                  ? <ItemImg src={getImageUrl(item.product.images[0]) ?? item.product.images[0]} alt={item.product.name} />
                  : <ItemImgPlaceholder><ShoppingBag size={16} /></ItemImgPlaceholder>
                }
                <ItemInfo>
                  <ItemName>{item.product.name}</ItemName>
                  <ItemMeta>
                    {[item.selectedSize, item.selectedColor].filter(Boolean).join(' · ')}{item.quantity > 1 ? ` × ${item.quantity}` : ''}
                  </ItemMeta>
                </ItemInfo>
                <ItemPrice>{formatCurrency(item.product.price * item.quantity)}</ItemPrice>
              </SummaryItem>
            ))}
          </SummaryItems>
          <Divider />
          <SummaryRow>
            <span>Subtotal</span>
            <span>{formatCurrency(totalPrice)}</span>
          </SummaryRow>
          <SummaryRow>
            <span>Frete</span>
            <span>Calcular após endereço</span>
          </SummaryRow>
          <Divider />
          <SummaryRow $total>
            <span>Total</span>
            <span>{formatCurrency(totalPrice)}</span>
          </SummaryRow>
        </Summary>
      </Grid>
    </PageWrapper>
  )
}
