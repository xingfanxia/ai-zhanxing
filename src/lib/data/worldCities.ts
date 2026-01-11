/**
 * World Cities Database
 * Major cities with coordinates and timezone offsets
 * Used as static fallback for geocoding
 */

export interface CityInfo {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string; // IANA timezone
  population?: number; // For sorting by importance
}

// Major world cities organized by region
export const WORLD_CITIES: CityInfo[] = [
  // North America
  { name: "New York", country: "United States", latitude: 40.7128, longitude: -74.006, timezone: "America/New_York", population: 8336817 },
  { name: "Los Angeles", country: "United States", latitude: 34.0522, longitude: -118.2437, timezone: "America/Los_Angeles", population: 3979576 },
  { name: "Chicago", country: "United States", latitude: 41.8781, longitude: -87.6298, timezone: "America/Chicago", population: 2693976 },
  { name: "Houston", country: "United States", latitude: 29.7604, longitude: -95.3698, timezone: "America/Chicago", population: 2320268 },
  { name: "Phoenix", country: "United States", latitude: 33.4484, longitude: -112.074, timezone: "America/Phoenix", population: 1680992 },
  { name: "San Francisco", country: "United States", latitude: 37.7749, longitude: -122.4194, timezone: "America/Los_Angeles", population: 881549 },
  { name: "Seattle", country: "United States", latitude: 47.6062, longitude: -122.3321, timezone: "America/Los_Angeles", population: 753675 },
  { name: "Denver", country: "United States", latitude: 39.7392, longitude: -104.9903, timezone: "America/Denver", population: 727211 },
  { name: "Boston", country: "United States", latitude: 42.3601, longitude: -71.0589, timezone: "America/New_York", population: 692600 },
  { name: "Miami", country: "United States", latitude: 25.7617, longitude: -80.1918, timezone: "America/New_York", population: 467963 },
  { name: "Atlanta", country: "United States", latitude: 33.749, longitude: -84.388, timezone: "America/New_York", population: 498715 },
  { name: "Dallas", country: "United States", latitude: 32.7767, longitude: -96.797, timezone: "America/Chicago", population: 1343573 },
  { name: "San Diego", country: "United States", latitude: 32.7157, longitude: -117.1611, timezone: "America/Los_Angeles", population: 1423851 },
  { name: "Austin", country: "United States", latitude: 30.2672, longitude: -97.7431, timezone: "America/Chicago", population: 978908 },
  { name: "Las Vegas", country: "United States", latitude: 36.1699, longitude: -115.1398, timezone: "America/Los_Angeles", population: 651319 },
  { name: "Portland", country: "United States", latitude: 45.5155, longitude: -122.6789, timezone: "America/Los_Angeles", population: 654741 },
  { name: "Washington", country: "United States", latitude: 38.9072, longitude: -77.0369, timezone: "America/New_York", population: 705749 },
  { name: "Philadelphia", country: "United States", latitude: 39.9526, longitude: -75.1652, timezone: "America/New_York", population: 1584064 },
  { name: "Toronto", country: "Canada", latitude: 43.6532, longitude: -79.3832, timezone: "America/Toronto", population: 2731571 },
  { name: "Vancouver", country: "Canada", latitude: 49.2827, longitude: -123.1207, timezone: "America/Vancouver", population: 631486 },
  { name: "Montreal", country: "Canada", latitude: 45.5017, longitude: -73.5673, timezone: "America/Toronto", population: 1762949 },
  { name: "Mexico City", country: "Mexico", latitude: 19.4326, longitude: -99.1332, timezone: "America/Mexico_City", population: 8918653 },

  // Europe
  { name: "London", country: "United Kingdom", latitude: 51.5074, longitude: -0.1278, timezone: "Europe/London", population: 8982000 },
  { name: "Paris", country: "France", latitude: 48.8566, longitude: 2.3522, timezone: "Europe/Paris", population: 2161000 },
  { name: "Berlin", country: "Germany", latitude: 52.52, longitude: 13.405, timezone: "Europe/Berlin", population: 3644826 },
  { name: "Madrid", country: "Spain", latitude: 40.4168, longitude: -3.7038, timezone: "Europe/Madrid", population: 3223334 },
  { name: "Rome", country: "Italy", latitude: 41.9028, longitude: 12.4964, timezone: "Europe/Rome", population: 2872800 },
  { name: "Amsterdam", country: "Netherlands", latitude: 52.3676, longitude: 4.9041, timezone: "Europe/Amsterdam", population: 872680 },
  { name: "Vienna", country: "Austria", latitude: 48.2082, longitude: 16.3738, timezone: "Europe/Vienna", population: 1911191 },
  { name: "Prague", country: "Czech Republic", latitude: 50.0755, longitude: 14.4378, timezone: "Europe/Prague", population: 1309000 },
  { name: "Barcelona", country: "Spain", latitude: 41.3851, longitude: 2.1734, timezone: "Europe/Madrid", population: 1620343 },
  { name: "Munich", country: "Germany", latitude: 48.1351, longitude: 11.582, timezone: "Europe/Berlin", population: 1471508 },
  { name: "Milan", country: "Italy", latitude: 45.4642, longitude: 9.19, timezone: "Europe/Rome", population: 1378689 },
  { name: "Dublin", country: "Ireland", latitude: 53.3498, longitude: -6.2603, timezone: "Europe/Dublin", population: 544107 },
  { name: "Brussels", country: "Belgium", latitude: 50.8503, longitude: 4.3517, timezone: "Europe/Brussels", population: 1208542 },
  { name: "Stockholm", country: "Sweden", latitude: 59.3293, longitude: 18.0686, timezone: "Europe/Stockholm", population: 975551 },
  { name: "Oslo", country: "Norway", latitude: 59.9139, longitude: 10.7522, timezone: "Europe/Oslo", population: 693494 },
  { name: "Copenhagen", country: "Denmark", latitude: 55.6761, longitude: 12.5683, timezone: "Europe/Copenhagen", population: 602481 },
  { name: "Helsinki", country: "Finland", latitude: 60.1699, longitude: 24.9384, timezone: "Europe/Helsinki", population: 653835 },
  { name: "Zurich", country: "Switzerland", latitude: 47.3769, longitude: 8.5417, timezone: "Europe/Zurich", population: 402762 },
  { name: "Geneva", country: "Switzerland", latitude: 46.2044, longitude: 6.1432, timezone: "Europe/Zurich", population: 201818 },
  { name: "Lisbon", country: "Portugal", latitude: 38.7223, longitude: -9.1393, timezone: "Europe/Lisbon", population: 504718 },
  { name: "Athens", country: "Greece", latitude: 37.9838, longitude: 23.7275, timezone: "Europe/Athens", population: 664046 },
  { name: "Warsaw", country: "Poland", latitude: 52.2297, longitude: 21.0122, timezone: "Europe/Warsaw", population: 1790658 },
  { name: "Budapest", country: "Hungary", latitude: 47.4979, longitude: 19.0402, timezone: "Europe/Budapest", population: 1752286 },
  { name: "Moscow", country: "Russia", latitude: 55.7558, longitude: 37.6173, timezone: "Europe/Moscow", population: 12537954 },
  { name: "St. Petersburg", country: "Russia", latitude: 59.9311, longitude: 30.3609, timezone: "Europe/Moscow", population: 5383890 },

  // Asia
  { name: "Tokyo", country: "Japan", latitude: 35.6762, longitude: 139.6503, timezone: "Asia/Tokyo", population: 13960000 },
  { name: "Osaka", country: "Japan", latitude: 34.6937, longitude: 135.5023, timezone: "Asia/Tokyo", population: 2691000 },
  { name: "Kyoto", country: "Japan", latitude: 35.0116, longitude: 135.7681, timezone: "Asia/Tokyo", population: 1475000 },
  { name: "Beijing", country: "China", latitude: 39.9042, longitude: 116.4074, timezone: "Asia/Shanghai", population: 21540000 },
  { name: "Shanghai", country: "China", latitude: 31.2304, longitude: 121.4737, timezone: "Asia/Shanghai", population: 24870000 },
  { name: "Guangzhou", country: "China", latitude: 23.1291, longitude: 113.2644, timezone: "Asia/Shanghai", population: 15300000 },
  { name: "Shenzhen", country: "China", latitude: 22.5431, longitude: 114.0579, timezone: "Asia/Shanghai", population: 12590000 },
  { name: "Hong Kong", country: "China", latitude: 22.3193, longitude: 114.1694, timezone: "Asia/Hong_Kong", population: 7500700 },
  { name: "Taipei", country: "Taiwan", latitude: 25.033, longitude: 121.5654, timezone: "Asia/Taipei", population: 2646000 },
  { name: "Seoul", country: "South Korea", latitude: 37.5665, longitude: 126.978, timezone: "Asia/Seoul", population: 9776000 },
  { name: "Busan", country: "South Korea", latitude: 35.1796, longitude: 129.0756, timezone: "Asia/Seoul", population: 3429000 },
  { name: "Singapore", country: "Singapore", latitude: 1.3521, longitude: 103.8198, timezone: "Asia/Singapore", population: 5850000 },
  { name: "Bangkok", country: "Thailand", latitude: 13.7563, longitude: 100.5018, timezone: "Asia/Bangkok", population: 10539000 },
  { name: "Kuala Lumpur", country: "Malaysia", latitude: 3.139, longitude: 101.6869, timezone: "Asia/Kuala_Lumpur", population: 1782000 },
  { name: "Jakarta", country: "Indonesia", latitude: -6.2088, longitude: 106.8456, timezone: "Asia/Jakarta", population: 10562000 },
  { name: "Manila", country: "Philippines", latitude: 14.5995, longitude: 120.9842, timezone: "Asia/Manila", population: 1780000 },
  { name: "Ho Chi Minh City", country: "Vietnam", latitude: 10.8231, longitude: 106.6297, timezone: "Asia/Ho_Chi_Minh", population: 8993000 },
  { name: "Hanoi", country: "Vietnam", latitude: 21.0278, longitude: 105.8342, timezone: "Asia/Ho_Chi_Minh", population: 8054000 },
  { name: "Mumbai", country: "India", latitude: 19.076, longitude: 72.8777, timezone: "Asia/Kolkata", population: 12442373 },
  { name: "Delhi", country: "India", latitude: 28.6139, longitude: 77.209, timezone: "Asia/Kolkata", population: 16787941 },
  { name: "Bangalore", country: "India", latitude: 12.9716, longitude: 77.5946, timezone: "Asia/Kolkata", population: 8443675 },
  { name: "Chennai", country: "India", latitude: 13.0827, longitude: 80.2707, timezone: "Asia/Kolkata", population: 4681087 },
  { name: "Kolkata", country: "India", latitude: 22.5726, longitude: 88.3639, timezone: "Asia/Kolkata", population: 4496694 },
  { name: "Dubai", country: "United Arab Emirates", latitude: 25.2048, longitude: 55.2708, timezone: "Asia/Dubai", population: 3331420 },
  { name: "Abu Dhabi", country: "United Arab Emirates", latitude: 24.4539, longitude: 54.3773, timezone: "Asia/Dubai", population: 1482816 },
  { name: "Tel Aviv", country: "Israel", latitude: 32.0853, longitude: 34.7818, timezone: "Asia/Jerusalem", population: 451523 },
  { name: "Jerusalem", country: "Israel", latitude: 31.7683, longitude: 35.2137, timezone: "Asia/Jerusalem", population: 936425 },
  { name: "Istanbul", country: "Turkey", latitude: 41.0082, longitude: 28.9784, timezone: "Europe/Istanbul", population: 15462452 },
  { name: "Ankara", country: "Turkey", latitude: 39.9334, longitude: 32.8597, timezone: "Europe/Istanbul", population: 5503985 },

  // Oceania
  { name: "Sydney", country: "Australia", latitude: -33.8688, longitude: 151.2093, timezone: "Australia/Sydney", population: 5312163 },
  { name: "Melbourne", country: "Australia", latitude: -37.8136, longitude: 144.9631, timezone: "Australia/Melbourne", population: 5078193 },
  { name: "Brisbane", country: "Australia", latitude: -27.4698, longitude: 153.0251, timezone: "Australia/Brisbane", population: 2560700 },
  { name: "Perth", country: "Australia", latitude: -31.9505, longitude: 115.8605, timezone: "Australia/Perth", population: 2085973 },
  { name: "Auckland", country: "New Zealand", latitude: -36.8485, longitude: 174.7633, timezone: "Pacific/Auckland", population: 1657200 },
  { name: "Wellington", country: "New Zealand", latitude: -41.2865, longitude: 174.7762, timezone: "Pacific/Auckland", population: 215400 },

  // South America
  { name: "São Paulo", country: "Brazil", latitude: -23.5505, longitude: -46.6333, timezone: "America/Sao_Paulo", population: 12325232 },
  { name: "Rio de Janeiro", country: "Brazil", latitude: -22.9068, longitude: -43.1729, timezone: "America/Sao_Paulo", population: 6718903 },
  { name: "Buenos Aires", country: "Argentina", latitude: -34.6037, longitude: -58.3816, timezone: "America/Argentina/Buenos_Aires", population: 2891082 },
  { name: "Lima", country: "Peru", latitude: -12.0464, longitude: -77.0428, timezone: "America/Lima", population: 9751717 },
  { name: "Bogotá", country: "Colombia", latitude: 4.711, longitude: -74.0721, timezone: "America/Bogota", population: 7181469 },
  { name: "Santiago", country: "Chile", latitude: -33.4489, longitude: -70.6693, timezone: "America/Santiago", population: 5614000 },
  { name: "Caracas", country: "Venezuela", latitude: 10.4806, longitude: -66.9036, timezone: "America/Caracas", population: 2082000 },

  // Africa
  { name: "Cairo", country: "Egypt", latitude: 30.0444, longitude: 31.2357, timezone: "Africa/Cairo", population: 10230350 },
  { name: "Lagos", country: "Nigeria", latitude: 6.5244, longitude: 3.3792, timezone: "Africa/Lagos", population: 14862000 },
  { name: "Johannesburg", country: "South Africa", latitude: -26.2041, longitude: 28.0473, timezone: "Africa/Johannesburg", population: 5635127 },
  { name: "Cape Town", country: "South Africa", latitude: -33.9249, longitude: 18.4241, timezone: "Africa/Johannesburg", population: 4617560 },
  { name: "Nairobi", country: "Kenya", latitude: -1.2921, longitude: 36.8219, timezone: "Africa/Nairobi", population: 4397073 },
  { name: "Casablanca", country: "Morocco", latitude: 33.5731, longitude: -7.5898, timezone: "Africa/Casablanca", population: 3359818 },
  { name: "Addis Ababa", country: "Ethiopia", latitude: 9.0054, longitude: 38.7636, timezone: "Africa/Addis_Ababa", population: 3352000 },

  // Middle East
  { name: "Riyadh", country: "Saudi Arabia", latitude: 24.7136, longitude: 46.6753, timezone: "Asia/Riyadh", population: 7676654 },
  { name: "Doha", country: "Qatar", latitude: 25.2854, longitude: 51.531, timezone: "Asia/Qatar", population: 956457 },
  { name: "Kuwait City", country: "Kuwait", latitude: 29.3759, longitude: 47.9774, timezone: "Asia/Kuwait", population: 2989000 },
  { name: "Muscat", country: "Oman", latitude: 23.588, longitude: 58.3829, timezone: "Asia/Muscat", population: 1421409 },
  { name: "Amman", country: "Jordan", latitude: 31.9454, longitude: 35.9284, timezone: "Asia/Amman", population: 4007526 },
  { name: "Beirut", country: "Lebanon", latitude: 33.8938, longitude: 35.5018, timezone: "Asia/Beirut", population: 2200000 },
  { name: "Tehran", country: "Iran", latitude: 35.6892, longitude: 51.389, timezone: "Asia/Tehran", population: 8693706 },

  // Additional major Chinese cities
  { name: "Chengdu", country: "China", latitude: 30.5728, longitude: 104.0668, timezone: "Asia/Shanghai", population: 16330000 },
  { name: "Hangzhou", country: "China", latitude: 30.2741, longitude: 120.1551, timezone: "Asia/Shanghai", population: 10360000 },
  { name: "Wuhan", country: "China", latitude: 30.5928, longitude: 114.3055, timezone: "Asia/Shanghai", population: 11080000 },
  { name: "Xian", country: "China", latitude: 34.3416, longitude: 108.9398, timezone: "Asia/Shanghai", population: 12950000 },
  { name: "Nanjing", country: "China", latitude: 32.0603, longitude: 118.7969, timezone: "Asia/Shanghai", population: 8505500 },
  { name: "Tianjin", country: "China", latitude: 39.0842, longitude: 117.2009, timezone: "Asia/Shanghai", population: 13860000 },
  { name: "Chongqing", country: "China", latitude: 29.4316, longitude: 106.9123, timezone: "Asia/Shanghai", population: 15870000 },
  { name: "Suzhou", country: "China", latitude: 31.2989, longitude: 120.5853, timezone: "Asia/Shanghai", population: 10720000 },
  { name: "Qingdao", country: "China", latitude: 36.0671, longitude: 120.3826, timezone: "Asia/Shanghai", population: 9500000 },
  { name: "Dalian", country: "China", latitude: 38.914, longitude: 121.6147, timezone: "Asia/Shanghai", population: 6000000 },
  { name: "Macau", country: "China", latitude: 22.1987, longitude: 113.5439, timezone: "Asia/Macau", population: 682800 },
];

