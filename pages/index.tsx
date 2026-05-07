import { createRoute } from '@granite-js/react-native';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { questions } from '../src/data/questions';

export const Route = createRoute('/', {
  component: HomePage,
});

function HomePage() {
  const navigation = Route.useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleStart = () => {
    navigation.navigate('/quiz');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        <View style={styles.topSection}>
          <Text style={styles.label}>우회전 법규 퀴즈</Text>
          <Text style={styles.title}>우회전, 제대로 알고 있나요?</Text>
          <Text style={styles.subtitle}>
            우회전 단속 강화로 헷갈리는 법규, 퀴즈로 확인해보세요.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <InfoRow label="문항 수" value={`${questions.length}문항`} />
          <InfoRow label="문제 유형" value="O/X, 객관식" />
          <InfoRow label="소요 시간" value="약 3분" />
        </View>
      </Animated.View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.startButton} onPress={handleStart} activeOpacity={0.8}>
          <Text style={styles.startButtonText}>퀴즈 시작하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F4F6',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    gap: 16,
  },
  topSection: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3182F6',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#191F28',
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7684',
    lineHeight: 22,
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 15,
    color: '#6B7684',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#191F28',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 16,
  },
  startButton: {
    backgroundColor: '#3182F6',
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
