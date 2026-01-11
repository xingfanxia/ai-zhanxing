/**
 * Minor Arcana - Suit of Pentacles (金币/星币 / ペンタクル)
 * Element: Earth | Themes: Material world, finances, career, work, health
 * Zodiac: Capricorn, Taurus, Virgo
 */

import type { MinorArcanaCard } from './types';

export const pentaclesCards: MinorArcanaCard[] = [
  {
    number: 1,
    name: { en: 'Ace of Pentacles', zh: '金币王牌', ja: 'ペンタクルのエース' },
    arcana: 'minor',
    suit: 'pentacles',
    keywords: ['new opportunity', 'prosperity', 'manifestation', 'abundance', 'new financial start'],
    upright: 'New financial or career opportunity. Prosperity and abundance. Manifestation.',
    reversed: 'Lost opportunity, lack of planning, poor financial decisions.',
    decan: 'Root of Earth',
    yesNo: 'Yes'
  },
  {
    number: 2,
    name: { en: 'Two of Pentacles', zh: '金币二', ja: 'ペンタクルの2' },
    arcana: 'minor',
    suit: 'pentacles',
    keywords: ['balance', 'juggling', 'adaptability', 'time management', 'flexibility', 'priorities'],
    upright: 'Juggling multiple priorities. Adaptability and balance. Time management.',
    reversed: 'Overwhelmed, disorganized, poor time management, imbalance.',
    decan: 'Jupiter in Capricorn',
    yesNo: 'Maybe'
  },
  {
    number: 3,
    name: { en: 'Three of Pentacles', zh: '金币三', ja: 'ペンタクルの3' },
    arcana: 'minor',
    suit: 'pentacles',
    keywords: ['teamwork', 'collaboration', 'learning', 'craftsmanship', 'skill', 'implementation'],
    upright: 'Teamwork and collaboration. Learning a craft. Recognition for skill.',
    reversed: 'Lack of teamwork, poor quality work, disharmony in group.',
    decan: 'Mars in Capricorn',
    yesNo: 'Yes'
  },
  {
    number: 4,
    name: { en: 'Four of Pentacles', zh: '金币四', ja: 'ペンタクルの4' },
    arcana: 'minor',
    suit: 'pentacles',
    keywords: ['security', 'stability', 'conservation', 'control', 'possession', 'frugality'],
    upright: 'Financial security and stability. Conserving resources. Control over finances.',
    reversed: 'Greed, materialism, hoarding, fear of loss, letting go.',
    decan: 'Sun in Capricorn',
    yesNo: 'Yes'
  },
  {
    number: 5,
    name: { en: 'Five of Pentacles', zh: '金币五', ja: 'ペンタクルの5' },
    arcana: 'minor',
    suit: 'pentacles',
    keywords: ['financial hardship', 'poverty', 'lack', 'isolation', 'worry', 'adversity'],
    upright: 'Financial hardship and worry. Feeling left out in the cold. Poverty.',
    reversed: 'Recovery from loss, spiritual poverty ending, finding help.',
    decan: 'Mercury in Taurus',
    yesNo: 'No'
  },
  {
    number: 6,
    name: { en: 'Six of Pentacles', zh: '金币六', ja: 'ペンタクルの6' },
    arcana: 'minor',
    suit: 'pentacles',
    keywords: ['generosity', 'charity', 'giving', 'receiving', 'fairness', 'sharing'],
    upright: 'Generosity and sharing. Giving or receiving help. Fair exchange.',
    reversed: 'Strings attached, debt, one-sided generosity, power imbalance.',
    decan: 'Moon in Taurus',
    yesNo: 'Yes'
  },
  {
    number: 7,
    name: { en: 'Seven of Pentacles', zh: '金币七', ja: 'ペンタクルの7' },
    arcana: 'minor',
    suit: 'pentacles',
    keywords: ['patience', 'assessment', 'long-term investment', 'waiting', 'sustainable results'],
    upright: 'Assessment of long-term investment. Patience for results. Sustainable growth.',
    reversed: 'Impatience, lack of reward, poor investment, frustration.',
    decan: 'Saturn in Taurus',
    yesNo: 'Yes'
  },
  {
    number: 8,
    name: { en: 'Eight of Pentacles', zh: '金币八', ja: 'ペンタクルの8' },
    arcana: 'minor',
    suit: 'pentacles',
    keywords: ['apprenticeship', 'skill development', 'diligence', 'dedication', 'mastery', 'detail'],
    upright: 'Dedication to craft, skill development. Hard work and mastery.',
    reversed: 'Lack of focus, shortcuts, perfectionism, uninspired work.',
    decan: 'Sun in Virgo',
    yesNo: 'Yes'
  },
  {
    number: 9,
    name: { en: 'Nine of Pentacles', zh: '金币九', ja: 'ペンタクルの9' },
    arcana: 'minor',
    suit: 'pentacles',
    keywords: ['luxury', 'self-sufficiency', 'financial independence', 'abundance', 'gratitude'],
    upright: 'Financial independence and luxury. Self-sufficiency. Enjoying the fruits of labor.',
    reversed: 'Over-investment in work, financial setbacks, superficial success.',
    decan: 'Venus in Virgo',
    yesNo: 'Yes'
  },
  {
    number: 10,
    name: { en: 'Ten of Pentacles', zh: '金币十', ja: 'ペンタクルの10' },
    arcana: 'minor',
    suit: 'pentacles',
    keywords: ['legacy', 'wealth', 'inheritance', 'family', 'long-term success', 'establishment'],
    upright: 'Long-term success, wealth, legacy. Family prosperity. Inheritance.',
    reversed: 'Family disputes, financial failure, loss of legacy.',
    decan: 'Mercury in Virgo',
    yesNo: 'Yes'
  },
  {
    number: 11,
    name: { en: 'Page of Pentacles', zh: '金币侍从', ja: 'ペンタクルのペイジ' },
    arcana: 'minor',
    suit: 'pentacles',
    keywords: ['manifestation', 'new opportunity', 'study', 'ambition', 'goal setting', 'diligence'],
    upright: 'New opportunity for growth. Student of life. Ambitious goal setting.',
    reversed: 'Lack of progress, procrastination, missed opportunity.',
    decan: 'Earth of Earth',
    yesNo: 'Yes'
  },
  {
    number: 12,
    name: { en: 'Knight of Pentacles', zh: '金币骑士', ja: 'ペンタクルのナイト' },
    arcana: 'minor',
    suit: 'pentacles',
    keywords: ['hard work', 'routine', 'reliability', 'responsibility', 'persistence', 'methodical'],
    upright: 'Hard work and dedication. Reliable and responsible. Slow but steady.',
    reversed: 'Boredom, stagnation, perfectionism, workaholic tendencies.',
    decan: 'Air of Earth (Virgo)',
    yesNo: 'Yes'
  },
  {
    number: 13,
    name: { en: 'Queen of Pentacles', zh: '金币王后', ja: 'ペンタクルのクイーン' },
    arcana: 'minor',
    suit: 'pentacles',
    keywords: ['nurturing', 'practical', 'abundance', 'home', 'security', 'down-to-earth'],
    upright: 'Nurturing and practical. Creating abundance and comfort. Down-to-earth.',
    reversed: 'Neglecting self-care, work-home imbalance, materialism.',
    decan: 'Water of Earth (Capricorn)',
    yesNo: 'Yes'
  },
  {
    number: 14,
    name: { en: 'King of Pentacles', zh: '金币国王', ja: 'ペンタクルのキング' },
    arcana: 'minor',
    suit: 'pentacles',
    keywords: ['wealth', 'abundance', 'security', 'business', 'leadership', 'provider', 'success'],
    upright: 'Wealth and business success. Reliable provider. Material abundance.',
    reversed: 'Greed, materialism, stubborn, possessive, corruption.',
    decan: 'Fire of Earth (Taurus)',
    yesNo: 'Yes'
  }
];
