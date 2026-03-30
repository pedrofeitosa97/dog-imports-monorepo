import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import styled, { keyframes } from 'styled-components'
import LazyImage from '../../../ui/LazyImage/LazyImage'
import { GalleryWrapper, Thumbnails, Thumb } from './ImageGallery.styles'

/* ── Main image ─────────────────────────────────────────────────────────── */

const MainImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};
  position: relative;
  cursor: zoom-in;

  &:hover > span {
    opacity: 1;
  }
`

const ZoomHint = styled.span`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0,0,0,0.5);
  border-radius: 6px;
  padding: 5px 8px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #fff;
  opacity: 0;
  transition: opacity 160ms ease;
  pointer-events: none;
  backdrop-filter: blur(4px);
`

/* ── Lightbox ───────────────────────────────────────────────────────────── */

const fadeIn = keyframes`from { opacity: 0 } to { opacity: 1 }`

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9000;
  background: rgba(0,0,0,0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 180ms ease;
  backdrop-filter: blur(6px);
`

const LightboxImg = styled.img`
  max-width: 92vw;
  max-height: 88vh;
  object-fit: contain;
  border-radius: 6px;
  user-select: none;
  animation: ${fadeIn} 200ms ease;
`

const CloseBtn = styled.button`
  position: fixed;
  top: 18px;
  right: 18px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255,255,255,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  transition: background 140ms;
  &:hover { background: rgba(255,255,255,0.22); }
`

const NavBtn = styled.button<{ $side: 'left' | 'right' }>`
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  ${({ $side }) => $side === 'left' ? 'left: 14px;' : 'right: 14px;'}
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255,255,255,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  transition: background 140ms;
  &:hover { background: rgba(255,255,255,0.22); }

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    ${({ $side }) => $side === 'left' ? 'left: 8px;' : 'right: 8px;'}
  }
`

const Dots = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
`

const Dot = styled.span<{ $active: boolean }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ $active }) => $active ? '#fff' : 'rgba(255,255,255,0.35)'};
  transition: background 160ms;
`

/* ── Component ──────────────────────────────────────────────────────────── */

interface ImageGalleryProps {
  images?: string[]
}

export default function ImageGallery({ images = [] }: ImageGalleryProps) {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [lbIndex, setLbIndex] = useState(0)

  const openLightbox = (idx: number) => {
    setLbIndex(idx)
    setLightbox(true)
  }

  const closeLightbox = () => setLightbox(false)

  const prev = useCallback(() => setLbIndex((i) => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setLbIndex((i) => (i + 1) % images.length), [images.length])

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightbox, prev, next])

  if (!images.length) return null

  return (
    <>
      <GalleryWrapper>
        <MainImageWrapper onClick={() => openLightbox(active)}>
          <LazyImage src={images[active]} alt="Produto" eager />
          <ZoomHint><ZoomIn size={12} /> Ampliar</ZoomHint>
        </MainImageWrapper>

        {images.length > 1 && (
          <Thumbnails>
            {images.map((src, idx) => (
              <Thumb
                key={idx}
                src={src}
                alt={`Foto ${idx + 1}`}
                loading="lazy"
                decoding="async"
                $active={idx === active}
                onClick={() => setActive(idx)}
              />
            ))}
          </Thumbnails>
        )}
      </GalleryWrapper>

      {lightbox && createPortal(
        <Overlay onClick={closeLightbox}>
          <LightboxImg
            src={images[lbIndex]}
            alt={`Foto ${lbIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
          />

          <CloseBtn onClick={closeLightbox} aria-label="Fechar"><X size={20} /></CloseBtn>

          {images.length > 1 && (
            <>
              <NavBtn $side="left" onClick={(e) => { e.stopPropagation(); prev() }} aria-label="Anterior">
                <ChevronLeft size={22} />
              </NavBtn>
              <NavBtn $side="right" onClick={(e) => { e.stopPropagation(); next() }} aria-label="Próxima">
                <ChevronRight size={22} />
              </NavBtn>
              <Dots>
                {images.map((_, i) => <Dot key={i} $active={i === lbIndex} />)}
              </Dots>
            </>
          )}
        </Overlay>,
        document.body,
      )}
    </>
  )
}
