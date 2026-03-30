import styled from 'styled-components'

export const BannerWrapper = styled.div`
  position: relative;
  height: clamp(480px, 70vh, 680px);
  overflow: hidden;
  background: #080808;
`

export const Slide = styled.div`
  position: absolute;
  inset: 0;
  opacity: ${({ $active }) => $active ? 1 : 0};
  transition: opacity 900ms ease;
  pointer-events: ${({ $active }) => $active ? 'auto' : 'none'};
`

export const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const SlideOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    rgba(0,0,0,0.75) 0%,
    rgba(0,0,0,0.35) 55%,
    rgba(0,0,0,0.10) 100%
  );
`

export const SlideContent = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 clamp(24px, 8vw, 112px);
  gap: ${({ theme }) => theme.spacing[5]};
  max-width: 680px;
`

export const SlideEyebrow = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.colors.brand};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wider};
  text-transform: uppercase;
`

export const SlideTitle = styled.h1`
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: ${({ theme }) => theme.typography.weight.extrabold};
  color: #ffffff;
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
`

export const SlideSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.size.md};
  color: rgba(255,255,255,0.75);
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  max-width: 480px;
`

export const NavBtn = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ $side }) => $side === 'left' ? 'left: 20px;' : 'right: 20px;'}
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.12);
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.fast};
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.2);

  &:hover {
    background: rgba(249,115,22,0.75);
    border-color: transparent;
  }

  @media (max-width: 768px) {
    display: none;
  }
`

export const DotsRow = styled.div`
  position: absolute;
  bottom: 24px;
  left: clamp(24px, 8vw, 112px);
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`

export const Dot = styled.button`
  width: ${({ $active }) => $active ? '28px' : '8px'};
  height: 8px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ $active }) => $active ? '#f97316' : 'rgba(255,255,255,0.4)'};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    background: ${({ $active }) => $active ? '#f97316' : 'rgba(255,255,255,0.7)'};
  }
`
