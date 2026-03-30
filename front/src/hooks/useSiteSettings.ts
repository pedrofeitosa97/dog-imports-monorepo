import { useContext } from 'react'
import { SiteSettingsContext } from '../contexts/SiteSettingsContext'

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}
