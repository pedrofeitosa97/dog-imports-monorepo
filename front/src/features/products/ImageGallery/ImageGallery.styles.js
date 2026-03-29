import styled from 'styled-components'

export const GalleryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`

export const MainImage = styled.img`
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.surface};
`

export const Thumbnails = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  overflow-x: auto;
`

export const Thumb = styled.img`
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  border: 2px solid ${({ theme, active }) => active ? theme.colors.brand : 'transparent'};
  cursor: pointer;
  flex-shrink: 0;
  opacity: ${({ active }) => active ? 1 : 0.6};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 1;
  }
`
