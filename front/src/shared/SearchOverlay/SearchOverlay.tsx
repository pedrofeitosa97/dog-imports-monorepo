import { useState, useEffect, useRef, useCallback, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, ArrowRight, Clock, TrendingUp } from 'lucide-react'
import styled, { keyframes } from 'styled-components'
import { productService } from '../../services/productService'
import { getImageUrl } from '../../utils/getImageUrl'
import type { Product } from '../../types/api'

/* ── animations ─────────────────────────────────────────────────────────── */

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`

const slideDown = keyframes`
  from { opacity: 0; transform: translate3d(0, -14px, 0); }
  to   { opacity: 1; transform: translate3d(0, 0, 0); }
`

/* ── styled components ───────────────────────────────────────────────────── */

/*
 * backdrop-filter: blur é pesado no Chrome quando combinado com animação —
 * separamos o blur num pseudo-elemento estático (não animado) para que o
 * browser possa compô-lo numa camada GPU independente.
 */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndex.modal};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
  padding-bottom: 40px;
  overflow-y: auto;
  animation: ${fadeIn} 160ms ease both;

  &::before {
    content: '';
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.72);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    z-index: -1;
  }
`

const Panel = styled.div`
  width: 100%;
  max-width: 680px;
  padding: 0 16px;
  will-change: transform, opacity;
  animation: ${slideDown} 200ms cubic-bezier(.2, .8, .2, 1) both;
`

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  padding: 14px 18px;
  transition: border-color 150ms;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.brand};
  }
`

const SearchIcon = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  flex-shrink: 0;
  display: flex;
`

const SearchInput = styled.input`
  flex: 1;
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: inherit;
  background: transparent;
  outline: none;
  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: 400;
  }
`

const ClearBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  flex-shrink: 0;
  cursor: pointer;
  transition: all 150ms;
  &:hover { background: ${({ theme }) => theme.colors.brand}; color: #fff; }
`

const ResultsBox = styled.div`
  margin-top: 12px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  overflow: hidden;
`

const Section = styled.div`
  padding: 10px 0;
`

const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 18px 8px;
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  letter-spacing: 0.6px;
  text-transform: uppercase;
`

const ProductRow = styled.button<{ $focused?: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 10px 18px;
  cursor: pointer;
  text-align: left;
  transition: background 120ms;
  background: ${({ $focused, theme }) => $focused ? theme.colors.surfaceHover ?? 'rgba(255,255,255,0.05)' : 'transparent'};

  &:hover { background: ${({ theme }) => theme.colors.surfaceHover ?? 'rgba(255,255,255,0.05)'}; }
`

const Thumb = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.border};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const ThumbPlaceholder = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.border};
`

const ProductInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const ProductName = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 0 2px;
`

const ProductMeta = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`

const ProductPrice = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.brand};
  flex-shrink: 0;
`

const SeeAllBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 18px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.brand};
  cursor: pointer;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  transition: background 120ms;
  &:hover { background: ${({ theme }) => theme.colors.surfaceHover ?? 'rgba(255,255,255,0.04)'}; }
`

const SuggestionRow = styled.button<{ $focused?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 9px 18px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  text-align: left;
  background: ${({ $focused, theme }) => $focused ? theme.colors.surfaceHover ?? 'rgba(255,255,255,0.05)' : 'transparent'};
  transition: background 120ms;
  &:hover { background: ${({ theme }) => theme.colors.surfaceHover ?? 'rgba(255,255,255,0.04)'}; }

  svg { color: ${({ theme }) => theme.colors.textSecondary}; flex-shrink: 0; }
`

const Hint = styled.p`
  text-align: center;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 14px;
  opacity: 0.6;
`

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

export default function SearchOverlay({ onClose }: SearchOverlayProps) {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(0)
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
    const id = setTimeout(() => search(query), 320)
    return () => clearTimeout(id)
  }, [query, search])

  const go = (q: string) => {
    if (!q.trim()) return
    saveRecent(q.trim())
    setRecent(loadRecent())
    onClose()
    navigate(`/busca?q=${encodeURIComponent(q.trim())}`)
  }

  const goProduct = (slug: string) => {
    onClose()
    navigate(`/produtos/${slug}`)
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    const totalRows = results.length + (total > results.length ? 1 : 0)
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocused((f) => (f + 1) % totalRows) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setFocused((f) => (f - 1 + totalRows) % totalRows) }
    if (e.key === 'Escape')    onClose()
    if (e.key === 'Enter')     go(query)
  }

  const showSuggestions = !query && !loading
  const showResults = (query.trim().length > 0)

  return (
    <Overlay onClick={onClose}>
      <Panel onClick={(e) => e.stopPropagation()}>
        <SearchBar>
          <SearchIcon><Search size={20} /></SearchIcon>
          <SearchInput
            ref={inputRef}
            placeholder="Buscar produtos, marcas..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setFocused(0) }}
            onKeyDown={handleKey}
          />
          {query && (
            <ClearBtn onClick={() => { setQuery(''); inputRef.current?.focus() }}>
              <X size={14} />
            </ClearBtn>
          )}
        </SearchBar>

        {/* ── sugestões iniciais ── */}
        {showSuggestions && (
          <ResultsBox>
            {recent.length > 0 && (
              <Section>
                <SectionLabel><Clock size={13} /> Recentes</SectionLabel>
                {recent.map((r, i) => (
                  <SuggestionRow key={r} $focused={focused === i} onClick={() => go(r)}>
                    <Clock size={15} />
                    {r}
                  </SuggestionRow>
                ))}
              </Section>
            )}
            <Section>
              <SectionLabel><TrendingUp size={13} /> Populares</SectionLabel>
              {POPULAR.map((p, i) => (
                <SuggestionRow key={p} $focused={focused === i + recent.length} onClick={() => go(p)}>
                  <TrendingUp size={15} />
                  {p}
                </SuggestionRow>
              ))}
            </Section>
          </ResultsBox>
        )}

        {/* ── resultados live ── */}
        {showResults && (
          <ResultsBox>
            {loading && (
              <Section>
                <SectionLabel>Buscando...</SectionLabel>
              </Section>
            )}

            {!loading && results.length === 0 && (
              <Section>
                <SectionLabel>Nenhum resultado para &ldquo;{query}&rdquo;</SectionLabel>
              </Section>
            )}

            {!loading && results.length > 0 && (
              <Section>
                <SectionLabel><Search size={13} /> Produtos</SectionLabel>
                {results.map((p, i) => {
                  const img = getImageUrl(p.images?.[0])
                  return (
                    <ProductRow key={p.id} $focused={focused === i} onClick={() => goProduct(p.slug)}>
                      {img
                        ? <Thumb><img src={img} alt={p.name} loading="lazy" /></Thumb>
                        : <ThumbPlaceholder />
                      }
                      <ProductInfo>
                        <ProductName>{p.name}</ProductName>
                        <ProductMeta>{p.brand}</ProductMeta>
                      </ProductInfo>
                      <ProductPrice>
                        {p.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </ProductPrice>
                    </ProductRow>
                  )
                })}
              </Section>
            )}

            {!loading && total > results.length && (
              <SeeAllBtn onClick={() => go(query)}>
                <span>Ver todos os {total} resultados para &ldquo;{query}&rdquo;</span>
                <ArrowRight size={16} />
              </SeeAllBtn>
            )}

            {!loading && total > 0 && total <= results.length && (
              <SeeAllBtn onClick={() => go(query)}>
                <span>Ver página de resultados</span>
                <ArrowRight size={16} />
              </SeeAllBtn>
            )}
          </ResultsBox>
        )}

        <Hint>↑ ↓ para navegar · Enter para buscar · Esc para fechar</Hint>
      </Panel>
    </Overlay>
  )
}
