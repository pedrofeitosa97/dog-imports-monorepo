import { useState, useEffect, useRef, useCallback, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, ArrowRight, Clock, TrendingUp } from 'lucide-react'
import styled, { keyframes } from 'styled-components'
import { productService } from '../../services/productService'
import { getImageUrl } from '../../utils/getImageUrl'
import type { Product } from '../../types/api'

/* ── animations ─────────────────────────────────────────────────────────── */

const slideInBar = keyframes`
  from { transform: translate3d(0, -100%, 0); }
  to   { transform: translate3d(0, 0, 0); }
`

const fadeInDim = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`

const fadeInResults = keyframes`
  from { opacity: 0; transform: translate3d(0, -6px, 0); }
  to   { opacity: 1; transform: translate3d(0, 0, 0); }
`

/* ── bar ─────────────────────────────────────────────────────────────────── */

const Bar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${({ theme }) => theme.zIndex.modal};
  height: 72px;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 0 clamp(16px, 5vw, 56px);
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.headerBorder};
  will-change: transform;
  animation: ${slideInBar} 240ms cubic-bezier(0.2, 0.8, 0.2, 1) both;

  @media (max-width: 640px) {
    height: 60px;
    padding: 0 16px;
    gap: 12px;
  }
`

const LogoArea = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;

  img {
    height: 48px;
    width: 48px;
    object-fit: contain;
  }

  @media (max-width: 480px) {
    display: none;
  }
`

const InputWrap = styled.label`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.07);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 0 16px;
  height: 44px;
  cursor: text;
  transition: background 150ms;

  &:focus-within {
    background: rgba(255, 255, 255, 0.10);
  }

  svg { color: ${({ theme }) => theme.colors.textSecondary}; flex-shrink: 0; }

  @media (max-width: 640px) {
    height: 40px;
    padding: 0 12px;
  }
`

const Input = styled.input`
  flex: 1;
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: inherit;
  background: transparent;
  outline: none;
  min-width: 0;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: 400;
  }
`

const ClearBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  color: ${({ theme }) => theme.colors.textPrimary};
  flex-shrink: 0;
  cursor: pointer;
  transition: background 150ms;
  &:hover { background: rgba(255, 255, 255, 0.28); }
`

const CancelBtn = styled.button`
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  white-space: nowrap;
  padding: 6px 4px;
  transition: opacity 150ms;
  &:hover { opacity: 0.6; }
`

/* ── dim overlay ─────────────────────────────────────────────────────────── */

const Dim = styled.div`
  position: fixed;
  inset: 0;
  top: 72px;
  z-index: ${({ theme }) => (theme.zIndex.modal as number) - 1};
  background: rgba(0, 0, 0, 0.5);
  animation: ${fadeInDim} 200ms ease both;

  @media (max-width: 640px) { top: 60px; }
`

/* ── results dropdown ────────────────────────────────────────────────────── */

const Dropdown = styled.div`
  position: fixed;
  top: 72px;
  left: 0;
  right: 0;
  z-index: ${({ theme }) => theme.zIndex.modal};
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.headerBorder};
  max-height: calc(100vh - 72px);
  overflow-y: auto;
  animation: ${fadeInResults} 180ms ease both;

  @media (max-width: 640px) { top: 60px; }
`

const DropInner = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: clamp(16px, 3vw, 28px) clamp(16px, 5vw, 56px);
`

const Section = styled.div`
  & + & { margin-top: 24px; }
`

const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSecondary};
  letter-spacing: 0.7px;
  text-transform: uppercase;
  margin-bottom: 10px;
`

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 16px;

  @media (max-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
`

const ProductItem = styled.button`
  display: flex;
  flex-direction: column;
  gap: 7px;
  text-align: left;
  cursor: pointer;
  transition: opacity 150ms;
  &:hover { opacity: 0.75; }
`

const ProductThumb = styled.div`
  width: 100%;
  aspect-ratio: 3/4;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const ProductThumbPlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 3/4;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.surface};
`

const ProductItemName = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
`

const ProductItemPrice = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`

const SuggestionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const SuggestionItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  text-align: left;
  transition: background 120ms;
  &:hover { background: ${({ theme }) => theme.colors.surface}; }
  svg { color: ${({ theme }) => theme.colors.textSecondary}; flex-shrink: 0; }
`

const SeeAllRow = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.brand};
  cursor: pointer;
  transition: opacity 150ms;
  &:hover { opacity: 0.7; }
`

const NoResult = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 8px 0;
`

/* ── helpers ─────────────────────────────────────────────────────────────── */

