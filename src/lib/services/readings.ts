/**
 * Database service for astrology and tarot readings
 * Provides CRUD operations for user readings
 */

import { createClient } from '@/lib/supabase/server';
import type { NatalChart } from '@/lib/calculation/types';

// ============================================================================
// Types
// ============================================================================

export type ReadingType = 'astrology' | 'tarot';

export interface AstrologyInputData {
  chart: NatalChart;
  question?: string;
  birthInfo?: {
    date: string;
    time: string;
    location: string;
    latitude: number;
    longitude: number;
  };
}

export interface AstrologyResultData {
  interpretation: string;
  ai_provider?: string;
  tokens_used?: number;
}

export interface TarotInputData {
  spreadType: string;
  question?: string;
  cards: Array<{
    name: string;
    position: string;
    reversed: boolean;
  }>;
}

export interface TarotResultData {
  interpretation: string;
  cardMeanings?: Array<{
    name: string;
    meaning: string;
    keywords: string[];
  }>;
  ai_provider?: string;
  tokens_used?: number;
}

export interface Reading {
  id: string;
  user_id: string;
  reading_type: ReadingType;
  input_data: AstrologyInputData | TarotInputData;
  result_data: AstrologyResultData | TarotResultData;
  created_at: string;
  title?: string;
}

export interface SaveReadingParams {
  userId: string;
  readingType: ReadingType;
  inputData: AstrologyInputData | TarotInputData;
  resultData: AstrologyResultData | TarotResultData;
  title?: string;
}

export interface UpdateReadingParams {
  inputData?: AstrologyInputData | TarotInputData;
  resultData?: AstrologyResultData | TarotResultData;
  title?: string;
}

// ============================================================================
// Astrology Reading Functions
// ============================================================================

/**
 * Save a new astrology reading
 */
export async function saveAstrologyReading(
  userId: string,
  inputData: AstrologyInputData,
  resultData: AstrologyResultData,
  title?: string
): Promise<{ id: string } | null> {
  const supabase = await createClient();

  const insertData = {
    user_id: userId,
    reading_type: 'astrology' as const,
    input_data: inputData as unknown as Record<string, unknown>,
    result_data: resultData as unknown as Record<string, unknown>,
    title: title || generateAstrologyTitle(inputData),
  };

  const { data, error } = await supabase
    .from('readings')
    .insert(insertData as never)
    .select('id')
    .single();

  if (error) {
    console.error('Error saving astrology reading:', error);
    return null;
  }

  return data as { id: string };
}

/**
 * Get a single astrology reading by ID
 */
export async function getAstrologyReading(id: string): Promise<Reading | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('readings')
    .select('*')
    .eq('id', id)
    .eq('reading_type', 'astrology')
    .single();

  if (error) {
    console.error('Error getting astrology reading:', error);
    return null;
  }

  return data as Reading;
}

/**
 * Get all astrology readings for a user
 */
export async function getAstrologyReadings(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<Reading[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('readings')
    .select('*')
    .eq('user_id', userId)
    .eq('reading_type', 'astrology')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error getting astrology readings:', error);
    return [];
  }

  return (data || []) as Reading[];
}

/**
 * Update an astrology reading
 */
export async function updateAstrologyReading(
  id: string,
  userId: string,
  updates: UpdateReadingParams
): Promise<boolean> {
  const supabase = await createClient();

  const updateData: Record<string, unknown> = {};
  if (updates.inputData) updateData.input_data = updates.inputData;
  if (updates.resultData) updateData.result_data = updates.resultData;
  if (updates.title) updateData.title = updates.title;

  const { error } = await supabase
    .from('readings')
    .update(updateData as never)
    .eq('id', id)
    .eq('user_id', userId)
    .eq('reading_type', 'astrology');

  if (error) {
    console.error('Error updating astrology reading:', error);
    return false;
  }

  return true;
}

/**
 * Delete an astrology reading
 */
export async function deleteAstrologyReading(
  id: string,
  userId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('readings')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
    .eq('reading_type', 'astrology');

  if (error) {
    console.error('Error deleting astrology reading:', error);
    return false;
  }

  return true;
}

// ============================================================================
// Tarot Reading Functions
// ============================================================================

