import { useState } from 'react'
import { GalleryWrapper, MainImage, Thumbnails, Thumb } from './ImageGallery.styles'

export default function ImageGallery({ images = [] }) {
  const [active, setActive] = useState(0)

  if (!images.length) return null

  return (
    <GalleryWrapper>
      <MainImage src={images[active]} alt="Produto" />
      {images.length > 1 && (
        <Thumbnails>
          {images.map((src, idx) => (
            <Thumb
              key={idx}
              src={src}
              alt={`Foto ${idx + 1}`}
              active={idx === active}
              onClick={() => setActive(idx)}
            />
          ))}
        </Thumbnails>
      )}
    </GalleryWrapper>
  )
}
