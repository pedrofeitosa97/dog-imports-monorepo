import styled from 'styled-components'

export const UploaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const DropZone = styled.div`
  border: 1.5px dashed rgba(255,255,255,0.15);
  border-radius: 12px;
  padding: 36px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: rgba(255,255,255,0.4);
  transition: all 180ms ease;

  &:hover {
    border-color: rgba(255,255,255,0.35);
    background: rgba(255,255,255,0.03);
    color: rgba(255,255,255,0.7);
  }
`

export const DropText = styled.p`
  font-size: 13px;
  text-align: center;
  line-height: 1.5;

  strong { color: rgba(255,255,255,0.75); font-weight: 600; }
`

export const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;

  @media (max-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 400px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

export const PreviewItem = styled.div`
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
`

export const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const CoverBadge = styled.div`
  position: absolute;
  bottom: 6px;
  left: 6px;
`

export const RemoveImageBtn = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.7);
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  transition: background 150ms;

  &:hover { background: #ef4444; }
`

export const HiddenInput = styled.input`
  display: none;
`
