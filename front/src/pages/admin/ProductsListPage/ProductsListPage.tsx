import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import DataTable, { type TableColumn } from '../../../features/admin/DataTable/DataTable'
import Button from '../../../ui/Button/Button'
import Badge from '../../../ui/Badge/Badge'
import Modal from '../../../ui/Modal/Modal'
import { productService } from '../../../services/productService'
import { getImageUrl } from '../../../utils/getImageUrl'
import type { Product } from '../../../types/api'
import styled from 'styled-components'

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 12px;
  flex-wrap: wrap;
`

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #f5f5f7;
`

const ActionBtns = styled.div`
  display: flex;
  gap: 8px;
`

const IconBtn = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  color: ${({ $danger }) => $danger ? '#ff6b6b' : 'rgba(255,255,255,0.6)'};
  transition: all 150ms;

  &:hover {
    background: rgba(255,255,255,0.08);
    color: ${({ $danger }) => $danger ? '#ff4444' : '#fff'};
  }
`

const ProductThumb = styled.img`
  width: 40px;
  height: 48px;
  object-fit: cover;
  border-radius: 4px;
  background: rgba(255,255,255,0.1);
`

const ConfirmText = styled.p`
  color: rgba(255,255,255,0.7);
  font-size: 14px;
  margin-bottom: 20px;
`

const ConfirmBtns = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`

const mockProducts: Product[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  slug: `produto-${i + 1}`,
  name: ['Camiseta Tommy Hilfiger', 'Moletom Polo Ralph Lauren', 'Jaqueta Calvin Klein', 'Tênis Gucci', 'Bolsa Michael Kors', 'Perfume Versace', 'Calça Armani', 'Casaco Burberry'][i],
  brand: ['Tommy Hilfiger', 'Ralph Lauren', 'Calvin Klein', 'Gucci', 'Michael Kors', 'Versace', 'Armani', 'Burberry'][i],
  price: [299, 599, 899, 2499, 1299, 449, 799, 1899][i],
  stock: [12, 5, 0, 3, 8, 20, 6, 2][i],
  isActive: i !== 2,
  isFeatured: false,
  images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=60'],
  description: '',
  badge: null,
  sizes: [],
  colors: [],
}))

export default function ProductsListPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    productService.getAll({ showAll: true, limit: 100 })
      .then((data) => {
        const arr = Array.isArray(data) ? data : ((data as { data?: Product[] }).data ?? [])
        setProducts(arr)
      })
      .catch(() => setProducts(mockProducts))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await productService.remove(deleteTarget.id)
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id))
    } catch {
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id))
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  const columns: TableColumn<Product>[] = [
    {
      key: 'images',
      label: '',
      width: '60px',
      render: (images: unknown) => {
        const imgs = images as string[] | undefined
        return <ProductThumb src={getImageUrl(imgs?.[0]) ?? undefined} alt="" />
      },
    },
    { key: 'name', label: 'Nome', sortable: true },
    { key: 'brand', label: 'Marca', sortable: true },
    {
      key: 'price',
      label: 'Preço',
      sortable: true,
      render: (v: unknown) => `R$ ${Number(v).toFixed(2)}`,
    },
    {
      key: 'stock',
      label: 'Estoque',
      render: (v: unknown) => {
        const stock = v as number
        return (
          <Badge variant={stock === 0 ? 'red' : stock <= 5 ? 'gold' : 'gray'} size="sm">
            {stock === 0 ? 'Esgotado' : stock}
          </Badge>
        )
      },
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (v: unknown) => {
        const active = v as boolean
        return <Badge variant={active ? 'green' : 'gray'} size="sm">{active ? 'Ativo' : 'Inativo'}</Badge>
      },
    },
    {
      key: 'actions',
      label: 'Ações',
      width: '80px',
      render: (_: unknown, row: Product) => (
        <ActionBtns>
          <IconBtn onClick={() => navigate(`/admin/produtos/${row.id}/editar`)}>
            <Pencil size={15} />
          </IconBtn>
          <IconBtn $danger onClick={() => setDeleteTarget(row)}>
            <Trash2 size={15} />
          </IconBtn>
        </ActionBtns>
      ),
    },
  ]

  return (
    <>
      <PageHeader>
        <Title>Produtos</Title>
        <Button as={Link} to="/admin/produtos/novo" variant="primary" size="sm">
          <Plus size={16} /> Novo produto
        </Button>
      </PageHeader>

      <DataTable columns={columns} rows={products} loading={loading} />

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Confirmar exclusão"
        size="sm"
      >
        <ConfirmText>
          Tem certeza que deseja excluir <strong>{deleteTarget?.name}</strong>? Esta ação não pode ser desfeita.
        </ConfirmText>
        <ConfirmBtns>
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDelete} loading={deleting}>Excluir</Button>
        </ConfirmBtns>
      </Modal>
    </>
  )
}
