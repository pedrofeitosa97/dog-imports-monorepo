import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from '../../ui/Button/Button'
import {
  BannerWrapper,
  Slide,
  SlideImage,
  SlideOverlay,
  SlideContent,
  SlideEyebrow,
  SlideTitle,
  SlideSubtitle,
  NavBtn,
  DotsRow,
  Dot,
} from './HeroBanner.styles'

const defaultSlides = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1440&q=80',
    eyebrow: 'Nova coleção 2025',
    title: 'Estilo que\nfala por você',
    subtitle: 'As melhores marcas de grife importadas com autenticidade garantida.',
    cta: 'Ver coleção',
    to: '/produtos',
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1440&q=80',
    eyebrow: 'Lançamentos',
    title: 'Últimas\ntendências',
    subtitle: 'Direto das passarelas internacionais para o seu guarda-roupa.',
    cta: 'Comprar agora',
    to: '/produtos?sortBy=newest',
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1440&q=80',
    eyebrow: 'Exclusividade',
    title: 'Cada peça,\numa história',
    subtitle: 'Autenticidade e qualidade em cada item da nossa curadoria.',
    cta: 'Explorar',
    to: '/produtos',
  },
]

export default function HeroBanner({ slides = defaultSlides, autoPlay = true, interval = 5500 }) {
  const [active, setActive] = useState(0)
  const timer = useRef(null)

  const startTimer = () => {
    if (!autoPlay) return
    timer.current = setInterval(() => {
      setActive((a) => (a + 1) % slides.length)
    }, interval)
  }

  useEffect(() => {
    startTimer()
    return () => clearInterval(timer.current)
  }, [slides.length, autoPlay, interval])

  const go = (idx) => {
    clearInterval(timer.current)
    setActive((idx + slides.length) % slides.length)
    startTimer()
  }

  return (
    <BannerWrapper>
      {slides.map((slide, idx) => (
        <Slide key={slide.id} $active={idx === active}>
          <SlideImage src={slide.imageUrl} alt={slide.title} />
          <SlideOverlay />
          <SlideContent>
            {slide.eyebrow && <SlideEyebrow>{slide.eyebrow}</SlideEyebrow>}
            <SlideTitle style={{ whiteSpace: 'pre-line' }}>{slide.title}</SlideTitle>
            <SlideSubtitle>{slide.subtitle}</SlideSubtitle>
            <div>
              <Button as="a" href={slide.to} variant="primary" size="lg">
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
  )
}
