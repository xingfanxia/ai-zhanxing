"use client";

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#1e293b',
    color: '#f1f5f9',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2px solid #ec4899',
    paddingBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f9a8d4',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#94a3b8',
  },
  question: {
    fontSize: 14,
    color: '#e2e8f0',
    fontStyle: 'italic',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#334155',
    borderRadius: 6,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f472b6',
    marginBottom: 10,
    borderBottom: '1px solid #475569',
    paddingBottom: 5,
  },
  cardContainer: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#334155',
    borderRadius: 8,
    borderLeft: '4px solid #ec4899',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f9a8d4',
  },
  cardPosition: {
    fontSize: 10,
    color: '#94a3b8',
  },
  cardOrientation: {
    fontSize: 10,
    color: '#fbbf24',
    backgroundColor: '#422006',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardKeywords: {
    fontSize: 9,
    color: '#cbd5e1',
    marginBottom: 6,
  },
  cardMeaning: {
    fontSize: 10,
    color: '#94a3b8',
    lineHeight: 1.4,
  },
  interpretation: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#cbd5e1',
    marginTop: 10,
    padding: 15,
    backgroundColor: '#334155',
    borderRadius: 6,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#64748b',
  },
});

interface TarotCard {
  name: string | { en: string; zh: string };
  position?: string | { en: string; zh: string };
  reversed?: boolean;
  keywords?: string[];
  upright?: string;
  reversedMeaning?: string;
}

interface TarotPDFProps {
  cards: TarotCard[];
  question?: string;
  spreadType: string;
  interpretation?: string;
  createdAt?: string;
}

export function TarotPDF({ cards, question, spreadType, interpretation, createdAt }: TarotPDFProps) {
  const formatSpreadType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getCardName = (card: TarotCard): string => {
    if (typeof card.name === 'string') return card.name;
    return card.name?.en || 'Unknown Card';
  };

  const getPosition = (card: TarotCard): string => {
    if (!card.position) return '';
    if (typeof card.position === 'string') return card.position;
    return card.position?.en || '';
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return new Date().toLocaleDateString();
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Tarot Reading</Text>
          <Text style={styles.subtitle}>
            {formatSpreadType(spreadType)} · {formatDate(createdAt)}
          </Text>
        </View>

        {/* Question */}
        {question && (
          <View style={styles.question}>
            <Text>"{question}"</Text>
          </View>
        )}

        {/* Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Cards</Text>
          {cards.map((card, idx) => (
            <View key={idx} style={styles.cardContainer}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.cardName}>{getCardName(card)}</Text>
                  {getPosition(card) && (
                    <Text style={styles.cardPosition}>{getPosition(card)}</Text>
                  )}
                </View>
                {card.reversed && (
                  <Text style={styles.cardOrientation}>Reversed</Text>
                )}
              </View>
              {card.keywords && card.keywords.length > 0 && (
                <Text style={styles.cardKeywords}>
                  {card.keywords.join(' · ')}
                </Text>
              )}
              {(card.reversed ? card.reversedMeaning : card.upright) && (
                <Text style={styles.cardMeaning}>
                  {card.reversed ? card.reversedMeaning : card.upright}
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* Interpretation */}
        {interpretation && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI Interpretation</Text>
            <Text style={styles.interpretation}>{interpretation}</Text>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Generated by AI Zhanxing · astro.ax0x.ai
        </Text>
      </Page>
    </Document>
  );
}

export default TarotPDF;
