'use client'

import { useEffect, useState } from 'react'
import { CalendarDays, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type {
  Category,
  FoodFormValues,
  FoodItem,
  Location,
  Unit,
} from '@/lib/types'
import { CATEGORIES, LOCATIONS, UNITS } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'

type Props = {
  open: boolean
  item?: FoodItem | null
  onClose: () => void
  onSave: (values: FoodFormValues) => void
}

const empty: FoodFormValues = {
  name: '',
  quantity: 1,
  unit: 'pieces',
  expiryDate: '',
  location: 'Fridge',
  category: 'Other',
}

export function FoodForm({ open, item, onClose, onSave }: Props) {
  const { t } = useLanguage()

  const [values, setValues] = useState<FoodFormValues>(empty)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setValues(
        item
          ? {
              name: item.name,
              quantity: item.quantity,
              unit: item.unit,
              expiryDate: item.expiryDate,
              location: item.location,
              category: item.category,
            }
          : empty
      )

      setError('')
    }
  }, [open, item])

  if (!open) return null

  const update = <K extends keyof FoodFormValues>(
    key: K,
    value: FoodFormValues[K]
  ) => {
    setValues(current => ({
      ...current,
      [key]: value,
    }))
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault()

    if (!values.name.trim()) {
      return setError(t('form.nameError'))
    }

    if (!values.expiryDate) {
      return setError(t('form.expiryError'))
    }

    if (!Number.isFinite(values.quantity) || values.quantity <= 0) {
      return setError(t('form.quantityError'))
    }

    onSave({
      ...values,
      name: values.name.trim(),
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/30 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="food-form-title"
    >
      <div className="w-full max-w-lg rounded-t-3xl bg-card p-6 shadow-2xl sm:rounded-3xl sm:p-8">

        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              {t('form.inventory')}
            </p>

            <h2
              id="food-form-title"
              className="mt-1 text-2xl font-bold tracking-tight"
            >
              {item ? t('form.editTitle') : t('form.addTitle')}
            </h2>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label={t('form.close')}
          >
            <X />
          </Button>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-5">

          {/* Food name */}
          <label className="flex flex-col gap-2 text-sm font-medium">
            {t('form.foodName')}

            <input
              className="h-11 rounded-xl border border-input bg-background px-3 outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring"
              value={values.name}
              onChange={e => update('name', e.target.value)}
              placeholder={t('form.foodPlaceholder')}
              autoFocus
            />
          </label>

          {/* Quantity + Unit */}
          <div className="grid grid-cols-2 gap-4">

            <label className="flex flex-col gap-2 text-sm font-medium">
              {t('form.quantity')}

              <input
                type="number"
                min="0.1"
                step="0.1"
                className="h-11 rounded-xl border border-input bg-background px-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={values.quantity}
                onChange={e =>
                  update('quantity', Number(e.target.value))
                }
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium">
              {t('form.unit')}

              <select
                className="h-11 rounded-xl border border-input bg-background px-3"
                value={values.unit}
                onChange={e =>
                  update('unit', e.target.value as Unit)
                }
              >
                {UNITS.map(unit => (
                  <option key={unit} value={unit}>
                    {t(`units.${unit}`)}
                  </option>
                ))}
              </select>
            </label>

          </div>

          {/* Expiry */}
          <label className="flex flex-col gap-2 text-sm font-medium">
            {t('form.expiry')}

            <div className="relative">
              <CalendarDays className="absolute left-3 top-3 size-5 text-muted-foreground" />

              <input
                type="date"
                className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={values.expiryDate}
                onChange={e =>
                  update('expiryDate', e.target.value)
                }
              />
            </div>
          </label>

          {/* Location + Category */}
          <div className="grid grid-cols-2 gap-4">

            <label className="flex flex-col gap-2 text-sm font-medium">
              {t('form.location')}

              <select
                className="h-11 rounded-xl border border-input bg-background px-3"
                value={values.location}
                onChange={e =>
                  update('location', e.target.value as Location)
                }
              >
                {LOCATIONS.map(location => (
                  <option key={location} value={location}>
                    {t(`locations.${location}`)}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium">
              {t('form.category')}

              <select
                className="h-11 rounded-xl border border-input bg-background px-3"
                value={values.category}
                onChange={e =>
                  update('category', e.target.value as Category)
                }
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {t(`categories.${category}`)}
                  </option>
                ))}
              </select>
            </label>

          </div>

          {/* Error */}
          {error && (
            <p
              className="text-sm font-medium text-destructive"
              role="alert"
            >
              {error}
            </p>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-1">

            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={onClose}
            >
              {t('form.cancel')}
            </Button>

            <Button
              type="submit"
              className="flex-1 rounded-xl"
            >
              {item ? t('form.save') : t('form.add')}
            </Button>

          </div>

        </form>
      </div>
    </div>
  )
}