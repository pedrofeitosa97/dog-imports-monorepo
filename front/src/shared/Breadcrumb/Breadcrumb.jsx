import { Link } from 'react-router-dom'
import { BreadcrumbWrapper, BreadcrumbItem, Separator } from './Breadcrumb.styles'

export default function Breadcrumb({ items = [] }) {
  return (
    <BreadcrumbWrapper aria-label="breadcrumb">
      {items.map((item, idx) => (
        <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {idx > 0 && <Separator>/</Separator>}
          <BreadcrumbItem
            as={item.to ? Link : 'span'}
            to={item.to}
            current={idx === items.length - 1}
          >
            {item.label}
          </BreadcrumbItem>
        </span>
      ))}
    </BreadcrumbWrapper>
  )
}
