'use client'

import { useState } from 'react'
import { ChefHat, Clock3, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { FoodItem, MealSuggestion } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'

type Props = {
  inventory: FoodItem[]
}

export function MealSuggestionPanel({ inventory }: Props) {
  const { t, language } = useLanguage()

  const [suggestions, setSuggestions] = useState<MealSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function suggest() {
    // Clear old recipes immediately
    setSuggestions([])
    setError('')

    if (!inventory.length) {
      setError(t('ai.addFood'))
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/suggest-meal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inventory,
          language,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || t('ai.unavailable'))
      }

      setSuggestions(data.suggestions)
    } catch {
      setSuggestions([])
      setError(t('ai.unavailable'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-primary/20 bg-primary/[.045] shadow-sm">
      <div className="border-b border-primary/10 p-5">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ChefHat className="size-5" />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-primary">
              {t('ai.label')}
            </p>

            <h2 className="mt-1 text-lg font-bold tracking-tight">
              {t('ai.title')}
            </h2>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {t('ai.description')}
            </p>
          </div>
        </div>

        <Button
          onClick={suggest}
          disabled={loading}
          className="mt-5 w-full rounded-xl"
        >
          {loading ? (
            <Loader2
              className="animate-spin"
              data-icon="inline-start"
            />
          ) : (
            <Sparkles data-icon="inline-start" />
          )}

          {loading ? t('ai.thinking') : t('ai.suggest')}
        </Button>
      </div>

      {error && (
        <p
          className="border-b border-primary/10 px-5 py-3 text-xs font-medium text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}

      {suggestions.length > 0 && (
        <div className="flex flex-col gap-3 p-4">
          {suggestions.map((suggestion, index) => (
            <article
              key={`${suggestion.title}-${index}`}
              className="rounded-xl border border-border/70 bg-card p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold">
                  {suggestion.title}
                </h3>

                <span className="flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock3 className="size-3" />
                  {suggestion.estimatedTimeMinutes} {t('ai.minutes')}
                </span>
              </div>

              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {suggestion.description}
              </p>

              <p className="mt-3 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                {t('ai.uses')}
              </p>

              <div className="mt-1.5 flex flex-wrap gap-1">
                {suggestion.ingredientsFromInventory.map((value) => (
                  <span
                    key={value}
                    className="rounded-md bg-secondary px-1.5 py-1 text-[10px] text-secondary-foreground"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}