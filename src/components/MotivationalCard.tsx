import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const quotes = [
  { text: "La discipline est le pont entre les objectifs et la réussite.", author: "Jim Rohn" },
  { text: "Le secret de ton futur est caché dans ta routine quotidienne.", author: "Mike Murdock" },
  { text: "Ne limite pas tes défis, défie tes limites.", author: "Inconnu" },
  { text: "Commence là où tu es. Utilise ce que tu as. Fais ce que tu peux.", author: "Arthur Ashe" },
  { text: "La seule mauvaise routine est celle que l'on n'a pas commencée.", author: "Inconnu" },
];

export function MotivationalCard() {
  const quote = useMemo(() => {
    const day = new Date().getDate();
    return quotes[day % quotes.length];
  }, []);

  return (
    <View style={styles.card}>
      <Text style={styles.quoteText}>"{quote.text}"</Text>
      <Text style={styles.authorText}>— {quote.author}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    borderColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    marginVertical: 12,
    width: '100%',
  },
  quoteText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    fontStyle: 'italic',
    lineHeight: 20,
    textAlign: 'center',
  },
  authorText: {
    color: '#8A9CAE',
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'right',
    marginTop: 10,
    letterSpacing: 0.5,
  },
});
