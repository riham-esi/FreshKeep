'use client'

import { useEffect, useMemo, useState } from 'react'
import { Check, CircleAlert, Moon, Plus, Search, Sun, Trash2, Utensils } from 'lucide-react'
import { FreshKeepLogo } from '@/components/freshkeep-logo'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useLanguage } from '@/lib/i18n/language-context'
import { Button } from '@/components/ui/button'
import { EmptyState, FoodCard } from '@/components/inventory'
import { FoodForm } from '@/components/food-form'
import { MealSuggestionPanel } from '@/components/meal-suggestion'
import { getExpiryStatus, sortByExpiry } from '@/lib/date-utils'
import { createId, loadInventory, saveInventory } from '@/lib/storage'
import type { FoodFormValues, FoodItem } from '@/lib/types'

type Filter = 'all' | 'soon' | 'expired' | 'fresh'

export default function Page() {
  const { t, language } = useLanguage()
  const [inventory, setInventory] = useState<FoodItem[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('All locations')
  const [sort, setSort] = useState<'soonest' | 'latest' | 'name'>('soonest')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<FoodItem | null>(null)
  const [deleting, setDeleting] = useState<FoodItem | null>(null)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => { setInventory(loadInventory()); setHydrated(true); const stored = window.localStorage.getItem('freshkeep-theme') as 'light' | 'dark' | null; const next = stored || 'light'; setTheme(next); document.documentElement.classList.toggle('dark', next === 'dark') }, [])
  useEffect(() => { if (hydrated) saveInventory(inventory) }, [inventory, hydrated])
  const toggleTheme = () => { const next = theme === 'light' ? 'dark' : 'light'; setTheme(next); document.documentElement.classList.toggle('dark', next === 'dark'); window.localStorage.setItem('freshkeep-theme', next) }
  const stats = useMemo(() => ({ total: inventory.length, soon: inventory.filter(item => getExpiryStatus(item.expiryDate) === 'soon').length, expired: inventory.filter(item => getExpiryStatus(item.expiryDate) === 'expired').length, fresh: inventory.filter(item => getExpiryStatus(item.expiryDate) === 'fresh').length }), [inventory])
  const filtered = useMemo(() => sortByExpiry(inventory.filter(item => (filter === 'all' || getExpiryStatus(item.expiryDate) === filter) && (location === 'All locations' || item.location === location) && item.name.toLowerCase().includes(query.toLowerCase())), sort), [inventory, filter, location, query, sort])
  const openAdd = () => { setEditing(null); setFormOpen(true) }
  const save = (values: FoodFormValues) => { setInventory(current => editing ? current.map(item => item.id === editing.id ? { ...item, ...values } : item) : [...current, { ...values, id: createId(), createdAt: new Date().toISOString() }]); setFormOpen(false) }
  const selectStat = (nextFilter: Filter) => { setFilter(nextFilter); if (nextFilter === 'all') { setQuery(''); setLocation('All locations') } document.getElementById('inventory-heading')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
  const statCards = [{ key: 'all' as Filter, label: t('dashboard.total'), value: stats.total, icon: Utensils, tone: 'neutral' }, { key: 'soon' as Filter, label: t('dashboard.soon'), value: stats.soon, icon: CircleAlert, tone: 'coral' }, { key: 'expired' as Filter, label: t('dashboard.expired'), value: stats.expired, icon: Trash2, tone: 'muted' }, { key: 'fresh' as Filter, label: t('dashboard.fresh'), value: stats.fresh, icon: Check, tone: 'green' }]
  return <main className="min-h-screen bg-background">
    <header className="border-b border-border/70 bg-card/80 backdrop-blur"><div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 lg:px-10"><div dir="ltr" className="flex shrink-0 items-center gap-3"><FreshKeepLogo className="h-10 w-[152px]" /><span className="sr-only">Use what you have. Waste less.</span></div><div className="flex items-center gap-2"><LanguageSwitcher /><Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={t('navigation.switchTheme', { theme: t(`common.${theme === 'light' ? 'dark' : 'light'}`) })} className="rounded-xl text-muted-foreground">{theme === 'light' ? <Moon /> : <Sun />}</Button><Button onClick={openAdd} className="rounded-xl"><Plus data-icon="inline-start" />  {t('navigation.addFood')}</Button></div></div></header>
    <div className="mx-auto max-w-[1440px] px-5 py-8 lg:px-10 lg:py-10"><div className="mb-7 flex flex-col gap-2"><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{t('dashboard.eyebrow')}</p><div className="flex flex-col justify-between gap-3 md:flex-row md:items-end"><div><h1 className="max-w-2xl text-3xl font-bold tracking-[-0.04em] text-balance sm:text-4xl">{t('dashboard.title')}</h1><p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{t('dashboard.subtitle')}</p></div></div></div>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Inventory overview">{statCards.map(({ key, label, value, icon: Icon, tone }) => <button key={key} onClick={() => selectStat(key)} className={`stat-card ${filter === key ? 'stat-card-active' : ''}`}><span><span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span><span className="mt-2 block text-3xl font-bold tracking-tight">{value}</span></span><span className={`stat-icon stat-icon-${tone}`}><Icon /></span></button>)}</section>
      <div className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,1fr)_360px]"><section aria-labelledby="inventory-heading"><div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h2 id="inventory-heading" className="text-xl font-bold tracking-tight">{t('dashboard.inventory')}</h2><p className="mt-1 text-sm text-muted-foreground">{filtered.length} {filtered.length === 1 ? t('dashboard.item') : t('dashboard.items')} {t('dashboard.inView')}</p></div><div className="flex flex-wrap gap-2"><button className={`filter-pill ${filter === 'all' ? 'filter-pill-active' : ''}`} onClick={() => setFilter('all')}>{t('inventory.all')}</button><button className={`filter-pill ${filter === 'soon' ? 'filter-pill-active' : ''}`} onClick={() => setFilter('soon')}>{t('inventory.useSoon')}</button><button className={`filter-pill ${filter === 'fresh' ? 'filter-pill-active' : ''}`} onClick={() => setFilter('fresh')}>{t('dashboard.fresh')}</button></div></div><div className="mb-4 flex flex-col gap-2 sm:flex-row"><label className="relative flex-1"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><input className="h-10 w-full rounded-xl border border-input bg-card pl-9 pr-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring" placeholder={t('inventory.search')} value={query} onChange={event => setQuery(event.target.value)} aria-label={t('inventory.searchLabel')} /></label>
