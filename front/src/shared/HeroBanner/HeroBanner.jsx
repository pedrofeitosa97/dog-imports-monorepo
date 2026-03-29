import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from '../../ui/Button/Button'
import {
  BannerWrapper,
  Slide,
  SlideImage,
  SlideOverlay,
  SlideContent,
  SlideTitle,
  SlideSubtitle,
  NavBtn,
  DotsRow,
  Dot,
} from './HeroBanner.styles'

const defaultSlides = [
  { id: 1, imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1440&q=80', title: 'Nova Coleção', subtitle: 'As melhores marcas de grife importadas', cta: 'Ver coleção', to: '/produtos' },
  { id: 2, imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1440&q=80', title: 'Lançamentos', subtitle: 'As últimas tendências direto das passarelas', cta: 'Comprar agora', to: '/produtos?sortBy=newest' },
  { id: 3, imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1440&q=80', title: 'Estilo exclusivo', subtitle: 'Autenticidade garantida em cada peça', cta: 'Explorar', to: '/produtos' },
]

export default function HeroBanner({ slides = defaultSlides, autoPlay = true, interval = 5000 }) {
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
        <Slide key={slide.id} active={idx === active}>
          <SlideImage src={slide.imageUrl} alt={slide.title} />
          <SlideOverlay />
          <SlideContent>
            <SlideTitle>{slide.title}</SlideTitle>
            <SlideSubtitle>{slide.subtitle}</SlideSubtitle>
            <Button as="a" href={slide.to} variant="secondary" size="lg" style={{ color: '#fff', borderColor: '#fff' }}>
              {slide.cta}
            </Button>
          </SlideContent>
        </Slide>
      ))}

      <NavBtn side="left" onClick={() => go(active - 1)}>
        <ChevronLeft size={28} />
      </NavBtn>
      <NavBtn side="right" onClick={() => go(active + 1)}>
        <ChevronRight size={28} />
      </NavBtn>

      <DotsRow>
        {slides.map((_, idx) => (
          <Dot key={idx} active={idx === active} onClick={() => go(idx)} />
        ))}
      </DotsRow>
    </BannerWrapper>
  )
}
