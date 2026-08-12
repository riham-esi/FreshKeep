import { NextResponse } from 'next/server'
import { isMealSuggestion, type FoodItem } from '@/lib/types'

const model = 'gemini-3.5-flash'

function cleanInventory(value: unknown): FoodItem[] {
  if (!Array.isArray(value)) return []

  return value
    .filter(
      (item): item is FoodItem =>
        !!item &&
        typeof item === 'object' &&
        typeof (item as FoodItem).name === 'string' &&
        typeof (item as FoodItem).quantity === 'number' &&
        typeof (item as FoodItem).expiryDate === 'string' &&
        typeof (item as FoodItem).location === 'string' &&
        typeof (item as FoodItem).category === 'string',
    )
    .slice(0, 30)
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json()

    const inventory = cleanInventory(
      (body as { inventory?: unknown })?.inventory,
    )

    const language = (body as { language?: unknown })?.language

    const responseLanguage =
      language === 'fr'
        ? 'French'
        : language === 'ar'
          ? 'Arabic'
          : 'English'

    if (!inventory.length) {
      return NextResponse.json(
        { error: 'Add some food to your inventory first.' },
        { status: 400 },
      )
    }

    const key = process.env.GEMINI_API_KEY

    if (!key) {
      return NextResponse.json(
        { error: 'Meal suggestions are not configured yet.' },
        { status: 503 },
      )
    }

    const prompt = `You are a practical meal planning assistant.

Respond entirely in ${responseLanguage}.

Suggest 1 to 3 realistic, simple meals using only the listed inventory.

Prioritize ingredients that are expiring soon.

Do not invent ingredients that are not in the inventory.

You may suggest salt, pepper, oil, or water as optional basic ingredients.

Return only valid JSON in this exact shape:

{
  "suggestions": [
    {
      "title": "string",
      "description": "string",
      "ingredientsFromInventory": ["string"],
      "optionalBasics": ["string"],
      "estimatedTimeMinutes": 15,
      "wasteReductionReason": "string"
    }
  ]
}

No medical or nutritional claims.

Inventory:
${JSON.stringify(
  inventory.map(
    ({ name, quantity, unit, expiryDate, location, category }) => ({
      name,
      quantity,
      unit,
      expiryDate,
      location,
      category,
    }),
  ),
)}`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.6,
            responseMimeType: 'application/json',
          },
        }),
      },
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Gemini could not generate a suggestion.' },
        { status: 502 },
      )
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{
            text?: string
          }>
        }
      }>
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      throw new Error('No response')
    }

    const parsed: unknown = JSON.parse(text)

    const suggestions = Array.isArray(
      (parsed as { suggestions?: unknown })?.suggestions,
    )
      ? (parsed as { suggestions: unknown[] }).suggestions
          .filter(isMealSuggestion)
          .slice(0, 3)
      : []

    if (!suggestions.length) {
      throw new Error('Invalid response')
    }

    return NextResponse.json({ suggestions })
  } catch {
    return NextResponse.json(
      {
        error:
          'Something went wrong while generating your meal suggestion.',
      },
      { status: 500 },
    )
  }
}