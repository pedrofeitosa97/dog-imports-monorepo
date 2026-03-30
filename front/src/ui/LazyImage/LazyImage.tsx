import { useState, type ImgHTMLAttributes } from 'react'
import styled, { keyframes, css } from 'styled-components'

/* ── shimmer animation ───────────────────────────────────────────────────── */

/*
 * Usar transform: translateX ao invés de background-position
 * para manter a animação na camada de compositing (GPU) e evitar repaints.
 */
const shimmer = keyframes`
  from { transform: translateX(-100%); }
  to   { transform: translateX(100%); }
`

/* ── styled ──────────────────────────────────────────────────────────────── */

const Wrapper = styled.div<{ $radius?: string }>`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: ${({ $radius }) => $radius ?? '0'};
  background: rgba(255, 255, 255, 0.05);
`

const Skeleton = styled.div<{ $visible: boolean }>`
  position: absolute;
  inset: 0;
  overflow: hidden;
  transition: opacity 280ms ease;
  opacity: ${({ $visible }) => $visible ? 1 : 0};
  pointer-events: none;
  z-index: 1;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.08) 50%,
      transparent 100%
    );
    animation: ${shimmer} 1.5s infinite ease-in-out;
    will-change: transform;
  }
`

const Img = styled.img<{ $loaded: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: opacity 350ms ease;
  opacity: ${({ $loaded }) => $loaded ? 1 : 0};

  ${({ $loaded }) => !$loaded && css`
    position: absolute;
    inset: 0;
  `}
`

/* ── component ───────────────────────────────────────────────────────────── */

interface LazyImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'loading'> {
  src: string
  alt: string
  eager?: boolean
  borderRadius?: string
  fallback?: string
}

export default function LazyImage({
  src,
  alt,
  eager = false,
  borderRadius,
  fallback = '/placeholder.jpg',
  className,
  style,
  ...rest
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  const imgSrc = errored ? fallback : src

  return (
    <Wrapper $radius={borderRadius} className={className} style={style}>
      <Skeleton $visible={!loaded} />
      <Img
        src={imgSrc}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={eager ? 'high' : 'auto'}
        $loaded={loaded}
        onLoad={() => setLoaded(true)}
        onError={() => { setErrored(true); setLoaded(true) }}
        {...rest}
      />
    </Wrapper>
  )
}