/**
 * Save a new tarot reading
 */
export async function saveTarotReading(
  userId: string,
  inputData: TarotInputData,
  resultData: TarotResultData,
  title?: string
): Promise<{ id: string } | null> {
  const supabase = await createClient();

  const insertData = {
    user_id: userId,
    reading_type: 'tarot' as const,
    input_data: inputData as unknown as Record<string, unknown>,
    result_data: resultData as unknown as Record<string, unknown>,
    title: title || generateTarotTitle(inputData),
  };

  const { data, error } = await supabase
    .from('readings')
    .insert(insertData as never)
    .select('id')
    .single();

  if (error) {
    console.error('Error saving tarot reading:', error);
    return null;
  }

  return data as { id: string };
}

/**
 * Get a single tarot reading by ID
 */
export async function getTarotReading(id: string): Promise<Reading | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('readings')
    .select('*')
    .eq('id', id)
    .eq('reading_type', 'tarot')
    .single();

  if (error) {
    console.error('Error getting tarot reading:', error);
    return null;
  }

  return data as Reading;
}

/**
 * Get all tarot readings for a user
 */
export async function getTarotReadings(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<Reading[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('readings')
    .select('*')
    .eq('user_id', userId)
    .eq('reading_type', 'tarot')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error getting tarot readings:', error);
    return [];
  }

  return (data || []) as Reading[];
}

/**
 * Update a tarot reading
 */
export async function updateTarotReading(
  id: string,
  userId: string,
  updates: UpdateReadingParams
): Promise<boolean> {
  const supabase = await createClient();

  const updateData: Record<string, unknown> = {};
  if (updates.inputData) updateData.input_data = updates.inputData;
  if (updates.resultData) updateData.result_data = updates.resultData;
  if (updates.title) updateData.title = updates.title;

  const { error } = await supabase
    .from('readings')
    .update(updateData as never)
    .eq('id', id)
    .eq('user_id', userId)
    .eq('reading_type', 'tarot');

  if (error) {
    console.error('Error updating tarot reading:', error);
    return false;
  }

  return true;
}

/**
 * Delete a tarot reading
 */
export async function deleteTarotReading(
  id: string,
  userId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('readings')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
    .eq('reading_type', 'tarot');

  if (error) {
    console.error('Error deleting tarot reading:', error);
    return false;
  }

  return true;
}

// ============================================================================
// Generic Reading Functions
// ============================================================================

/**
 * Get a reading by ID (any type)
 */
export async function getReading(id: string): Promise<Reading | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('readings')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error getting reading:', error);
    return null;
  }

  return data as Reading;
}

/**
 * Get all readings for a user (both types)
 */
export async function getAllReadings(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<Reading[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('readings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error getting all readings:', error);
    return [];
  }

  return (data || []) as Reading[];
}

// ============================================================================
// Helper Functions
// ============================================================================

function generateAstrologyTitle(inputData: AstrologyInputData): string {
  const chart = inputData.chart;
  if (chart?.planets?.Sun?.sign && chart?.planets?.Moon?.sign) {
    return `${chart.planets.Sun.sign} Sun, ${chart.planets.Moon.sign} Moon`;
  }
  if (inputData.birthInfo?.date) {
    return `Natal Chart - ${inputData.birthInfo.date}`;
  }
  return `Natal Chart - ${new Date().toLocaleDateString()}`;
}

function generateTarotTitle(inputData: TarotInputData): string {
  const spreadLabel = getSpreadLabel(inputData.spreadType);
  if (inputData.question) {
    const truncatedQuestion = inputData.question.slice(0, 50);
    return `${spreadLabel}: "${truncatedQuestion}${inputData.question.length > 50 ? '...' : ''}"`;
  }
  return `${spreadLabel} - ${new Date().toLocaleDateString()}`;
}

function getSpreadLabel(spreadType: string): string {
  switch (spreadType) {
    case 'single':
      return 'Single Card';
    case 'three-card':
      return 'Three Card Spread';
    case 'celtic-cross':
      return 'Celtic Cross';
    default:
      return spreadType;
  }
}

/**
 * Check if a string is a valid UUID
 */
export function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}
