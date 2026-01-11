/**
 * Minor Arcana - Suit of Wands (权杖 / ワンド)
 * Element: Fire | Themes: Passion, creativity, action, career, willpower
 * Zodiac: Aries, Leo, Sagittarius
 */

import type { MinorArcanaCard } from './types';

export const wandsCards: MinorArcanaCard[] = [
  {
    number: 1,
    name: { en: 'Ace of Wands', zh: '权杖王牌', ja: 'ワンドのエース' },
    arcana: 'minor',
    suit: 'wands',
    keywords: ['creation', 'willpower', 'inspiration', 'potential', 'new beginnings', 'spark', 'motivation'],
    upright: 'A burst of creative energy and potential. New beginnings in career or passion projects. The spark of inspiration.',
    reversed: 'Delays in new projects, lack of motivation, creative blocks, missed opportunities.',
    decan: 'Root of Fire',
    yesNo: 'Yes'
  },
  {
    number: 2,
    name: { en: 'Two of Wands', zh: '权杖二', ja: 'ワンドの2' },
    arcana: 'minor',
    suit: 'wands',
    keywords: ['planning', 'future vision', 'decisions', 'discovery', 'progress', 'options'],
    upright: 'Planning for the future, making decisions about direction. The world is in your hands.',
    reversed: 'Fear of the unknown, lack of planning, playing it safe, poor planning.',
    decan: 'Mars in Aries',
    yesNo: 'Yes'
  },
  {
    number: 3,
    name: { en: 'Three of Wands', zh: '权杖三', ja: 'ワンドの3' },
    arcana: 'minor',
    suit: 'wands',
    keywords: ['expansion', 'foresight', 'overseas', 'progress', 'growth', 'exploration'],
    upright: 'Expansion and growth, plans coming to fruition. Looking towards broader horizons.',
    reversed: 'Obstacles to progress, delays in plans, lack of foresight, frustration.',
    decan: 'Sun in Aries',
    yesNo: 'Yes'
  },
  {
    number: 4,
    name: { en: 'Four of Wands', zh: '权杖四', ja: 'ワンドの4' },
    arcana: 'minor',
    suit: 'wands',
    keywords: ['celebration', 'joy', 'harmony', 'milestones', 'homecoming', 'community'],
    upright: 'Celebration of milestones, harmony in home and community. Time to rejoice.',
    reversed: 'Lack of harmony, cancelled celebrations, feeling unwelcome, instability.',
    decan: 'Venus in Aries',
    yesNo: 'Yes'
  },
  {
    number: 5,
    name: { en: 'Five of Wands', zh: '权杖五', ja: 'ワンドの5' },
    arcana: 'minor',
    suit: 'wands',
    keywords: ['competition', 'conflict', 'rivalry', 'tension', 'disagreement', 'struggle'],
    upright: 'Competition and conflict, healthy rivalry. Different opinions clashing.',
    reversed: 'Avoiding conflict, finding common ground, end of competition.',
    decan: 'Saturn in Leo',
    yesNo: 'Maybe'
  },
  {
    number: 6,
    name: { en: 'Six of Wands', zh: '权杖六', ja: 'ワンドの6' },
    arcana: 'minor',
    suit: 'wands',
    keywords: ['victory', 'success', 'recognition', 'triumph', 'public acclaim', 'achievement'],
    upright: 'Victory and public recognition. Success after effort. Being celebrated for achievements.',
    reversed: 'Fall from grace, lack of recognition, private success, ego issues.',
    decan: 'Jupiter in Leo',
    yesNo: 'Yes'
  },
  {
    number: 7,
    name: { en: 'Seven of Wands', zh: '权杖七', ja: 'ワンドの7' },
    arcana: 'minor',
    suit: 'wands',
    keywords: ['challenge', 'protection', 'perseverance', 'defense', 'maintaining position'],
    upright: 'Standing your ground, defending your position. Persevering despite challenges.',
    reversed: 'Giving up, overwhelmed by opposition, feeling defenseless.',
    decan: 'Mars in Leo',
    yesNo: 'Yes'
  },
  {
    number: 8,
    name: { en: 'Eight of Wands', zh: '权杖八', ja: 'ワンドの8' },
    arcana: 'minor',
    suit: 'wands',
    keywords: ['rapid action', 'movement', 'swift change', 'travel', 'speed', 'momentum'],
    upright: 'Rapid movement and quick developments. Things happening fast. Air travel possible.',
    reversed: 'Delays, frustration, slowing down, waiting, miscommunication.',
    decan: 'Mercury in Sagittarius',
    yesNo: 'Yes'
  },
  {
    number: 9,
    name: { en: 'Nine of Wands', zh: '权杖九', ja: 'ワンドの9' },
    arcana: 'minor',
    suit: 'wands',
    keywords: ['resilience', 'persistence', 'boundaries', 'grit', 'last stand', 'courage'],
    upright: 'Resilience in the face of adversity. Nearly there. Maintaining boundaries.',
    reversed: 'Exhaustion, giving up, paranoia, stubbornness, overwhelm.',
    decan: 'Moon in Sagittarius',
    yesNo: 'Yes'
  },
  {
    number: 10,
    name: { en: 'Ten of Wands', zh: '权杖十', ja: 'ワンドの10' },
    arcana: 'minor',
    suit: 'wands',
    keywords: ['burden', 'responsibility', 'hard work', 'stress', 'overload', 'duty'],
    upright: 'Carrying heavy burdens, overworked. Taking on too much responsibility.',
    reversed: 'Releasing burdens, delegation, learning to say no.',
    decan: 'Saturn in Sagittarius',
    yesNo: 'Yes'
  },
  {
    number: 11,
    name: { en: 'Page of Wands', zh: '权杖侍从', ja: 'ワンドのペイジ' },
    arcana: 'minor',
    suit: 'wands',
    keywords: ['inspiration', 'ideas', 'free spirit', 'potential', 'enthusiasm', 'discovery'],
    upright: 'Inspired ideas, new creative venture, free-spirited exploration.',
    reversed: 'Lack of direction, hasty decisions, creative blocks, procrastination.',
    decan: 'Earth of Fire',
    yesNo: 'Yes'
  },
  {
    number: 12,
    name: { en: 'Knight of Wands', zh: '权杖骑士', ja: 'ワンドのナイト' },
    arcana: 'minor',
    suit: 'wands',
    keywords: ['action', 'adventure', 'passion', 'fearlessness', 'impulsive', 'energy'],
    upright: 'Pursuing goals with passion and energy. Fearless action. Adventure awaits.',
    reversed: 'Recklessness, haste, delays in travel, scattered energy.',
    decan: 'Fire of Fire (Leo)',
    yesNo: 'Yes'
  },
  {
    number: 13,
    name: { en: 'Queen of Wands', zh: '权杖王后', ja: 'ワンドのクイーン' },
    arcana: 'minor',
    suit: 'wands',
    keywords: ['courage', 'confidence', 'independence', 'warmth', 'determination', 'vibrancy'],
    upright: 'Confident, warm, and determined. Living life on your own terms.',
    reversed: 'Jealousy, selfishness, insecurity, demanding nature.',
    decan: 'Water of Fire (Aries)',
    yesNo: 'Yes'
  },
  {
    number: 14,
    name: { en: 'King of Wands', zh: '权杖国王', ja: 'ワンドのキング' },
    arcana: 'minor',
    suit: 'wands',
    keywords: ['leadership', 'vision', 'entrepreneur', 'honor', 'charisma', 'boldness'],
    upright: 'Natural leader with vision and charisma. Entrepreneurial spirit. Bold decisions.',
    reversed: 'Impulsive, overbearing, unrealistic expectations, tyranny.',
    decan: 'Air of Fire (Sagittarius)',
    yesNo: 'Yes'
  }
];
