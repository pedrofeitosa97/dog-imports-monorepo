import { css } from 'styled-components'
import { theme } from './theme'

export const media = {
  xs: (...args) => css`@media (min-width: ${theme.breakpoints.xs}) { ${css(...args)} }`,
  sm: (...args) => css`@media (min-width: ${theme.breakpoints.sm}) { ${css(...args)} }`,
  md: (...args) => css`@media (min-width: ${theme.breakpoints.md}) { ${css(...args)} }`,
  lg: (...args) => css`@media (min-width: ${theme.breakpoints.lg}) { ${css(...args)} }`,
  xl: (...args) => css`@media (min-width: ${theme.breakpoints.xl}) { ${css(...args)} }`,
}

export const flexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const flexBetween = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const truncate = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const visuallyHidden = css`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`

export const hoverScale = css`
  transition: transform ${theme.transitions.normal};
  &:hover {
    transform: scale(1.02);
  }
`
