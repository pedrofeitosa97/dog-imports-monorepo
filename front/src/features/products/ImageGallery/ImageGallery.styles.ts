import styled from 'styled-components'

export const GalleryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};

  @media (min-width: 768px) {
    flex-direction: row-reverse;
    gap: ${({ theme }) => theme.spacing[3]};
    align-items: flex-start;
  }
`

export const Thumbnails = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  overflow-x: auto;

  @media (min-width: 768px) {
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 560px;
    width: 80px;
    flex-shrink: 0;
  }
`

export const Thumb = styled.img<{ $active?: boolean }>`
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  border: 2px solid ${({ theme, $active }) => $active ? theme.colors.brand : 'transparent'};
  cursor: pointer;
  flex-shrink: 0;
  opacity: ${({ $active }) => $active ? 1 : 0.55};
  transition: all ${({ theme }) => theme.transitions.fast};

  @media (min-width: 768px) {
    width: 76px;
    height: 92px;
  }

  &:hover {
    opacity: 1;
  }
`
