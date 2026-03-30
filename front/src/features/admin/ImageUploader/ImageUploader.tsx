import { useRef, type DragEvent, type ChangeEvent } from 'react'
import { Upload, X } from 'lucide-react'
import Badge from '../../../ui/Badge/Badge'
import { getImageUrl } from '../../../utils/getImageUrl'
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

export interface ImagePreview {
  file?: File
  preview?: string
  url?: string
  name?: string
}

interface ImageUploaderProps {
  images?: ImagePreview[]
  onAdd: (images: ImagePreview[]) => void
  onRemove: (idx: number) => void
  maxFiles?: number
}

export default function ImageUploader({ images = [], onAdd, onRemove, maxFiles = 8 }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    const previews: ImagePreview[] = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }))
    onAdd(previews)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault()

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
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files)}
          />
        </DropZone>
      )}

      {images.length > 0 && (
        <PreviewGrid>
          {images.map((img, idx) => (
            <PreviewItem key={idx}>
              <PreviewImg src={getImageUrl(img.preview) ?? getImageUrl(img.url) ?? ''} alt={`Foto ${idx + 1}`} />
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
