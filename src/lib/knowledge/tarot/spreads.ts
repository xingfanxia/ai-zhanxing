/**
 * Tarot Spreads (牌阵 / スプレッド)
 * Common spread configurations for readings
 */

import type { TarotSpread, ThreeCardSpread, YesNoSpread } from './types';

/** Single Card Draw */
export const singleCardSpread: TarotSpread = {
  id: 'single-card',
  name: { en: 'Single Card Draw', zh: '单张牌', ja: '一枚引き' },
  cardCount: 1,
  positions: [
    {
      number: 1,
      name: { en: 'Daily Message', zh: '每日信息', ja: 'デイリーメッセージ' },
      meaning: 'Central theme or energy'
    }
  ],
  bestFor: ['Daily reflection', 'Quick guidance', 'Yes/No questions', 'Learning cards']
};

/** Three Card Spread with variations */
export const threeCardSpread: ThreeCardSpread = {
  id: 'three-card',
  name: { en: 'Three Card Spread', zh: '三张牌阵', ja: '3枚スプレッド' },
  cardCount: 3,
  variations: [
    {
      name: { en: 'Past-Present-Future', zh: '过去-现在-未来', ja: '過去-現在-未来' },
      positions: [
        { number: 1, name: { en: 'Past', zh: '过去', ja: '過去' }, meaning: 'Past influences' },
        { number: 2, name: { en: 'Present', zh: '现在', ja: '現在' }, meaning: 'Current situation' },
        { number: 3, name: { en: 'Future', zh: '未来', ja: '未来' }, meaning: 'Likely outcome' }
      ]
    },
    {
      name: { en: 'Situation-Action-Outcome', zh: '情况-行动-结果', ja: '状況-行動-結果' },
      positions: [
        { number: 1, name: { en: 'Situation', zh: '情况', ja: '状況' }, meaning: 'Current issue' },
        { number: 2, name: { en: 'Action', zh: '行动', ja: '行動' }, meaning: 'Recommended action' },
        { number: 3, name: { en: 'Outcome', zh: '结果', ja: '結果' }, meaning: 'Potential result' }
      ]
    },
    {
      name: { en: 'Mind-Body-Spirit', zh: '心灵-身体-精神', ja: '心-体-魂' },
      positions: [
        { number: 1, name: { en: 'Mind', zh: '心灵', ja: '心' }, meaning: 'Mental state' },
        { number: 2, name: { en: 'Body', zh: '身体', ja: '体' }, meaning: 'Physical state' },
        { number: 3, name: { en: 'Spirit', zh: '精神', ja: '魂' }, meaning: 'Spiritual state' }
      ]
    }
  ],
  bestFor: ['General guidance', 'Quick insights', 'Decision-making']
};

/** Celtic Cross Spread */
export const celticCrossSpread: TarotSpread = {
  id: 'celtic-cross',
  name: { en: 'Celtic Cross', zh: '凯尔特十字', ja: 'ケルト十字' },
  cardCount: 10,
  positions: [
    { number: 1, name: { en: 'Present', zh: '现状', ja: '現在' }, meaning: 'Current situation' },
    { number: 2, name: { en: 'Challenge', zh: '挑战', ja: '挑戦' }, meaning: 'Immediate obstacle' },
    { number: 3, name: { en: 'Foundation', zh: '基础', ja: '基盤' }, meaning: 'Root cause, distant past' },
    { number: 4, name: { en: 'Recent Past', zh: '近期过去', ja: '近い過去' }, meaning: 'Events recently passing' },
    { number: 5, name: { en: 'Crown', zh: '意识', ja: '意識' }, meaning: 'Goals, conscious thoughts' },
    { number: 6, name: { en: 'Unconscious', zh: '潜意识', ja: '無意識' }, meaning: 'Hidden influences' },
    { number: 7, name: { en: 'Self', zh: '自我', ja: '自己' }, meaning: 'How you see yourself' },
    { number: 8, name: { en: 'Environment', zh: '环境', ja: '環境' }, meaning: 'External influences' },
    { number: 9, name: { en: 'Hopes and Fears', zh: '希望与恐惧', ja: '希望と恐れ' }, meaning: 'Secret desires and anxieties' },
    { number: 10, name: { en: 'Outcome', zh: '结果', ja: '結果' }, meaning: 'Final resolution' }
  ],
  bestFor: ['Complex situations', 'Comprehensive readings', 'Major life decisions']
};

/** Relationship Spread */
export const relationshipSpread: TarotSpread = {
  id: 'relationship',
  name: { en: 'Relationship Spread', zh: '感情牌阵', ja: '恋愛スプレッド' },
  cardCount: 7,
  positions: [
    { number: 1, name: { en: 'You', zh: '你', ja: 'あなた' }, meaning: 'Your role in relationship' },
    { number: 2, name: { en: 'Partner', zh: '伴侣', ja: 'パートナー' }, meaning: "Partner's role" },
    { number: 3, name: { en: 'Relationship', zh: '关系', ja: '関係' }, meaning: 'Current dynamic' },
    { number: 4, name: { en: 'Strengths', zh: '优势', ja: '強み' }, meaning: 'What unites you' },
    { number: 5, name: { en: 'Challenges', zh: '挑战', ja: '課題' }, meaning: 'Obstacles to overcome' },
    { number: 6, name: { en: 'Advice', zh: '建议', ja: 'アドバイス' }, meaning: 'Guidance for improvement' },
    { number: 7, name: { en: 'Outcome', zh: '结果', ja: '結果' }, meaning: 'Potential future' }
  ],
  bestFor: ['Understanding relationship dynamics', 'Compatibility', 'Improving communication']
};

