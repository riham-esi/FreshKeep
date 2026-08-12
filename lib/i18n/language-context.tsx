'use client'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { translations, type Language } from './translations'

type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void; t: (key: string, values?: Record<string, string | number>) => string; isRTL: boolean }
const LanguageContext = createContext<LanguageContextValue | null>(null)
function getValue(language: Language, key: string) { return key.split('.').reduce<unknown>((value, part) => value && typeof value === 'object' ? (value as Record<string, unknown>)[part] : undefined, translations[language]) }
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [ready, setReady] = useState(false)
  useEffect(() => { const stored = window.localStorage.getItem('freshkeep-language') as Language | null; const next = stored && stored in translations ? stored : 'en'; setLanguageState(next); document.documentElement.lang = next; document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr'; setReady(true) }, [])
  useEffect(() => { if (!ready) return; document.documentElement.lang = language; document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'; window.localStorage.setItem('freshkeep-language', language) }, [language, ready])
  const value = useMemo(() => ({ language, setLanguage: setLanguageState, isRTL: language === 'ar', t: (key: string, values?: Record<string, string | number>) => { let result = String(getValue(language, key) ?? getValue('en', key) ?? key); Object.entries(values ?? {}).forEach(([name, replacement]) => { result = result.replace(`{${name}}`, String(replacement)) }); return result } }), [language])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
export function useLanguage() { const context = useContext(LanguageContext); if (!context) throw new Error('useLanguage must be used within LanguageProvider'); return context }
