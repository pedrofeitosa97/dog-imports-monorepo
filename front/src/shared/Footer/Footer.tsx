import { Link } from 'react-router-dom'
import { useSiteSettings } from '../../hooks/useSiteSettings'
import {
  FooterWrapper, FooterGrid, FooterBrand, FooterTagline,
  FooterCol, FooterTitle, FooterLink, FooterBottom, Copyright, FooterAccent,
} from './Footer.styles'

export default function Footer() {
  const { settings } = useSiteSettings()
  const footerLogo = settings.logo_footer || '/logo.png'

  return (
    <FooterWrapper>
      <FooterGrid>
        <FooterBrand>
          <img src={footerLogo} alt="Dog Imports" />
          <FooterTagline>
            Roupas importadas e marcas de grife com autenticidade garantida. Estilo que fala por você.
          </FooterTagline>
        </FooterBrand>

        <FooterCol>
          <FooterTitle>Comprar</FooterTitle>
          <FooterLink as={Link} to="/produtos">Todos os produtos</FooterLink>
          <FooterLink as={Link} to="/categorias/masculino">Masculino</FooterLink>
          <FooterLink as={Link} to="/categorias/feminino">Feminino</FooterLink>
          <FooterLink as={Link} to="/produtos?sortBy=newest">Novidades</FooterLink>
        </FooterCol>

        <FooterCol>
          <FooterTitle>Ajuda</FooterTitle>
          <FooterLink>Guia de tamanhos</FooterLink>
          <FooterLink as={Link} to="/politica-de-trocas">Política de trocas</FooterLink>
          <FooterLink>Rastrear pedido</FooterLink>
          <FooterLink>Contato</FooterLink>
        </FooterCol>

        <FooterCol>
          <FooterTitle>Dog Imports</FooterTitle>
          <FooterLink as={Link} to="/sobre-nos">Sobre nós</FooterLink>
          <FooterLink as={Link} to="/sobre-nos#pilares">Autenticidade</FooterLink>
          <FooterLink as={Link} to="/admin">Admin</FooterLink>
        </FooterCol>
      </FooterGrid>

      <FooterBottom>
        <Copyright>
          © {new Date().getFullYear()} <FooterAccent>Dog Imports</FooterAccent>. Todos os direitos reservados.
        </Copyright>
        <Copyright>Feito com dedicação.</Copyright>
      </FooterBottom>
    </FooterWrapper>
  )
}
