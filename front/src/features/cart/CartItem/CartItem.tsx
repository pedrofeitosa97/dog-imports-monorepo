import { Minus, Plus, Trash2 } from 'lucide-react'
import { formatCurrency } from '../../../utils/formatCurrency'
import { useCart } from '../../../hooks/useCart'
import type { CartItem as CartItemType } from '../../../contexts/cart.context'
import {
  ItemWrapper, ItemImage, ItemInfo, ItemName, ItemMeta,
  QuantityRow, QtyButton, QtyValue, ItemPrice, RemoveBtn,
} from './CartItem.styles'

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()
  const { product, quantity, selectedSize, selectedColor } = item

  return (
    <ItemWrapper>
      <ItemImage src={product.images?.[0] || '/placeholder.jpg'} alt={product.name} />
      <ItemInfo>
        <ItemName>{product.name}</ItemName>
        <ItemMeta>
          {selectedSize && <span>Tamanho: {selectedSize}</span>}
          {selectedColor && <span>Cor: {selectedColor}</span>}
          <span>{product.brand}</span>
        </ItemMeta>
        <QuantityRow>
          <QtyButton
            onClick={() => updateQuantity(product.id, selectedSize, selectedColor, quantity - 1)}
            disabled={quantity <= 1}
          >
            <Minus size={14} />
          </QtyButton>
          <QtyValue>{quantity}</QtyValue>
          <QtyButton
            onClick={() => updateQuantity(product.id, selectedSize, selectedColor, quantity + 1)}
          >
            <Plus size={14} />
          </QtyButton>
        </QuantityRow>
      </ItemInfo>
      <div>
        <ItemPrice>{formatCurrency(product.price * quantity)}</ItemPrice>
        <RemoveBtn onClick={() => removeItem(product.id, selectedSize, selectedColor)}>
          <Trash2 size={16} />
        </RemoveBtn>
      </div>
    </ItemWrapper>
  )
}
