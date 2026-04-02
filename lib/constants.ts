export const AUSTRALIAN_CITIES = [
  { code: "SYD", name: "Sydney", airport: "SYD" },
  { code: "MEL", name: "Melbourne", airport: "MEL" },
  { code: "BNE", name: "Brisbane", airport: "BNE" },
  { code: "PER", name: "Perth", airport: "PER" },
  { code: "ADL", name: "Adelaide", airport: "ADL" },
  { code: "CBR", name: "Canberra", airport: "CBR" },
] as const

export const POPULAR_DESTINATIONS = [
  { code: "LHR", name: "London", airport: "LHR" },
  { code: "SIN", name: "Singapore", airport: "SIN" },
  { code: "HKG", name: "Hong Kong", airport: "HKG" },
  { code: "NRT", name: "Tokyo", airport: "NRT" },
  { code: "LAX", name: "Los Angeles", airport: "LAX" },
  { code: "DXB", name: "Dubai", airport: "DXB" },
  { code: "BKK", name: "Bangkok", airport: "BKK" },
  { code: "CDG", name: "Paris", airport: "CDG" },
  { code: "FRA", name: "Frankfurt", airport: "FRA" },
  { code: "DOH", name: "Doha", airport: "DOH" },
] as const

export const CABIN_CLASSES = [
  { value: "business", label: "Business Class" },
  { value: "first", label: "First Class" },
  { value: "premium_economy", label: "Premium Economy" },
] as const

export const DEAL_TYPES = [
  { value: "mistake_fare", label: "Mistake Fare", color: "text-red-500" },
  { value: "sale", label: "Sale", color: "text-blue-500" },
  { value: "points_redemption", label: "Points", color: "text-purple-500" },
  { value: "best_available", label: "Best Available", color: "text-green-500" },
] as const

export const ALLIANCES = [
  { value: "star", label: "Star Alliance" },
  { value: "oneworld", label: "Oneworld" },
  { value: "skyteam", label: "SkyTeam" },
  { value: "none", label: "No Alliance" },
] as const

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const