/** Career Spread */
export const careerSpread: TarotSpread = {
  id: 'career',
  name: { en: 'Career Spread', zh: '事业牌阵', ja: '仕事スプレッド' },
  cardCount: 5,
  positions: [
    { number: 1, name: { en: 'Current Position', zh: '现状', ja: '現在の状況' }, meaning: 'Where you stand professionally' },
    { number: 2, name: { en: 'Challenges', zh: '挑战', ja: '課題' }, meaning: "What's blocking progress" },
    { number: 3, name: { en: 'Strengths', zh: '优势', ja: '強み' }, meaning: 'Skills to leverage' },
    { number: 4, name: { en: 'Advice', zh: '建议', ja: 'アドバイス' }, meaning: 'Recommended approach' },
    { number: 5, name: { en: 'Outcome', zh: '结果', ja: '結果' }, meaning: 'Career potential' }
  ],
  bestFor: ['Career decisions', 'Job changes', 'Professional growth']
};

/** Yes/No Spread */
export const yesNoSpread: YesNoSpread = {
  id: 'yes-no',
  name: { en: 'Yes/No Spread', zh: '是否牌阵', ja: 'イエス・ノースプレッド' },
  cardCount: '1 or 3',
  methods: {
    singleCard: { upright: 'Yes', reversed: 'No' },
    threeCard: { majorityUpright: 'Yes', majorityReversed: 'No' }
  },
  yesCards: ['The Sun', 'The Star', 'The World', 'Ace of Cups', 'Six of Wands', 'Nine of Cups', 'Ten of Cups'],
  noCards: ['The Tower', 'Five of Cups', 'Three of Swords', 'Ten of Swords', 'Five of Pentacles', 'Nine of Swords'],
  maybeCards: ['The Moon', 'Two of Swords', 'Seven of Cups', 'The Hanged Man'],
  bestFor: ['Simple yes/no decisions', 'Quick guidance']
};

/** Horseshoe Spread */
export const horseshoeSpread: TarotSpread = {
  id: 'horseshoe',
  name: { en: 'Horseshoe Spread', zh: '马蹄形牌阵', ja: '馬蹄形スプレッド' },
  cardCount: 7,
  positions: [
    { number: 1, name: { en: 'Past', zh: '过去', ja: '過去' }, meaning: 'Past influences and events' },
    { number: 2, name: { en: 'Present', zh: '现在', ja: '現在' }, meaning: 'Current situation' },
    { number: 3, name: { en: 'Future', zh: '未来', ja: '未来' }, meaning: 'What lies ahead' },
    { number: 4, name: { en: 'Your Approach', zh: '你的态度', ja: 'あなたのアプローチ' }, meaning: 'How you are handling the situation' },
    { number: 5, name: { en: "Others' Attitudes", zh: '他人态度', ja: '他者の態度' }, meaning: "How others perceive and affect you" },
    { number: 6, name: { en: 'What to Do', zh: '应该做什么', ja: 'すべきこと' }, meaning: 'Recommended course of action' },
    { number: 7, name: { en: 'Outcome', zh: '结果', ja: '結果' }, meaning: 'Final resolution' }
  ],
  bestFor: ['Specific problems', 'Multi-faceted situations', 'General guidance']
};

/** Star Spread */
export const starSpread: TarotSpread = {
  id: 'star',
  name: { en: 'Star Spread', zh: '星星牌阵', ja: '星のスプレッド' },
  cardCount: 6,
  positions: [
    { number: 1, name: { en: 'Issue at Heart', zh: '核心问题', ja: '核心の問題' }, meaning: 'The central matter at hand' },
    { number: 2, name: { en: 'What You Need', zh: '你需要什么', ja: '必要なこと' }, meaning: 'What is required for resolution' },
    { number: 3, name: { en: "What You Don't Know", zh: '你不知道的', ja: '知らないこと' }, meaning: 'Hidden information or blind spots' },
    { number: 4, name: { en: 'Root of Issue', zh: '问题根源', ja: '問題の根源' }, meaning: 'The underlying cause' },
    { number: 5, name: { en: 'What You Can Change', zh: '可以改变的', ja: '変えられること' }, meaning: 'Areas within your control' },
    { number: 6, name: { en: 'Resolution', zh: '解决方案', ja: '解決策' }, meaning: 'How the matter may resolve' }
  ],
  bestFor: ['Deep insight', 'Problem solving', 'Self-reflection']
};

/** Wheel of Fortune Spread */
export const wheelOfFortuneSpread: TarotSpread = {
  id: 'wheel-of-fortune',
  name: { en: 'Wheel of Fortune', zh: '命运之轮牌阵', ja: '運命の輪スプレッド' },
  cardCount: 4,
  positions: [
    { number: 1, name: { en: 'Past Influence', zh: '过去影响', ja: '過去の影響' }, meaning: 'What has shaped your current situation' },
    { number: 2, name: { en: 'Present State', zh: '现状', ja: '現在の状態' }, meaning: 'Where you stand now' },
    { number: 3, name: { en: 'Future Direction', zh: '未来方向', ja: '未来の方向' }, meaning: 'Where you are headed' },
    { number: 4, name: { en: "Fate's Message", zh: '命运启示', ja: '運命のメッセージ' }, meaning: "The universe's guidance for you" }
  ],
  bestFor: ['Understanding life cycles', 'Fate and destiny questions', 'Quick comprehensive overview']
};

/** All spreads collection */
export const allSpreads = [
  singleCardSpread,
  threeCardSpread,
  celticCrossSpread,
  relationshipSpread,
  careerSpread,
  yesNoSpread,
  horseshoeSpread,
  starSpread,
  wheelOfFortuneSpread
];
