export interface Room {
    images: Image[]
    amenities: Amenities
    description: string
    breakfast_included: boolean
    has_parking: boolean
    adults_only: boolean
    pets_allowed: boolean
    show_additional_key_facts: boolean
    id: number
    name: string
    image_url: string
    max_people: number
    units: number
    has_wifi: boolean
    has_meal_plan: boolean
    bedrooms: number
    bathrooms: number
    area_unit: string
    area: number
    min_price: number
    original_min_price: number
    max_price: number
    original_max_price: number
    price_unit_in_days: number
    currency: Currency
  }
  
  export interface Image {
    text: string
    url: string
  }
  
  export interface Amenities {
    additionalProp: AdditionalProp[]
  }
  
  export interface AdditionalProp {
    name: string
    prefix: string
    bracket: string
    text: string
  }
  
  export interface Currency {
    id: number
    code: string
    name: string
    euro_forex: number
    symbol: string
  }
  