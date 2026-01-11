/**
 * Tarot Terminology - Multilingual Glossary
 * Core terms for tarot readings in English, Chinese, and Japanese
 */

import type { MultilingualText, Element, Suit, CourtRank } from './types';

/** Core reading terms */
export const CORE_TERMS: Record<string, MultilingualText> = {
  shuffle: { en: 'Shuffle', zh: '洗牌', ja: 'シャッフル' },
  draw: { en: 'Draw', zh: '抽牌', ja: 'ドロー' },
  spread: { en: 'Spread', zh: '牌阵', ja: 'スプレッド' },
  upright: { en: 'Upright', zh: '正位', ja: '正位置' },
  reversed: { en: 'Reversed', zh: '逆位', ja: '逆位置' },
  significator: { en: 'Significator', zh: '指示牌', ja: 'シグニフィケーター' },
  querent: { en: 'Querent', zh: '问卜者', ja: '質問者' },
  reader: { en: 'Reader', zh: '塔罗师', ja: 'リーダー' },
  majorArcana: { en: 'Major Arcana', zh: '大阿尔卡纳', ja: '大アルカナ' },
  minorArcana: { en: 'Minor Arcana', zh: '小阿尔卡纳', ja: '小アルカナ' },
  cut: { en: 'Cut', zh: '切牌', ja: 'カット' },
  reading: { en: 'Reading', zh: '占卜', ja: 'リーディング' },
  interpretation: { en: 'Interpretation', zh: '解读', ja: '解釈' },
  deck: { en: 'Deck', zh: '牌组', ja: 'デッキ' },
  courtCards: { en: 'Court Cards', zh: '宫廷牌', ja: 'コートカード' },
  divination: { en: 'Divination', zh: '占卜术', ja: '占い' },
  fortune: { en: 'Fortune', zh: '运势', ja: '運勢' },
  fate: { en: 'Fate', zh: '命运', ja: '運命' },
  destiny: { en: 'Destiny', zh: '天命', ja: '宿命' },
  guidance: { en: 'Guidance', zh: '指引', ja: '導き' },
  insight: { en: 'Insight', zh: '洞察', ja: '洞察' },
  wisdom: { en: 'Wisdom', zh: '智慧', ja: '知恵' },
  energy: { en: 'Energy', zh: '能量', ja: 'エネルギー' },
  aura: { en: 'Aura', zh: '气场', ja: 'オーラ' },
  intuition: { en: 'Intuition', zh: '直觉', ja: '直感' },
  symbolism: { en: 'Symbolism', zh: '象征', ja: '象徴' },
  archetype: { en: 'Archetype', zh: '原型', ja: '元型' },
  numerology: { en: 'Numerology', zh: '数秘术', ja: '数秘術' },
  astrology: { en: 'Astrology', zh: '占星术', ja: '占星術' }
};

/** Suit names */
export const SUIT_NAMES: Record<Suit, MultilingualText> = {
  wands: { en: 'Wands', zh: '权杖', ja: 'ワンド' },
  cups: { en: 'Cups', zh: '圣杯', ja: 'カップ' },
  swords: { en: 'Swords', zh: '宝剑', ja: 'ソード' },
  pentacles: { en: 'Pentacles', zh: '金币', ja: 'ペンタクル' }
};

/** Alternative suit names (for display variations) */
export const SUIT_ALTERNATIVES: Record<Suit, MultilingualText> = {
  wands: { en: 'Rods', zh: '法杖', ja: '杖' },
  cups: { en: 'Chalices', zh: '杯', ja: '聖杯' },
  swords: { en: 'Blades', zh: '剑', ja: '剣' },
  pentacles: { en: 'Coins', zh: '星币', ja: 'コイン' }
};

/** Court card titles */
export const COURT_TITLES: Record<CourtRank, MultilingualText> = {
  page: { en: 'Page', zh: '侍从', ja: 'ペイジ' },
  knight: { en: 'Knight', zh: '骑士', ja: 'ナイト' },
  queen: { en: 'Queen', zh: '王后', ja: 'クイーン' },
  king: { en: 'King', zh: '国王', ja: 'キング' }
};

/** Element names */
export const ELEMENT_NAMES: Record<Element, MultilingualText> = {
  fire: { en: 'Fire', zh: '火', ja: '火' },
  water: { en: 'Water', zh: '水', ja: '水' },
  air: { en: 'Air', zh: '风', ja: '風' },
  earth: { en: 'Earth', zh: '土', ja: '地' }
};

/** Element to suit mapping */
export const ELEMENT_SUIT_MAP: Record<Element, Suit> = {
  fire: 'wands',
  water: 'cups',
  air: 'swords',
  earth: 'pentacles'
};

/** Suit to element mapping */
export const SUIT_ELEMENT_MAP: Record<Suit, Element> = {
  wands: 'fire',
  cups: 'water',
  swords: 'air',
  pentacles: 'earth'
};

/** Numbered card names (Ace through Ten) */
export const NUMBER_NAMES: Record<number, MultilingualText> = {
  1: { en: 'Ace', zh: '王牌', ja: 'エース' },
  2: { en: 'Two', zh: '二', ja: '2' },
  3: { en: 'Three', zh: '三', ja: '3' },
  4: { en: 'Four', zh: '四', ja: '4' },
  5: { en: 'Five', zh: '五', ja: '5' },
  6: { en: 'Six', zh: '六', ja: '6' },
  7: { en: 'Seven', zh: '七', ja: '7' },
  8: { en: 'Eight', zh: '八', ja: '8' },
  9: { en: 'Nine', zh: '九', ja: '9' },
  10: { en: 'Ten', zh: '十', ja: '10' }
};

/** Yes/No answer terms */
export const YES_NO_TERMS: Record<string, MultilingualText> = {
  yes: { en: 'Yes', zh: '是', ja: 'はい' },
  no: { en: 'No', zh: '否', ja: 'いいえ' },
  maybe: { en: 'Maybe', zh: '也许', ja: 'たぶん' },
  strongYes: { en: 'Strong Yes', zh: '肯定是', ja: '絶対はい' }
};

/** Reading context terms */
export const CONTEXT_TERMS: Record<string, MultilingualText> = {
  love: { en: 'Love', zh: '爱情', ja: '恋愛' },
  career: { en: 'Career', zh: '事业', ja: '仕事' },
  health: { en: 'Health', zh: '健康', ja: '健康' },
  finance: { en: 'Finance', zh: '财运', ja: '財運' },
  family: { en: 'Family', zh: '家庭', ja: '家族' },
  friendship: { en: 'Friendship', zh: '友情', ja: '友情' },
  spiritual: { en: 'Spiritual', zh: '灵性', ja: '精神' },
  general: { en: 'General', zh: '综合', ja: '総合' }
};

/** Time-related terms */
export const TIME_TERMS: Record<string, MultilingualText> = {
  past: { en: 'Past', zh: '过去', ja: '過去' },
  present: { en: 'Present', zh: '现在', ja: '現在' },
  future: { en: 'Future', zh: '未来', ja: '未来' },
  today: { en: 'Today', zh: '今日', ja: '今日' },
  thisWeek: { en: 'This Week', zh: '本周', ja: '今週' },
  thisMonth: { en: 'This Month', zh: '本月', ja: '今月' },
  thisYear: { en: 'This Year', zh: '今年', ja: '今年' }
};
