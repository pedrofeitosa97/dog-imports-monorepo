import { useState } from 'react'
import styled from 'styled-components'
import LazyImage from '../../../ui/LazyImage/LazyImage'
import { GalleryWrapper, Thumbnails, Thumb } from './ImageGallery.styles'

const MainImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};
`

interface ImageGalleryProps {
  images?: string[]
}

export default function ImageGallery({ images = [] }: ImageGalleryProps) {
  const [active, setActive] = useState(0)

  if (!images.length) return null

  return (
    <GalleryWrapper>
      <MainImageWrapper>
        <LazyImage
          src={images[active]}
          alt="Produto"
          eager
        />
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
  )
}