const RECENT_KEY = 'search_recent'
const MAX_RECENT = 5
const POPULAR = ['Tommy Hilfiger', 'Ralph Lauren', 'Calvin Klein', 'Gucci', 'Tênis']

function loadRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]') } catch { return [] }
}
function saveRecent(q: string) {
  const list = [q, ...loadRecent().filter((r) => r !== q)].slice(0, MAX_RECENT)
  localStorage.setItem(RECENT_KEY, JSON.stringify(list))
}

interface SearchOverlayProps {
  onClose: () => void
}

/* ── component ───────────────────────────────────────────────────────────── */

export default function SearchOverlay({ onClose }: SearchOverlayProps) {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [recent, setRecent] = useState<string[]>(loadRecent)

  useEffect(() => { inputRef.current?.focus() }, [])

  const search = useCallback((q: string) => {
    if (!q.trim()) { setResults([]); setTotal(0); return }
    setLoading(true)
    productService
      .getAll({ search: q.trim(), limit: 6 })
      .then((res) => { setResults(res.data); setTotal(res.total) })
      .catch(() => setResults([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const id = setTimeout(() => search(query), 300)
    return () => clearTimeout(id)
  }, [query, search])

  const go = (q: string) => {
    if (!q.trim()) return
    saveRecent(q.trim())
    setRecent(loadRecent())
    onClose()
    navigate(`/busca?q=${encodeURIComponent(q.trim())}`)
  }

  const goProduct = (slug: string) => { onClose(); navigate(`/produtos/${slug}`) }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'Enter')  go(query)
  }

  const showDropdown = query.trim().length > 0 || recent.length > 0

  return (
    <>
      <Bar>
        <LogoArea>
          <img src="/logo.png" alt="Dog Imports" />
        </LogoArea>

        <InputWrap>
          <Search size={17} />
          <Input
            ref={inputRef}
            placeholder="Buscar produtos, marcas..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
          />
          {query && (
            <ClearBtn onClick={() => { setQuery(''); inputRef.current?.focus() }}>
              <X size={11} />
            </ClearBtn>
          )}
        </InputWrap>

        <CancelBtn onClick={onClose}>Cancelar</CancelBtn>
      </Bar>

      <Dim onClick={onClose} />

      {showDropdown && (
        <Dropdown>
          <DropInner>

            {/* ── sem query: recentes + populares ── */}
            {!query.trim() && (
              <>
                {recent.length > 0 && (
                  <Section>
                    <SectionLabel><Clock size={12} /> Recentes</SectionLabel>
                    <SuggestionList>
                      {recent.map((r) => (
                        <SuggestionItem key={r} onClick={() => go(r)}>
                          <Clock size={15} /> {r}
                        </SuggestionItem>
                      ))}
                    </SuggestionList>
                  </Section>
                )}
                <Section>
                  <SectionLabel><TrendingUp size={12} /> Populares</SectionLabel>
                  <SuggestionList>
                    {POPULAR.map((p) => (
                      <SuggestionItem key={p} onClick={() => go(p)}>
                        <TrendingUp size={15} /> {p}
                      </SuggestionItem>
                    ))}
                  </SuggestionList>
                </Section>
              </>
            )}

            {/* ── com query: resultados em grid ── */}
            {query.trim() && (
              <Section>
                <SectionLabel><Search size={12} /> Produtos</SectionLabel>

                {loading && <NoResult>Buscando...</NoResult>}

                {!loading && results.length === 0 && (
                  <NoResult>Nenhum resultado para &ldquo;{query}&rdquo;</NoResult>
                )}

                {!loading && results.length > 0 && (
                  <>
                    <ProductsGrid>
                      {results.map((p) => {
                        const img = getImageUrl(p.images?.[0])
                        return (
                          <ProductItem key={p.id} onClick={() => goProduct(p.slug)}>
                            {img
                              ? <ProductThumb><img src={img} alt={p.name} loading="lazy" decoding="async" /></ProductThumb>
                              : <ProductThumbPlaceholder />
                            }
                            <ProductItemName>{p.name}</ProductItemName>
                            <ProductItemPrice>
                              {p.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </ProductItemPrice>
                          </ProductItem>
                        )
                      })}
                    </ProductsGrid>

                    {total > results.length && (
                      <SeeAllRow onClick={() => go(query)}>
                        Ver todos os {total} resultados <ArrowRight size={15} />
                      </SeeAllRow>
                    )}
                  </>
                )}
              </Section>
            )}

          </DropInner>
        </Dropdown>
      )}
    </>
  )
}
