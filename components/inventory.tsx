'use client'

import {
  Apple,
  Beef,
  Box,
  CalendarDays,
  Edit3,
  Package,
  Snowflake,
  Trash2,
  Wheat,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ExpiryStatus, FoodItem } from '@/lib/types'
import {
  formatExpiryDate,
  getExpiryLabel,
  getExpiryStatus,
} from '@/lib/date-utils'
import { useLanguage } from '@/lib/i18n/language-context'

const icons = {
  Vegetables: Apple,
  Fruits: Apple,
  Dairy: Package,
  Meat: Beef,
  Grains: Wheat,
  Other: Box,
}

const statusStyles: Record<ExpiryStatus, string> = {
  expired: 'status-badge status-expired',
  soon: 'status-badge status-soon',
  fresh: 'status-badge status-fresh',
}

export function ExpiryBadge({ item }: { item: FoodItem }) {
  const { t } = useLanguage()
  const status = getExpiryStatus(item.expiryDate)

  const labelKey =
    status === 'expired'
      ? 'inventory.expired'
      : status === 'soon'
        ? 'inventory.useSoon'
        : 'inventory.fresh'

  return (
    <span className={statusStyles[status]}>
      {t(labelKey)}
    </span>
  )
}

export function FoodCard({
  item,
  onEdit,
  onDelete,
}: {
  item: FoodItem
  onEdit: () => void
  onDelete: () => void
}) {
  const { t, language } = useLanguage()

  const Icon = icons[item.category] || Box
  const status = getExpiryStatus(item.expiryDate)

  return (
    <article className={`food-row food-row-${status}`}>
      <div className="flex min-w-0 items-center gap-3">
        <div className={`category-icon category-icon-${status}`}>
          <Icon aria-hidden="true" />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold">
              {item.name}
            </h3>

            <ExpiryBadge item={item} />
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            {item.quantity} {t(`units.${item.unit}`)}
            <span className="mx-1 text-border">·</span>
            {t(`categories.${item.category}`)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-3 sm:border-0 sm:pt-0">
        <div className="text-right">
          <p className="text-xs font-medium">
            {getExpiryLabel(item.expiryDate, language)}
          </p>

          <p className="mt-0.5 flex items-center justify-end gap-1 text-[11px] text-muted-foreground">
            <CalendarDays className="size-3" />
            {formatExpiryDate(item.expiryDate, language)}
            <span>·</span>
            {t(`locations.${item.location}`)}
          </p>
        </div>

        <div className="flex gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            aria-label={t('inventory.edit', { name: item.name })}
          >
            <Edit3 />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
            onClick={onDelete}
            aria-label={t('inventory.delete', { name: item.name })}
          >
            <Trash2 />
          </Button>
        </div>
      </div>
    </article>
  )
}

export function EmptyState({
  filtered,
  onAdd,
}: {
  filtered: boolean
  onAdd: () => void
}) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Snowflake className="size-6" />
      </div>

      <h3 className="text-lg font-semibold">
        {filtered
          ? t('inventory.noMatch')
          : t('inventory.empty')}
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        {filtered
          ? t('inventory.noMatchHint')
          : t('inventory.emptyHint')}
      </p>

      {!filtered && (
        <Button
          className="mt-6 rounded-xl"
          onClick={onAdd}
        >
          {t('inventory.addFirst')}
        </Button>
      )}
    </div>
  )
}