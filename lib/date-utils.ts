import type { ExpiryStatus, FoodItem } from './types'
import type { Language } from './i18n/translations'

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function daysUntil(dateString: string, now = new Date()) {
  const target = startOfDay(new Date(`${dateString}T00:00:00`))
  return Math.round(
    (target.getTime() - startOfDay(now).getTime()) / 86400000
  )
}

export function getExpiryStatus(dateString: string): ExpiryStatus {
  const days = daysUntil(dateString)

  if (days < 0) return 'expired'
  if (days <= 3) return 'soon'
  return 'fresh'
}

export function getExpiryLabel(
  dateString: string,
  language: Language = 'en'
) {
  const days = daysUntil(dateString)

  if (language === 'fr') {
    if (days < 0) {
      const count = Math.abs(days)
      return `Périmé il y a ${count} jour${count > 1 ? 's' : ''}`
    }

    if (days === 0) return "Expire aujourd'hui"
    if (days === 1) return 'Expire demain'

    return `Expire dans ${days} jours`
  }

  if (language === 'ar') {
    if (days < 0) {
      const count = Math.abs(days)
      return `انتهت الصلاحية منذ ${count} ${count === 1 ? 'يوم' : 'أيام'}`
    }

    if (days === 0) return 'تنتهي اليوم'
    if (days === 1) return 'تنتهي غداً'

    return `تنتهي خلال ${days} أيام`
  }

  if (days < 0) {
    const count = Math.abs(days)
    return `Expired ${count} day${count === 1 ? '' : 's'} ago`
  }

  if (days === 0) return 'Expires today'
  if (days === 1) return 'Expires tomorrow'

  return `Expires in ${days} days`
}

export function formatExpiryDate(
  dateString: string,
  language: Language = 'en'
) {
  const locale =
    language === 'fr'
      ? 'fr-FR'
      : language === 'ar'
        ? 'ar-DZ'
        : 'en-US'

  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${dateString}T00:00:00`))
}

export function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10)
}

export function dateFromToday(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return toDateInputValue(date)
}

export function sortByExpiry(
  items: FoodItem[],
  direction: 'soonest' | 'latest' | 'name'
) {
  return [...items].sort((a, b) =>
    direction === 'name'
      ? a.name.localeCompare(b.name)
      : direction === 'soonest'
        ? a.expiryDate.localeCompare(b.expiryDate)
        : b.expiryDate.localeCompare(a.expiryDate)
  )
}