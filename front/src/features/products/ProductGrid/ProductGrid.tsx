import ProductCard from '../ProductCard/ProductCard'
import { Grid, SkeletonCard, EmptyMessage } from './ProductGrid.styles'
import type { Product } from '../../../types/api'

function SkeletonItem() {
  return <SkeletonCard />
}

interface ProductGridProps {
  products?: Product[]
  loading?: boolean
  skeletonCount?: number
  emptyMessage?: string
}

export default function ProductGrid({
  products = [],
  loading = false,
  skeletonCount = 9,
  emptyMessage = 'Nenhum produto encontrado.',
}: ProductGridProps) {
  if (loading) {
    return (
      <Grid>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonItem key={i} />
        ))}
      </Grid>
    )
  }

  if (!products.length) {
    return <EmptyMessage>{emptyMessage}</EmptyMessage>
  }

  return (
    <Grid>
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </Grid>
  )
}
