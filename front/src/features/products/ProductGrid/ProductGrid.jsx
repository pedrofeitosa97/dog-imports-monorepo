import ProductCard from '../ProductCard/ProductCard'
import { Grid, SkeletonCard, EmptyMessage } from './ProductGrid.styles'

function SkeletonItem() {
  return <SkeletonCard />
}

export default function ProductGrid({ products = [], loading = false, skeletonCount = 9, emptyMessage = 'Nenhum produto encontrado.' }) {
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
