export type Unit = 'pieces' | 'kg' | 'g' | 'liters' | 'ml' | 'pack'
export type Location = 'Fridge' | 'Freezer' | 'Pantry'
export type Category = 'Vegetables' | 'Fruits' | 'Dairy' | 'Meat' | 'Grains' | 'Other'

export type FoodItem = {
  id: string
  name: string
  quantity: number
  unit: Unit
  expiryDate: string
  location: Location
  category: Category
  createdAt: string
}

export type ExpiryStatus = 'expired' | 'soon' | 'fresh'

export type MealSuggestion = {
  title: string
  description: string
  ingredientsFromInventory: string[]
  optionalBasics: string[]
  estimatedTimeMinutes: number
  wasteReductionReason: string
}

export const UNITS: Unit[] = ['pieces', 'kg', 'g', 'liters', 'ml', 'pack']
export const LOCATIONS: Location[] = ['Fridge', 'Freezer', 'Pantry']
export const CATEGORIES: Category[] = ['Vegetables', 'Fruits', 'Dairy', 'Meat', 'Grains', 'Other']

export type FoodFormValues = Omit<FoodItem, 'id' | 'createdAt'>

export function isFoodItem(value: unknown): value is FoodItem {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<FoodItem>
  return typeof item.id === 'string' && typeof item.name === 'string' && typeof item.quantity === 'number' && typeof item.expiryDate === 'string' && LOCATIONS.includes(item.location as Location) && CATEGORIES.includes(item.category as Category)
}

export function isMealSuggestion(value: unknown): value is MealSuggestion {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<MealSuggestion>
  return typeof item.title === 'string' && typeof item.description === 'string' && Array.isArray(item.ingredientsFromInventory) && Array.isArray(item.optionalBasics) && typeof item.estimatedTimeMinutes === 'number' && typeof item.wasteReductionReason === 'string'
} 
