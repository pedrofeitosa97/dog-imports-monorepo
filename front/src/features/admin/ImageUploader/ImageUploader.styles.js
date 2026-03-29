import styled from 'styled-components'

export const UploaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`

export const DropZone = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[8]};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.brand};
    color: ${({ theme }) => theme.colors.textPrimary};
    background: ${({ theme }) => theme.colors.surface};
  }
`

export const DropText = styled.p`
  font-size: ${({ theme }) => theme.typography.size.sm};
  text-align: center;
`

export const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing[3]};
`

export const PreviewItem = styled.div`
  position: relative;
  aspect-ratio: 1/1;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
`

export const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const CoverBadge = styled.div`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing[1]};
  left: ${({ theme }) => theme.spacing[1]};
`

export const RemoveImageBtn = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing[1]};
  right: ${({ theme }) => theme.spacing[1]};
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.6);
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.accentRed};
  }
`

export const HiddenInput = styled.input`
  display: none;
`
