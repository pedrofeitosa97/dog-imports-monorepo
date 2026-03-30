import styled, { keyframes } from 'styled-components'
import { media } from '../../../styles/mixins'

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing[4]};

  ${media.md`
    grid-template-columns: repeat(3, 1fr);
  `}
`

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`

export const SkeletonCard = styled.div`
  aspect-ratio: 3/4;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surface} 25%,
    #ebebeb 50%,
    ${({ theme }) => theme.colors.surface} 75%
  );
  background-size: 800px 100%;
  animation: ${shimmer} 1.5s infinite linear;
`

export const EmptyMessage = styled.p`
  padding: ${({ theme }) => theme.spacing[12]};
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.size.md};
`
