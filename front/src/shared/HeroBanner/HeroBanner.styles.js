import styled from 'styled-components'

export const BannerWrapper = styled.div`
  position: relative;
  height: 560px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.textPrimary};
`

export const Slide = styled.div`
  position: absolute;
  inset: 0;
  opacity: ${({ active }) => active ? 1 : 0};
  transition: opacity 800ms ease;
  pointer-events: ${({ active }) => active ? 'auto' : 'none'};
`

export const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const SlideOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 60%);
`

export const SlideContent = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: ${({ theme }) => `0 ${theme.spacing[16]}`};
  gap: ${({ theme }) => theme.spacing[4]};
  max-width: 600px;
`

export const SlideTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.size['3xl']};
  font-weight: ${({ theme }) => theme.typography.weight.extrabold};
  color: #fff;
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
`

export const SlideSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.size.md};
  color: rgba(255,255,255,0.85);
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`

export const NavBtn = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ side }) => side === 'left' ? 'left: 24px;' : 'right: 24px;'}
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.2);
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.fast};
  backdrop-filter: blur(4px);

  &:hover {
    background: rgba(255,255,255,0.35);
  }
`

export const DotsRow = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`

export const Dot = styled.button`
  width: ${({ active }) => active ? '24px' : '8px'};
  height: 8px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ active }) => active ? '#fff' : 'rgba(255,255,255,0.5)'};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
`
