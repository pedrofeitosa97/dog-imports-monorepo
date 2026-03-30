import styled from 'styled-components'

export const BannerOuter = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 clamp(16px, 5vw, 64px) 0;
`

export const BannerWrapper = styled.div`
  position: relative;
  height: clamp(300px, 44vh, 460px);
  overflow: hidden;
  background: #080808;
  border-radius: ${({ theme }) => theme.borderRadius.md};
`

export const Slide = styled.div<{ $active?: boolean }>`
  position: absolute;
  inset: 0;
  opacity: ${({ $active }) => $active ? 1 : 0};
  transition: opacity 800ms ease;
  pointer-events: ${({ $active }) => $active ? 'auto' : 'none'};
`

export const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
`

export const SlideOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    100deg,
    rgba(0,0,0,0.72) 0%,
    rgba(0,0,0,0.28) 50%,
    rgba(0,0,0,0.06) 100%
  );
`

export const SlideContent = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 clamp(20px, 7vw, 96px);
  gap: 12px;
  max-width: 580px;
`

export const SlideEyebrow = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.brand};
  letter-spacing: 0.12em;
  text-transform: uppercase;
`

export const SlideTitle = styled.h1`
  font-size: clamp(1.6rem, 3.8vw, 2.8rem);
  font-weight: 800;
  color: #ffffff;
  line-height: 1.12;
  letter-spacing: -0.02em;
`

export const SlideSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: rgba(255,255,255,0.65);
  line-height: 1.55;
  max-width: 380px;
`

export const NavBtn = styled.button<{ $side: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ $side }) => $side === 'left' ? 'left: 16px;' : 'right: 16px;'}
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.10);
  color: rgba(255,255,255,0.8);
  border-radius: 50%;
  cursor: pointer;
  transition: all 140ms ease;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.15);

  &:hover {
    background: #f97316;
    border-color: transparent;
    color: #fff;
  }

  @media (max-width: 768px) { display: none; }
`

export const DotsRow = styled.div`
  position: absolute;
  bottom: 16px;
  left: clamp(20px, 7vw, 96px);
  display: flex;
  gap: 6px;
`

export const Dot = styled.button<{ $active?: boolean }>`
  width: ${({ $active }) => $active ? '20px' : '6px'};
  height: 6px;
  border-radius: 999px;
  background: ${({ $active }) => $active ? '#f97316' : 'rgba(255,255,255,0.35)'};
  cursor: pointer;
  transition: all 240ms ease;

  &:hover {
    background: ${({ $active }) => $active ? '#f97316' : 'rgba(255,255,255,0.6)'};
  }
`
