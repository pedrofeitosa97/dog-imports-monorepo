import { useState, type ImgHTMLAttributes } from 'react'
import styled, { keyframes, css } from 'styled-components'

/* ── shimmer animation ───────────────────────────────────────────────────── */

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
`

/* ── styled ──────────────────────────────────────────────────────────────── */

const Wrapper = styled.div<{ $radius?: string }>`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: ${({ $radius }) => $radius ?? '0'};
`

const Skeleton = styled.div<{ $visible: boolean }>`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.04) 25%,
    rgba(255, 255, 255, 0.10) 50%,
    rgba(255, 255, 255, 0.04) 75%
  );
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s infinite linear;
  transition: opacity 300ms ease;
  opacity: ${({ $visible }) => $visible ? 1 : 0};
  pointer-events: none;
  z-index: 1;
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
