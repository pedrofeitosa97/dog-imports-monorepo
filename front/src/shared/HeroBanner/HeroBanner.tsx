import { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from '../../ui/Button/Button'
import { bannerService } from '../../services/bannerService'
import type { Banner } from '../../types/api'
import {
  BannerOuter, BannerWrapper, BannerSkeleton,
  Slide, SlideImage, SlideOverlay, SlideContent,
  SlideEyebrow, SlideTitle, SlideSubtitle, NavBtn, DotsRow, Dot,
} from './HeroBanner.styles'

interface HeroBannerProps {
  autoPlay?: boolean
  interval?: number
}

export default function HeroBanner({ autoPlay = true, interval = 5500 }: HeroBannerProps) {
  const [slides, setSlides] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState(0)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    bannerService.getActive()
      .then((data) => setSlides(data))
      .catch(() => setSlides([]))
      .finally(() => setLoading(false))
  }, [])

  const startTimer = useCallback(() => {
    if (!autoPlay || slides.length <= 1) return
    timer.current = setInterval(() => {
      setActive((a) => (a + 1) % slides.length)
    }, interval)
  }, [autoPlay, interval, slides.length])

  useEffect(() => {
    startTimer()
    return () => { if (timer.current) clearInterval(timer.current) }
  }, [startTimer])

  const go = (idx: number) => {
    if (timer.current) clearInterval(timer.current)
    setActive((idx + slides.length) % slides.length)
    startTimer()
  }

  if (loading) {
    return (
      <BannerOuter>
        <BannerSkeleton />
      </BannerOuter>
    )
  }

  if (!slides.length) return null

  return (
    <BannerOuter>
      <BannerWrapper>
        {slides.map((slide, idx) => (
          <Slide key={slide.id} $active={idx === active}>
            <SlideImage
              src={slide.imageUrl}
              alt={slide.title}
              loading={idx === 0 ? 'eager' : 'lazy'}
              decoding={idx === 0 ? 'sync' : 'async'}
              fetchPriority={idx === 0 ? 'high' : 'auto'}
            />
            <SlideOverlay />
            <SlideContent>
              {slide.eyebrow && <SlideEyebrow>{slide.eyebrow}</SlideEyebrow>}
              <SlideTitle style={{ whiteSpace: 'pre-line' }}>{slide.title}</SlideTitle>
              {slide.subtitle && <SlideSubtitle>{slide.subtitle}</SlideSubtitle>}
              <div>
                <Button as="a" href={slide.ctaUrl} variant="primary" size="lg">
                  {slide.cta}
                </Button>
              </div>
            </SlideContent>
          </Slide>
        ))}

        {slides.length > 1 && (
          <>
            <NavBtn $side="left" onClick={() => go(active - 1)}>
              <ChevronLeft size={24} />
            </NavBtn>
            <NavBtn $side="right" onClick={() => go(active + 1)}>
              <ChevronRight size={24} />
            </NavBtn>
            <DotsRow>
              {slides.map((_, idx) => (
                <Dot key={idx} $active={idx === active} onClick={() => go(idx)} />
              ))}
            </DotsRow>
          </>
        )}
      </BannerWrapper>
    </BannerOuter>
  )
}
