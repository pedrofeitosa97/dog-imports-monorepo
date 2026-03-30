import { useState, useEffect, type ChangeEvent } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import DataTable, { type TableColumn } from '../../../features/admin/DataTable/DataTable'
import Button from '../../../ui/Button/Button'
import Modal from '../../../ui/Modal/Modal'
import Input from '../../../ui/Input/Input'
import { categoryService } from '../../../services/categoryService'
import { slugify } from '../../../utils/slugify'
import type { Category } from '../../../types/api'
import styled from 'styled-components'

interface CategoryRow extends Category {
  productCount?: number
}

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #fff;
`

const FormFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`

const ActionBtns = styled.div`
  display: flex;
  gap: 8px;
`

const IconBtn = styled.button<{ danger?: boolean }>`
  display: flex;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  cursor: pointer;
  color: ${({ danger }) => danger ? '#ff6b6b' : 'rgba(255,255,255,0.6)'};
  justify-content: center;
  &:hover { background: rgba(255,255,255,0.08); color: ${({ danger }) => danger ? '#ff4444' : '#fff'}; }
`

const mockCategories: CategoryRow[] = [
  { id: 1, name: 'Masculino', slug: 'masculino', productCount: 18 },
  { id: 2, name: 'Feminino', slug: 'feminino', productCount: 24 },
  { id: 3, name: 'Unissex', slug: 'unissex', productCount: 6 },
  { id: 4, name: 'Acessórios', slug: 'acessorios', productCount: 12 },
]

export default function CategoryPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<CategoryRow | null>(null)
  const [formName, setFormName] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    categoryService.getAll()
      .then((data) => setCategories(data))
      .catch(() => setCategories(mockCategories))
      .finally(() => setLoading(false))
  }, [])

  const openCreate = () => { setEditing(null); setFormName(''); setModalOpen(true) }
  const openEdit = (cat: CategoryRow) => { setEditing(cat); setFormName(cat.name); setModalOpen(true) }

  const handleSave = async () => {
    setSaving(true)
    const data = { name: formName, slug: slugify(formName) }
    try {
      if (editing) {
        const updated = await categoryService.update(editing.id, data).catch(() => ({ ...editing, ...data }))
        setCategories((prev) => prev.map((c) => c.id === editing.id ? { ...updated, productCount: c.productCount } : c))
      } else {
        const created = await categoryService.create(data).catch(() => ({ id: Date.now(), ...data, productCount: 0 }))
        setCategories((prev) => [...prev, created])
      }
    } finally {
      setSaving(false)
      setModalOpen(false)
    }
  }

  const handleDelete = async (cat: CategoryRow) => {
    if (!window.confirm(`Excluir categoria "${cat.name}"?`)) return
    await categoryService.remove(cat.id).catch(() => undefined)
    setCategories((prev) => prev.filter((c) => c.id !== cat.id))
  }

  const columns: TableColumn<CategoryRow>[] = [
    { key: 'name', label: 'Nome', sortable: true },
    { key: 'slug', label: 'Slug' },
    { key: 'productCount', label: 'Produtos', sortable: true },
    {
      key: 'actions',
      label: 'Ações',
      width: '80px',
      render: (_: unknown, row: CategoryRow) => (
        <ActionBtns>
          <IconBtn onClick={() => openEdit(row)}><Pencil size={15} /></IconBtn>
          <IconBtn danger onClick={() => handleDelete(row)}><Trash2 size={15} /></IconBtn>
        </ActionBtns>
      ),
    },
  ]

  return (
    <>
      <PageHeader>
        <Title>Categorias</Title>
        <Button variant="primary" size="sm" onClick={openCreate}>
          <Plus size={16} /> Nova categoria
        </Button>
      </PageHeader>

      <DataTable columns={columns} rows={categories} loading={loading} />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar categoria' : 'Nova categoria'}
        size="sm"
      >
        <FormFields>
          <Input
            label="Nome da categoria"
            value={formName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormName(e.target.value)}
            fullWidth
            placeholder="Ex: Masculino"
          />
          <Input
            label="Slug (URL)"
            value={slugify(formName)}
            fullWidth
            disabled
          />
        </FormFields>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave} loading={saving} disabled={!formName}>
            {editing ? 'Salvar' : 'Criar'}
          </Button>
        </div>
      </Modal>
    </>
  )
}
