/**
 * Minor Arcana - Suit of Cups (圣杯 / カップ)
 * Element: Water | Themes: Emotions, relationships, intuition, love
 * Zodiac: Cancer, Scorpio, Pisces
 */

import type { MinorArcanaCard } from './types';

export const cupsCards: MinorArcanaCard[] = [
  {
    number: 1,
    name: { en: 'Ace of Cups', zh: '圣杯王牌', ja: 'カップのエース' },
    arcana: 'minor',
    suit: 'cups',
    keywords: ['new love', 'emotional beginnings', 'compassion', 'creativity', 'intuition', 'spiritual awakening'],
    upright: 'New emotional beginnings, love, compassion. Spiritual or creative opportunity.',
    reversed: 'Emotional loss, blocked creativity, emptiness, repressed emotions.',
    decan: 'Root of Water',
    yesNo: 'Yes'
  },
  {
    number: 2,
    name: { en: 'Two of Cups', zh: '圣杯二', ja: 'カップの2' },
    arcana: 'minor',
    suit: 'cups',
    keywords: ['partnership', 'unity', 'mutual attraction', 'harmony', 'connection', 'balance'],
    upright: 'Partnership and unity, mutual attraction. Deep connection with another.',
    reversed: 'Imbalance in relationship, miscommunication, breakup, distrust.',
    decan: 'Venus in Cancer',
    yesNo: 'Yes'
  },
  {
    number: 3,
    name: { en: 'Three of Cups', zh: '圣杯三', ja: 'カップの3' },
    arcana: 'minor',
    suit: 'cups',
    keywords: ['celebration', 'friendship', 'community', 'creativity', 'collaboration', 'joy'],
    upright: 'Celebration with friends, community gathering. Creative collaboration.',
    reversed: 'Overindulgence, gossip, isolation, cancelled celebrations.',
    decan: 'Mercury in Cancer',
    yesNo: 'Yes'
  },
  {
    number: 4,
    name: { en: 'Four of Cups', zh: '圣杯四', ja: 'カップの4' },
    arcana: 'minor',
    suit: 'cups',
    keywords: ['contemplation', 'apathy', 'meditation', 'reevaluation', 'discontent', 'withdrawal'],
    upright: 'Contemplation and withdrawal. Missed opportunities due to apathy.',
    reversed: 'Renewed interest, awareness, seeing new opportunities.',
    decan: 'Moon in Cancer',
    yesNo: 'No'
  },
  {
    number: 5,
    name: { en: 'Five of Cups', zh: '圣杯五', ja: 'カップの5' },
    arcana: 'minor',
    suit: 'cups',
    keywords: ['loss', 'grief', 'regret', 'disappointment', 'mourning', 'sorrow'],
    upright: 'Loss and grief, dwelling on what was lost. Regret over past choices.',
    reversed: 'Acceptance, moving on, finding peace, forgiveness.',
    decan: 'Mars in Scorpio',
    yesNo: 'No'
  },
  {
    number: 6,
    name: { en: 'Six of Cups', zh: '圣杯六', ja: 'カップの6' },
    arcana: 'minor',
    suit: 'cups',
    keywords: ['nostalgia', 'childhood memories', 'innocence', 'joy', 'reunion', 'gifts'],
    upright: 'Nostalgia and happy memories. Reunions with people from the past. Innocence.',
    reversed: 'Living in the past, unrealistic memories, stuck in nostalgia.',
    decan: 'Sun in Scorpio',
    yesNo: 'Yes'
  },
  {
    number: 7,
    name: { en: 'Seven of Cups', zh: '圣杯七', ja: 'カップの7' },
    arcana: 'minor',
    suit: 'cups',
    keywords: ['choices', 'illusion', 'wishful thinking', 'fantasy', 'imagination', 'daydreaming'],
    upright: 'Many choices but not all are real. Wishful thinking. Fantasy vs reality.',
    reversed: 'Clarity, making a choice, aligning with reality.',
    decan: 'Venus in Scorpio',
    yesNo: 'Maybe'
  },
  {
    number: 8,
    name: { en: 'Eight of Cups', zh: '圣杯八', ja: 'カップの8' },
    arcana: 'minor',
    suit: 'cups',
    keywords: ['walking away', 'disillusionment', 'seeking meaning', 'leaving behind', 'deeper truth'],
    upright: 'Walking away from what no longer serves. Seeking deeper meaning.',
    reversed: 'Fear of change, staying in unfulfilling situation, aimlessness.',
    decan: 'Saturn in Pisces',
    yesNo: 'No'
  },
  {
    number: 9,
    name: { en: 'Nine of Cups', zh: '圣杯九', ja: 'カップの9' },
    arcana: 'minor',
    suit: 'cups',
    keywords: ['contentment', 'wish fulfillment', 'gratitude', 'luxury', 'satisfaction', 'dreams come true'],
    upright: 'Wish fulfillment, emotional satisfaction. The wish card. Contentment.',
    reversed: 'Dissatisfaction despite abundance, greed, shattered dreams.',
    decan: 'Jupiter in Pisces',
    yesNo: 'Yes'
  },
  {
    number: 10,
    name: { en: 'Ten of Cups', zh: '圣杯十', ja: 'カップの10' },
    arcana: 'minor',
    suit: 'cups',
    keywords: ['divine love', 'family harmony', 'emotional fulfillment', 'happiness', 'alignment', 'bliss'],
    upright: 'Divine love, family harmony. Emotional fulfillment and lasting happiness.',
    reversed: 'Family discord, broken home, disconnection, misaligned values.',
    decan: 'Mars in Pisces',
    yesNo: 'Yes'
  },
  {
    number: 11,
    name: { en: 'Page of Cups', zh: '圣杯侍从', ja: 'カップのペイジ' },
    arcana: 'minor',
    suit: 'cups',
    keywords: ['creative opportunities', 'intuitive messages', 'dreamer', 'sensitivity', 'inner child'],
    upright: 'Creative and intuitive messages. New emotional experience. Inner child.',
    reversed: 'Emotional immaturity, creative blocks, unrealistic expectations.',
    decan: 'Earth of Water',
    yesNo: 'Yes'
  },
  {
    number: 12,
    name: { en: 'Knight of Cups', zh: '圣杯骑士', ja: 'カップのナイト' },
    arcana: 'minor',
    suit: 'cups',
    keywords: ['romance', 'charm', 'imagination', 'following heart', 'idealist', 'proposals'],
    upright: 'Romantic proposals, following your heart. Charming and imaginative.',
    reversed: 'Moodiness, unrealistic expectations, jealousy, disappointment.',
    decan: 'Fire of Water (Pisces)',
    yesNo: 'Yes'
  },
  {
    number: 13,
    name: { en: 'Queen of Cups', zh: '圣杯王后', ja: 'カップのクイーン' },
    arcana: 'minor',
    suit: 'cups',
    keywords: ['compassion', 'calm', 'intuition', 'nurturing', 'emotional security', 'healer'],
    upright: 'Compassionate and intuitive. Emotional stability and nurturing presence.',
    reversed: 'Emotional insecurity, martyr complex, codependency.',
    decan: 'Water of Water (Cancer)',
    yesNo: 'Yes'
  },
  {
    number: 14,
    name: { en: 'King of Cups', zh: '圣杯国王', ja: 'カップのキング' },
    arcana: 'minor',
    suit: 'cups',
    keywords: ['emotional balance', 'diplomacy', 'wisdom', 'calmness', 'generosity', 'control'],
    upright: 'Emotional balance and wisdom. Diplomatic leader. Calm under pressure.',
    reversed: 'Emotional manipulation, moodiness, coldness, withdrawal.',
    decan: 'Air of Water (Scorpio)',
    yesNo: 'Yes'
  }
];
