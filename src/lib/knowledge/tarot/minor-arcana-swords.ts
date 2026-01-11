/**
 * Minor Arcana - Suit of Swords (宝剑 / ソード)
 * Element: Air | Themes: Intellect, conflict, truth, decisions, communication
 * Zodiac: Libra, Aquarius, Gemini
 */

import type { MinorArcanaCard } from './types';

export const swordsCards: MinorArcanaCard[] = [
  {
    number: 1,
    name: { en: 'Ace of Swords', zh: '宝剑王牌', ja: 'ソードのエース' },
    arcana: 'minor',
    suit: 'swords',
    keywords: ['breakthrough', 'clarity', 'new ideas', 'truth', 'mental power', 'justice'],
    upright: 'Mental breakthrough, clarity of thought. New idea or perspective. Truth revealed.',
    reversed: 'Confusion, chaos, lack of clarity, misinformation, clouded judgment.',
    decan: 'Root of Air',
    yesNo: 'Yes'
  },
  {
    number: 2,
    name: { en: 'Two of Swords', zh: '宝剑二', ja: 'ソードの2' },
    arcana: 'minor',
    suit: 'swords',
    keywords: ['difficult decisions', 'stalemate', 'indecision', 'avoidance', 'blocked emotions'],
    upright: 'Difficult decision, stalemate. Refusing to see the truth. Blocked emotions.',
    reversed: 'Information revealed, decision made, seeing clearly.',
    decan: 'Moon in Libra',
    yesNo: 'Maybe'
  },
  {
    number: 3,
    name: { en: 'Three of Swords', zh: '宝剑三', ja: 'ソードの3' },
    arcana: 'minor',
    suit: 'swords',
    keywords: ['heartbreak', 'emotional pain', 'sorrow', 'grief', 'separation', 'betrayal'],
    upright: 'Heartbreak and emotional pain. Grief, sorrow, separation. Painful truth.',
    reversed: 'Recovery from pain, forgiveness, releasing grief, healing.',
    decan: 'Saturn in Libra',
    yesNo: 'No'
  },
  {
    number: 4,
    name: { en: 'Four of Swords', zh: '宝剑四', ja: 'ソードの4' },
    arcana: 'minor',
    suit: 'swords',
    keywords: ['rest', 'relaxation', 'meditation', 'recuperation', 'contemplation', 'recovery'],
    upright: 'Rest and recuperation. Mental retreat. Taking time to recover.',
    reversed: 'Restlessness, burnout, refusing to rest, stagnation.',
    decan: 'Jupiter in Libra',
    yesNo: 'Yes'
  },
  {
    number: 5,
    name: { en: 'Five of Swords', zh: '宝剑五', ja: 'ソードの5' },
    arcana: 'minor',
    suit: 'swords',
    keywords: ['conflict', 'defeat', 'winning at all costs', 'tension', 'loss', 'hostility'],
    upright: 'Conflict and defeat. Hollow victory. Winning at all costs.',
    reversed: 'Reconciliation, making amends, moving past conflict.',
    decan: 'Venus in Aquarius',
    yesNo: 'No'
  },
  {
    number: 6,
    name: { en: 'Six of Swords', zh: '宝剑六', ja: 'ソードの6' },
    arcana: 'minor',
    suit: 'swords',
    keywords: ['transition', 'moving on', 'leaving behind', 'change', 'travel', 'healing'],
    upright: 'Transition and moving on. Leaving troubled waters behind. Travel.',
    reversed: 'Unable to move on, resistance to change, unfinished business.',
    decan: 'Mercury in Aquarius',
    yesNo: 'Yes'
  },
  {
    number: 7,
    name: { en: 'Seven of Swords', zh: '宝剑七', ja: 'ソードの7' },
    arcana: 'minor',
    suit: 'swords',
    keywords: ['deception', 'betrayal', 'strategy', 'secrecy', 'stealth', 'getting away'],
    upright: 'Deception and betrayal. Acting in secret. Strategic thinking.',
    reversed: 'Coming clean, conscience, getting caught, confession.',
    decan: 'Moon in Aquarius',
    yesNo: 'No'
  },
  {
    number: 8,
    name: { en: 'Eight of Swords', zh: '宝剑八', ja: 'ソードの8' },
    arcana: 'minor',
    suit: 'swords',
    keywords: ['restriction', 'entrapment', 'self-limitation', 'victim mentality', 'imprisonment'],
    upright: 'Feeling trapped by circumstances. Self-imposed limitations. Victim mentality.',
    reversed: 'Freedom, release, seeing options, empowerment.',
    decan: 'Jupiter in Gemini',
    yesNo: 'No'
  },
  {
    number: 9,
    name: { en: 'Nine of Swords', zh: '宝剑九', ja: 'ソードの9' },
    arcana: 'minor',
    suit: 'swords',
    keywords: ['anxiety', 'worry', 'fear', 'nightmares', 'insomnia', 'despair', 'anguish'],
    upright: 'Anxiety and worry. Nightmares and fear. Worst-case thinking.',
    reversed: 'Hope, reaching out, releasing worry, seeing perspective.',
    decan: 'Mars in Gemini',
    yesNo: 'No'
  },
  {
    number: 10,
    name: { en: 'Ten of Swords', zh: '宝剑十', ja: 'ソードの10' },
    arcana: 'minor',
    suit: 'swords',
    keywords: ['painful ending', 'rock bottom', 'betrayal', 'defeat', 'crisis', 'finality'],
    upright: 'Painful ending, rock bottom. Betrayal and defeat. Darkest before dawn.',
    reversed: 'Recovery, regeneration, worst is over, rising again.',
    decan: 'Sun in Gemini',
    yesNo: 'No'
  },
  {
    number: 11,
    name: { en: 'Page of Swords', zh: '宝剑侍从', ja: 'ソードのペイジ' },
    arcana: 'minor',
    suit: 'swords',
    keywords: ['curiosity', 'new ideas', 'thirst for knowledge', 'communication', 'vigilance'],
    upright: 'Curious mind, new ideas. Thirst for knowledge. Vigilant communication.',
    reversed: 'Deception, manipulation, all talk no action, gossip.',
    decan: 'Earth of Air',
    yesNo: 'Maybe'
  },
  {
    number: 12,
    name: { en: 'Knight of Swords', zh: '宝剑骑士', ja: 'ソードのナイト' },
    arcana: 'minor',
    suit: 'swords',
    keywords: ['ambitious', 'action-oriented', 'driven', 'assertive', 'fast-thinking', 'direct'],
    upright: 'Ambitious action, driven pursuit of goals. Direct communication.',
    reversed: 'Reckless, tactless, scattered, aggressive without direction.',
    decan: 'Fire of Air (Aquarius)',
    yesNo: 'Yes'
  },
  {
    number: 13,
    name: { en: 'Queen of Swords', zh: '宝剑王后', ja: 'ソードのクイーン' },
    arcana: 'minor',
    suit: 'swords',
    keywords: ['independent', 'clear boundaries', 'perceptive', 'honest', 'unbiased', 'direct'],
    upright: 'Independent thinker, clear boundaries. Direct and honest communication.',
    reversed: 'Cold, bitter, cruel, overly critical, isolated.',
    decan: 'Water of Air (Libra)',
    yesNo: 'Yes'
  },
  {
    number: 14,
    name: { en: 'King of Swords', zh: '宝剑国王', ja: 'ソードのキング' },
    arcana: 'minor',
    suit: 'swords',
    keywords: ['mental clarity', 'intellectual power', 'authority', 'truth', 'ethics', 'logic'],
    upright: 'Mental clarity and authority. Ethical decision-making. Intellectual leadership.',
    reversed: 'Manipulation, cruelty, abuse of power, cold ruthlessness.',
    decan: 'Air of Air (Gemini)',
    yesNo: 'Yes'
  }
];
