/**
 * Geocoding API
 * GET /api/geocode?q=city_name - Search cities
 * POST /api/geocode - Geocode a city name to coordinates
 *
 * Uses Nominatim (OpenStreetMap) as primary source with static fallback
 */

import { NextRequest, NextResponse } from 'next/server';
import { searchCities, getCityByName, type CityInfo } from '@/lib/data/worldCities';

interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type: string;
  importance: number;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
  };
}

interface GeocodingResult {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  displayName: string;
  source: 'static' | 'nominatim';
}

/**
 * GET /api/geocode?q=query
 * Search for cities matching the query
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';
  const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 20);

  try {
    // First, search static database
    const staticResults = searchCities(query, limit);

    // If we have good static results, return them immediately for speed
    if (staticResults.length >= 3 || !query.trim()) {
      return NextResponse.json({
        success: true,
        data: {
          cities: staticResults.map(city => ({
            name: city.name,
            country: city.country,
            latitude: city.latitude,
            longitude: city.longitude,
            timezone: city.timezone,
            displayName: `${city.name}, ${city.country}`,
            source: 'static' as const,
          })),
          source: 'static',
        },
      });
    }

    // If limited static results, also try Nominatim for more options
    if (query.trim().length >= 2) {
      try {
        const nominatimResults = await searchNominatim(query, limit);

        // Merge results, preferring static for duplicates
        const mergedResults = mergeResults(staticResults, nominatimResults, limit);

        return NextResponse.json({
          success: true,
          data: {
            cities: mergedResults,
            source: 'merged',
          },
        });
      } catch (nominatimError) {
        // If Nominatim fails, just return static results
        console.error('Nominatim search failed:', nominatimError);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        cities: staticResults.map(city => ({
          name: city.name,
          country: city.country,
          latitude: city.latitude,
          longitude: city.longitude,
          timezone: city.timezone,
          displayName: `${city.name}, ${city.country}`,
          source: 'static' as const,
        })),
        source: 'static',
      },
    });
  } catch (error) {
    console.error('Geocode search error:', error);
    return NextResponse.json(
      { error: 'Search failed', message: 'Failed to search cities' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/geocode
 * Geocode a specific city to get coordinates
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { city, preferStatic = false } = body as { city: string; preferStatic?: boolean };

    if (!city || typeof city !== 'string' || city.trim().length < 2) {
      return NextResponse.json(
        { error: 'Invalid city', message: 'City name must be at least 2 characters' },
        { status: 400 }
      );
    }

    const trimmedCity = city.trim();

    // Try static lookup first (faster and more reliable)
    const staticResult = getCityByName(trimmedCity);
    if (staticResult) {
      return NextResponse.json({
        success: true,
        data: {
          name: staticResult.name,
          country: staticResult.country,
          latitude: staticResult.latitude,
          longitude: staticResult.longitude,
          timezone: staticResult.timezone,
          displayName: `${staticResult.name}, ${staticResult.country}`,
          source: 'static',
        } as GeocodingResult,
      });
    }

    // If preferStatic is true and no static result, return 404
    if (preferStatic) {
      return NextResponse.json(
        { error: 'City not found', message: `City "${trimmedCity}" not found in static database` },
        { status: 404 }
      );
    }

    // Try Nominatim API
    try {
      const nominatimResult = await geocodeWithNominatim(trimmedCity);
      if (nominatimResult) {
        return NextResponse.json({
          success: true,
          data: nominatimResult,
        });
      }
    } catch (nominatimError) {
      console.error('Nominatim geocode failed:', nominatimError);
    }

    // Not found anywhere
    return NextResponse.json(
      { error: 'City not found', message: `Could not find coordinates for "${trimmedCity}"` },
      { status: 404 }
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON', message: 'Request body must be valid JSON' },
        { status: 400 }
      );
    }

    console.error('Geocode error:', error);
    return NextResponse.json(
      { error: 'Geocoding failed', message: 'Failed to geocode city' },
      { status: 500 }
    );
  }
}

/**
 * Search Nominatim for cities
 */
async function searchNominatim(query: string, limit: number): Promise<GeocodingResult[]> {
  const apiUrl = `https://nominatim.openstreetmap.org/search?` +
    `q=${encodeURIComponent(query)}&` +
    `format=json&` +
    `addressdetails=1&` +
    `limit=${limit}&` +
    `featuretype=city`;

  const response = await fetch(apiUrl, {
    headers: {
      'User-Agent': 'AI-Zhanxing-Astrology-App/1.0 (https://astro.ax0x.ai)',
      'Accept-Language': 'en',
    },
    // Nominatim requires max 1 request per second
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`Nominatim API error: ${response.status}`);
  }

  const results = await response.json() as NominatimResult[];

  return results
    .filter(r => r.type === 'city' || r.type === 'town' || r.type === 'administrative')
    .map(r => ({
      name: r.address?.city || r.address?.town || r.address?.village || r.display_name.split(',')[0],
      country: r.address?.country || '',
      latitude: parseFloat(r.lat),
      longitude: parseFloat(r.lon),
      displayName: r.display_name,
      source: 'nominatim' as const,
    }));
}

/**
 * Geocode a single city with Nominatim
 */
async function geocodeWithNominatim(city: string): Promise<GeocodingResult | null> {
  const apiUrl = `https://nominatim.openstreetmap.org/search?` +
    `q=${encodeURIComponent(city)}&` +
    `format=json&` +
    `addressdetails=1&` +
    `limit=1`;

  const response = await fetch(apiUrl, {
    headers: {
      'User-Agent': 'AI-Zhanxing-Astrology-App/1.0 (https://astro.ax0x.ai)',
      'Accept-Language': 'en',
    },
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`Nominatim API error: ${response.status}`);
  }

  const results = await response.json() as NominatimResult[];

  if (results.length === 0) {
    return null;
  }

  const r = results[0];
  return {
    name: r.address?.city || r.address?.town || r.address?.village || r.display_name.split(',')[0],
    country: r.address?.country || '',
    latitude: parseFloat(r.lat),
    longitude: parseFloat(r.lon),
    displayName: r.display_name,
    source: 'nominatim',
  };
}

/**
 * Merge static and Nominatim results, removing duplicates
 */
function mergeResults(
  staticResults: CityInfo[],
  nominatimResults: GeocodingResult[],
  limit: number
): GeocodingResult[] {
  const seen = new Set<string>();
  const merged: GeocodingResult[] = [];

  // Add static results first (they have timezone info)
  for (const city of staticResults) {
    const key = `${city.name.toLowerCase()}-${city.country.toLowerCase()}`;
    if (!seen.has(key)) {
      seen.add(key);
      merged.push({
        name: city.name,
        country: city.country,
        latitude: city.latitude,
        longitude: city.longitude,
        timezone: city.timezone,
        displayName: `${city.name}, ${city.country}`,
        source: 'static',
      });
    }
  }

  // Add Nominatim results that aren't duplicates
  for (const result of nominatimResults) {
    const key = `${result.name.toLowerCase()}-${result.country.toLowerCase()}`;
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(result);
    }
  }

  return merged.slice(0, limit);
}
