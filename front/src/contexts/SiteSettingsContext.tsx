import { createContext, useEffect, useState, type ReactNode } from 'react'
import { settingsService } from '../services/settingsService'
import type { SiteSettings } from '../types/api'

interface SiteSettingsContextValue {
  settings: SiteSettings
  refresh: () => void
}

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: {},
  refresh: () => undefined,
})

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({})

  const load = () => {
    settingsService.getAll()
      .then(setSettings)
      .catch(() => setSettings({}))
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    if (!settings.favicon) return
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    link.href = settings.favicon
  }, [settings.favicon])

  return (
    <SiteSettingsContext.Provider value={{ settings, refresh: load }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export { SiteSettingsContext }