<select
  className="h-10 rounded-xl border border-input bg-card px-3 text-sm outline-none"
  value={location}
  onChange={event => setLocation(event.target.value)}
  aria-label={t('inventory.location')}
>
  <option value="All locations">
    {t('inventory.allLocations')}
  </option>
  <option value="Fridge">
    {t('locations.Fridge')}
  </option>
  <option value="Freezer">
    {t('locations.Freezer')}
  </option>
  <option value="Pantry">
    {t('locations.Pantry')}
  </option>
</select>    
  <select className="h-10 rounded-xl border border-input bg-card px-3 text-sm outline-none" value={sort} onChange={event => setSort(event.target.value as typeof sort)} aria-label={t('inventory.sort')}><option value="soonest">{t('inventory.soonest')}</option><option value="latest">{t('inventory.latest')}</option><option value="name">{t('inventory.name')}</option></select></div><div className="flex flex-col gap-2">{filtered.map(item => <FoodCard key={item.id} item={item} onEdit={() => { setEditing(item); setFormOpen(true) }} onDelete={() => setDeleting(item)} />)}</div>{filtered.length === 0 && <EmptyState filtered={inventory.length > 0} onAdd={openAdd} />}</section><aside><MealSuggestionPanel inventory={inventory} /></aside></div>
    </div><FoodForm open={formOpen} item={editing} onClose={() => setFormOpen(false)} onSave={save} />
     {deleting && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    aria-labelledby="delete-title"
  >
    <div className="w-full max-w-sm rounded-3xl bg-card p-6 shadow-2xl">
      <h2 id="delete-title" className="text-xl font-bold">
        {t('inventory.removeTitle', { name: deleting.name })}
      </h2>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {t('inventory.removeDescription')}
      </p>

      <div className="mt-6 flex gap-3">
        <Button
          variant="outline"
          className="flex-1 rounded-xl"
          onClick={() => setDeleting(null)}
        >
          {t('inventory.cancel')}
        </Button>

        <Button
          variant="destructive"
          className="flex-1 rounded-xl"
          onClick={() => {
            setInventory(current =>
              current.filter(item => item.id !== deleting.id)
            )
            setDeleting(null)
          }}
        >
          {t('inventory.remove')}
        </Button>
      </div>
    </div>
  </div>
)}
  </main>
}
