'use client'
import { useLanguage } from '@/lib/i18n/language-context'
import type { Language } from '@/lib/i18n/translations'
export function LanguageSwitcher() { const { language, setLanguage } = useLanguage(); return <label className="flex items-center"> <span className="sr-only">Language</span><select className="h-9 rounded-xl border border-input bg-card px-2 text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring" value={language} onChange={event => setLanguage(event.target.value as Language)} aria-label="Language"><option value="en">🇬🇧 English</option><option value="fr">🇫🇷 Français</option><option value="ar">🇩🇿 العربية</option></select></label> }
