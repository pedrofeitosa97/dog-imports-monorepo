import { Link } from 'react-router-dom'
import { FooterWrapper, FooterGrid, FooterCol, FooterTitle, FooterLink, FooterBottom, Copyright } from './Footer.styles'

export default function Footer() {
  return (
    <FooterWrapper>
      <FooterGrid>
        <FooterCol>
          <FooterTitle>DOG IMPORTS</FooterTitle>
          <FooterLink>Roupas importadas e marcas de grife com autenticidade garantida.</FooterLink>
        </FooterCol>

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
          <FooterLink>Política de trocas</FooterLink>
          <FooterLink>Rastrear pedido</FooterLink>
          <FooterLink>Contato</FooterLink>
        </FooterCol>

        <FooterCol>
          <FooterTitle>Dog Imports</FooterTitle>
          <FooterLink>Sobre nós</FooterLink>
          <FooterLink>Autenticidade</FooterLink>
          <FooterLink as={Link} to="/admin">Admin</FooterLink>
        </FooterCol>
      </FooterGrid>

      <FooterBottom>
        <Copyright>© {new Date().getFullYear()} Dog Imports. Todos os direitos reservados.</Copyright>
      </FooterBottom>
    </FooterWrapper>
  )
}