// Create a map for quick lookup by name
const cityMap = new Map<string, CityInfo>();
WORLD_CITIES.forEach(city => {
  // Add by city name
  cityMap.set(city.name.toLowerCase(), city);
  // Add by "city, country" format
  cityMap.set(`${city.name.toLowerCase()}, ${city.country.toLowerCase()}`, city);
});

/**
 * Search cities by name (case-insensitive, partial match)
 */
export function searchCities(query: string, limit: number = 10): CityInfo[] {
  if (!query.trim()) {
    // Return top cities by population
    return [...WORLD_CITIES]
      .sort((a, b) => (b.population || 0) - (a.population || 0))
      .slice(0, limit);
  }

  const lowerQuery = query.toLowerCase().trim();

  // Exact matches first, then starts with, then contains
  const exactMatches: CityInfo[] = [];
  const startsWithMatches: CityInfo[] = [];
  const containsMatches: CityInfo[] = [];

  for (const city of WORLD_CITIES) {
    const cityLower = city.name.toLowerCase();
    const countryLower = city.country.toLowerCase();
    const fullName = `${cityLower}, ${countryLower}`;

    if (cityLower === lowerQuery || fullName === lowerQuery) {
      exactMatches.push(city);
    } else if (cityLower.startsWith(lowerQuery) || fullName.startsWith(lowerQuery)) {
      startsWithMatches.push(city);
    } else if (cityLower.includes(lowerQuery) || countryLower.includes(lowerQuery)) {
      containsMatches.push(city);
    }
  }

  // Sort each group by population, then combine
  const sortByPop = (a: CityInfo, b: CityInfo) => (b.population || 0) - (a.population || 0);

  return [
    ...exactMatches.sort(sortByPop),
    ...startsWithMatches.sort(sortByPop),
    ...containsMatches.sort(sortByPop),
  ].slice(0, limit);
}

/**
 * Get city by exact name (case-insensitive)
 */
export function getCityByName(name: string): CityInfo | null {
  return cityMap.get(name.toLowerCase()) || null;
}

/**
 * Get all city names for autocomplete
 */
export function getAllCityNames(): string[] {
  return WORLD_CITIES.map(city => `${city.name}, ${city.country}`);
}
