import { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from '../../ui/Button/Button'
import { bannerService } from '../../services/bannerService'
import type { Banner } from '../../types/api'
import {
  BannerOuter, BannerWrapper, Slide, SlideImage, SlideOverlay, SlideContent,
  SlideEyebrow, SlideTitle, SlideSubtitle, NavBtn, DotsRow, Dot,
} from './HeroBanner.styles'

const FALLBACK_SLIDES: Banner[] = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1440&q=80',
    eyebrow: 'Nova coleção 2025',
    title: 'Estilo que\nfala por você',
    subtitle: 'As melhores marcas de grife importadas com autenticidade garantida.',
    cta: 'Ver coleção',
    ctaUrl: '/produtos',
    order: 0,
    isActive: true,
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1440&q=80',
    eyebrow: 'Lançamentos',
    title: 'Últimas\ntendências',
    subtitle: 'Direto das passarelas internacionais para o seu guarda-roupa.',
    cta: 'Comprar agora',
    ctaUrl: '/produtos?sortBy=newest',
    order: 1,
    isActive: true,
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1440&q=80',
    eyebrow: 'Exclusividade',
    title: 'Cada peça,\numa história',
    subtitle: 'Autenticidade e qualidade em cada item da nossa curadoria.',
    cta: 'Explorar',
    ctaUrl: '/produtos',
    order: 2,
    isActive: true,
  },
]

interface HeroBannerProps {
  autoPlay?: boolean
  interval?: number
}

export default function HeroBanner({ autoPlay = true, interval = 5500 }: HeroBannerProps) {
  const [slides, setSlides] = useState<Banner[]>(FALLBACK_SLIDES)
  const [active, setActive] = useState(0)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    bannerService.getActive()
      .then((data) => { if (data.length > 0) setSlides(data) })
      .catch(() => { /* fallback já definido */ })
  }, [])

  const startTimer = useCallback(() => {
    if (!autoPlay) return
    timer.current = setInterval(() => {
      setActive((a) => (a + 1) % slides.length)
    }, interval)
  }, [autoPlay, interval, slides.length])

  useEffect(() => {
    startTimer()
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [startTimer])

  const go = (idx: number) => {
    if (timer.current) clearInterval(timer.current)
    setActive((idx + slides.length) % slides.length)
    startTimer()
  }

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
    </BannerWrapper>
    </BannerOuter>
  )
}
