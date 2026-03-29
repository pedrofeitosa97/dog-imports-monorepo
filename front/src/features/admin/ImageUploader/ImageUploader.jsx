import { useRef } from 'react'
import { Upload, X, Star } from 'lucide-react'
import Badge from '../../../ui/Badge/Badge'
import {
  UploaderWrapper,
  DropZone,
  DropText,
  PreviewGrid,
  PreviewItem,
  PreviewImg,
  RemoveImageBtn,
  CoverBadge,
  HiddenInput,
} from './ImageUploader.styles'

export default function ImageUploader({ images = [], onAdd, onRemove, maxFiles = 8 }) {
  const inputRef = useRef(null)

  const handleFiles = (files) => {
    const previews = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }))
    onAdd(previews)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e) => e.preventDefault()

  return (
    <UploaderWrapper>
      {images.length < maxFiles && (
        <DropZone
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <Upload size={24} />
          <DropText>
            Arraste as fotos aqui ou <strong>clique para selecionar</strong>
          </DropText>
          <DropText style={{ fontSize: '12px', opacity: 0.6 }}>
            {images.length}/{maxFiles} imagens • JPG, PNG, WEBP
          </DropText>
          <HiddenInput
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </DropZone>
      )}

      {images.length > 0 && (
        <PreviewGrid>
          {images.map((img, idx) => (
            <PreviewItem key={idx}>
              <PreviewImg src={img.preview || img.url} alt={`Foto ${idx + 1}`} />
              {idx === 0 && (
                <CoverBadge>
                  <Badge variant="dark" size="sm">Capa</Badge>
                </CoverBadge>
              )}
              <RemoveImageBtn onClick={() => onRemove(idx)} type="button">
                <X size={14} />
              </RemoveImageBtn>
            </PreviewItem>
          ))}
        </PreviewGrid>
      )}
    </UploaderWrapper>
  )
}
