import { createContext, useEffect, useState, type ReactNode } from 'react'
import { settingsService } from '../services/settingsService'
import type { SiteSettings } from '../types/api'

interface SiteSettingsContextValue {
  settings: SiteSettings
  loaded: boolean
  refresh: () => void
}

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: {},
  loaded: false,
  refresh: () => undefined,
})

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({})
  const [loaded, setLoaded] = useState(false)

  const load = () => {
    settingsService.getAll()
      .then(setSettings)
      .catch(() => setSettings({}))
      .finally(() => setLoaded(true))
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
    <SiteSettingsContext.Provider value={{ settings, loaded, refresh: load }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export { SiteSettingsContext }
