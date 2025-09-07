
export interface FormState {
  location: string;
  days: number;
  travelers: number;
  hotel: '3-star' | '4-star' | '5-star' | 'Boutique';
}

export interface PriceBreakdownItem {
  item: string;
  cost: number;
  description: string;
}

export interface SuggestedHotel {
  name: string;
  rating: string;
  description: string;
  estimatedPricePerNight: number;
}

export interface ItineraryItem {
  day: number;
  title: string;
  activities: string[];
  imageUrl?: string;
}

export interface TourPackage {
  packageName: string;
  location: string;
  durationDays: number;
  totalPrice: number;
  currency: string;
  priceBreakdown: PriceBreakdownItem[];
  suggestedHotel: SuggestedHotel;
  itinerary: ItineraryItem[];
  overallDescription: string;
}