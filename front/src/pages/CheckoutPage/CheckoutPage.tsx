import { useState, type FormEvent, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, ChevronRight, QrCode, CreditCard, FileText } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import Button from '../../ui/Button/Button'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import { orderService } from '../../services/orderService'
import { stripeService } from '../../services/stripeService'
import { formatCurrency } from '../../utils/formatCurrency'
import { getImageUrl } from '../../utils/getImageUrl'
import styled, { useTheme } from 'styled-components'

/* ── Stripe instance ─────────────────────────────────────────────────────── */

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY ?? '')

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

const StripeInput = styled.div<{ $focused?: boolean }>`
  padding: 11px 14px;
  border: 1px solid ${({ $focused, theme }) => $focused ? theme.colors.brand : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  background: transparent;
  transition: border-color 150ms;
  cursor: text;
`

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[3]};
`

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

const StripeNote = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
`

const PAYMENT_METHODS = [
  { value: 'pix',    label: 'PIX',                desc: '5% de desconto',        icon: <QrCode size={20} /> },
  { value: 'cartao', label: 'Cartão de crédito',  desc: 'Em até 12x sem juros',  icon: <CreditCard size={20} /> },
  { value: 'boleto', label: 'Boleto bancário',    desc: 'Vencimento em 3 dias',  icon: <FileText size={20} /> },
]

/* ── Inner form (needs Stripe hooks) ─────────────────────────────────────── */

interface FormProps {
  name: string; setName: (v: string) => void
  email: string; setEmail: (v: string) => void
  cep: string; setCep: (v: string) => void
  street: string; setStreet: (v: string) => void
  number: string; setNumber: (v: string) => void
  complement: string; setComplement: (v: string) => void
  neighborhood: string; setNeighborhood: (v: string) => void
  city: string; setCity: (v: string) => void
  state: string; setState: (v: string) => void
  payment: string; setPayment: (v: string) => void
  totalPrice: number
  onSuccess: (orderId: number) => void
}

function CheckoutForm(props: FormProps) {
  const {
    name, setName, email, setEmail,
    cep, setCep, street, setStreet,
    number, setNumber, complement, setComplement,
    neighborhood, setNeighborhood, city, setCity,
    state, setState,
    payment, setPayment,
    totalPrice, onSuccess,
  } = props

  const { items, clearCart } = useCart()
  const stripe = useStripe()
  const elements = useElements()
  const theme = useTheme()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [cardName, setCardName] = useState('')

  const address = `${street}, ${number}${complement ? `, ${complement}` : ''} — ${neighborhood}, ${city}/${state}, CEP ${cep}`

  const stripeStyle = useMemo(() => ({
    style: {
      base: {
        fontSize: '14px',
        color: theme?.colors?.textPrimary ?? '#111827',
        fontFamily: 'Manrope, Inter, system-ui, sans-serif',
        fontWeight: '400',
        '::placeholder': { color: theme?.colors?.textSecondary ?? '#9ca3af' },
      },
      invalid: { color: '#ef4444' },
    },
  }), [theme])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let stripePaymentIntentId: string | undefined

      // ── Cartão: confirmar com Stripe.js ───────────────────────────────────
      if (payment === 'cartao') {
        if (!stripe || !elements) {
          setError('Stripe não carregado. Recarregue a página.')
          setLoading(false)
          return
        }

        const cardNumberElement = elements.getElement(CardNumberElement)
        if (!cardNumberElement) {
          setError('Elemento de cartão não encontrado.')
          setLoading(false)
          return
        }

        // 1. Criar PaymentIntent no backend
        const { clientSecret, paymentIntentId } = await stripeService.createPaymentIntent(
          totalPrice,
          'card',
        )

        // 2. Confirmar pagamento com dados do cartão
        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardNumberElement,
            billing_details: { name: cardName || name, email },
          },
        })

        if (stripeError) {
          setError(stripeError.message ?? 'Erro ao processar cartão.')
          setLoading(false)
          return
        }

        if (paymentIntent?.status !== 'succeeded') {
          setError('Pagamento não foi aprovado. Tente novamente.')
          setLoading(false)
          return
        }

        stripePaymentIntentId = paymentIntentId
      }

      // ── PIX / Boleto: criar PaymentIntent mas confirmar assincronamente ───
      if (payment === 'pix' || payment === 'boleto') {
        const method = payment === 'pix' ? 'pix' : 'boleto'
        const { paymentIntentId } = await stripeService.createPaymentIntent(totalPrice, method)
        stripePaymentIntentId = paymentIntentId
      }

      // ── Criar pedido no banco ────────────────────────────────────────────
      const order = await orderService.create(
        items,
        {
          customerName: name,
          customerEmail: email,
          address,
          paymentMethod: payment,
          stripePaymentIntentId,
        },
        totalPrice,
      )

      clearCart()
      onSuccess(order.id)
    } catch {
      setError('Erro ao finalizar pedido. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
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

        {/* Campos do cartão — aparecem apenas quando cartão está selecionado */}
        {payment === 'cartao' && (
          <>
            <Field>
              <FieldLabel>Número do cartão</FieldLabel>
              <StripeInput $focused={focusedField === 'number'}>
                <CardNumberElement
                  options={{ ...stripeStyle, showIcon: true }}
                  onFocus={() => setFocusedField('number')}
                  onBlur={() => setFocusedField(null)}
                />
              </StripeInput>
            </Field>

            <Field>
              <FieldLabel>Nome no cartão</FieldLabel>
              <Input
                type="text"
                placeholder="Como está impresso no cartão"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                autoComplete="cc-name"
              />
            </Field>

            <CardGrid>
              <Field>
                <FieldLabel>Validade</FieldLabel>
                <StripeInput $focused={focusedField === 'expiry'}>
                  <CardExpiryElement
                    options={stripeStyle}
                    onFocus={() => setFocusedField('expiry')}
                    onBlur={() => setFocusedField(null)}
                  />
                </StripeInput>
              </Field>
              <Field>
                <FieldLabel>CVC</FieldLabel>
                <StripeInput $focused={focusedField === 'cvc'}>
                  <CardCvcElement
                    options={stripeStyle}
                    onFocus={() => setFocusedField('cvc')}
                    onBlur={() => setFocusedField(null)}
                  />
                </StripeInput>
              </Field>
            </CardGrid>

            <StripeNote>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Pagamento processado com segurança pela Stripe
            </StripeNote>
          </>
        )}
      </Section>

      <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading || (payment === 'cartao' && !stripe)}>
        {loading ? 'Processando...' : `Finalizar pedido · ${formatCurrency(totalPrice)}`}
        {!loading && <ChevronRight size={18} style={{ marginLeft: 4 }} />}
      </Button>
    </Form>
  )
}

/* ── Main page ───────────────────────────────────────────────────────────── */

export default function CheckoutPage() {
  const { items, totalPrice } = useCart()
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

  return (
    <PageWrapper>
      <PageLabel>Finalizar compra</PageLabel>
      <Title>Checkout</Title>

      <Grid>
        <Elements stripe={stripePromise}>
          <CheckoutForm
            name={name} setName={setName}
            email={email} setEmail={setEmail}
            cep={cep} setCep={setCep}
            street={street} setStreet={setStreet}
            number={number} setNumber={setNumber}
            complement={complement} setComplement={setComplement}
            neighborhood={neighborhood} setNeighborhood={setNeighborhood}
            city={city} setCity={setCity}
            state={state} setState={setState}
            payment={payment} setPayment={setPayment}
            totalPrice={totalPrice}
            onSuccess={(id) => navigate(`/pedido-confirmado/${id}`)}
          />
        </Elements>

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
