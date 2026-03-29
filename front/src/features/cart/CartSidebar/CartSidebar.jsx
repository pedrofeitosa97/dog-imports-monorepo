import { X } from 'lucide-react'
import { useCart } from '../../../hooks/useCart'
import { formatCurrency } from '../../../utils/formatCurrency'
import CartItem from '../CartItem/CartItem'
import Button from '../../../ui/Button/Button'
import {
  Overlay,
  Drawer,
  DrawerHeader,
  DrawerTitle,
  CloseBtn,
  DrawerBody,
  EmptyCart,
  DrawerFooter,
  TotalRow,
  TotalLabel,
  TotalValue,
} from './CartSidebar.styles'

export default function CartSidebar() {
  const { isOpen, closeCart, items, totalItems, totalPrice } = useCart()

  return (
    <>
      {isOpen && <Overlay onClick={closeCart} />}
      <Drawer isOpen={isOpen}>
        <DrawerHeader>
          <DrawerTitle>Carrinho ({totalItems})</DrawerTitle>
          <CloseBtn onClick={closeCart}><X size={20} /></CloseBtn>
        </DrawerHeader>

        <DrawerBody>
          {items.length === 0 ? (
            <EmptyCart>Seu carrinho está vazio.</EmptyCart>
          ) : (
            items.map((item, idx) => <CartItem key={idx} item={item} />)
          )}
        </DrawerBody>

        {items.length > 0 && (
          <DrawerFooter>
            <TotalRow>
              <TotalLabel>Total</TotalLabel>
              <TotalValue>{formatCurrency(totalPrice)}</TotalValue>
            </TotalRow>
            <Button variant="primary" fullWidth size="lg">
              Finalizar pedido
            </Button>
          </DrawerFooter>
        )}
      </Drawer>
    </>
  )
}
