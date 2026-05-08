import { InlineAd } from '@apps-in-toss/framework';
import { createRoute } from '@granite-js/react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { questions } from '../src/data/questions';

export const Route = createRoute('/quiz', {
  component: QuizPage,
});

type Answer = string | number;

function QuizPage() {
  const navigation = Route.useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);
  const scoreRef = useRef(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(12)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(12);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();

    Animated.timing(progressAnim, {
      toValue: (currentIndex + 1) / questions.length,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentIndex, fadeAnim, slideAnim, progressAnim]);

  const question = questions[currentIndex];
  if (!question) return null;

  const isAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === question.answer;
  const isLast = currentIndex === questions.length - 1;

  const handleSelectAnswer = (answer: Answer) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    if (answer === question.answer) {
      scoreRef.current += 1;
    }
  };

  const handleNext = () => {
    if (isLast) {
      navigation.navigate('/result', { score: scoreRef.current });
      return;
    }
    setSelectedAnswer(null);
    setCurrentIndex((i) => i + 1);
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
        <Text style={styles.progressText}>
          {currentIndex + 1} / {questions.length}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
          <View style={styles.questionCard}>
            <Text style={styles.questionTypeLabel}>
              {question.type === 'ox' ? 'O / X' : '객관식'}
            </Text>
            <Text style={styles.questionText}>{question.text}</Text>
          </View>

          {question.type === 'ox' ? (
            <View style={styles.oxContainer}>
              {(['O', 'X'] as const).map((opt) => (
                <OXButton
                  key={opt}
                  label={opt}
                  disabled={isAnswered}
                  selected={selectedAnswer === opt}
                  isCorrectAnswer={opt === question.answer}
                  showResult={isAnswered}
                  onPress={() => handleSelectAnswer(opt)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.optionsContainer}>
              {question.options?.map((opt, idx) => (
                <MultipleButton
                  key={idx}
                  label={opt}
                  index={idx}
                  disabled={isAnswered}
                  selected={selectedAnswer === idx}
                  isCorrectAnswer={idx === question.answer}
                  showResult={isAnswered}
                  onPress={() => handleSelectAnswer(idx)}
                />
              ))}
            </View>
          )}

          {isAnswered && (
            <View
              style={[
                styles.feedbackCard,
                { backgroundColor: isCorrect ? '#E8F9EE' : '#FFF0EF' },
              ]}
            >
              <Text
                style={[
                  styles.feedbackTitle,
                  { color: isCorrect ? '#00C853' : '#FF3B30' },
                ]}
              >
                {isCorrect ? '정답이에요' : '오답이에요'}
              </Text>
              <Text style={styles.feedbackText}>{question.explanation}</Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {isAnswered && (
        <View style={styles.bottomContainer}>
          <InlineAd
            adGroupId="ait.v2.live.8a819d7c24cd4f0c"
            theme="auto"
            tone="blackAndWhite"
            variant="expanded"
            impressFallbackOnMount={true}
          />
          <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.8}>
            <Text style={styles.nextButtonText}>
              {isLast ? '결과 보기' : '다음 문제'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

interface OXButtonProps {
  label: 'O' | 'X';
  selected: boolean;
  isCorrectAnswer: boolean;
  showResult: boolean;
  disabled: boolean;
  onPress: () => void;
}

function OXButton({ label, selected, isCorrectAnswer, showResult, disabled, onPress }: OXButtonProps) {
  const getButtonStyle = () => {
    if (!showResult) return selected ? styles.oxButtonSelected : styles.oxButton;
    if (isCorrectAnswer) return styles.oxButtonCorrect;
    if (selected && !isCorrectAnswer) return styles.oxButtonWrong;
    return styles.oxButtonDim;
  };

  const getTextStyle = () => {
    if (!showResult) return selected ? styles.oxLabelSelected : styles.oxLabel;
    if (isCorrectAnswer) return styles.oxLabelCorrect;
    if (selected && !isCorrectAnswer) return styles.oxLabelWrong;
    return styles.oxLabelDim;
  };

  return (
    <TouchableOpacity
      style={[styles.oxButtonBase, getButtonStyle()]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.oxLabelBase, getTextStyle()]}>{label}</Text>
    </TouchableOpacity>
  );
}

interface MultipleButtonProps {
  label: string;
  index: number;
  selected: boolean;
  isCorrectAnswer: boolean;
  showResult: boolean;
  disabled: boolean;
  onPress: () => void;
}

function MultipleButton({
  label,
  index,
  selected,
  isCorrectAnswer,
  showResult,
  disabled,
  onPress,
}: MultipleButtonProps) {
  const getButtonStyle = () => {
    if (!showResult) return selected ? styles.multiButtonSelected : styles.multiButton;
    if (isCorrectAnswer) return styles.multiButtonCorrect;
    if (selected && !isCorrectAnswer) return styles.multiButtonWrong;
    return styles.multiButton;
  };

  const getTextStyle = () => {
    if (!showResult) return selected ? styles.multiTextSelected : styles.multiText;
    if (isCorrectAnswer) return styles.multiTextCorrect;
    if (selected && !isCorrectAnswer) return styles.multiTextWrong;
    return styles.multiText;
  };

  return (
    <TouchableOpacity
      style={[styles.multiButtonBase, getButtonStyle()]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={styles.multiIndex}>{index + 1}</Text>
      <Text style={[styles.multiTextBase, getTextStyle()]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F4F6',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 8,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E8EB',
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3182F6',
  },
  progressText: {
    fontSize: 14,
    color: '#B0B8C1',
    textAlign: 'right',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 12,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 12,
    gap: 12,
  },
  questionTypeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3182F6',
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#191F28',
    lineHeight: 28,
  },
  oxContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  oxButtonBase: {
    flex: 1,
    height: 80,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  oxButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E8EB',
  },
  oxButtonSelected: {
    backgroundColor: '#EBF3FF',
    borderColor: '#3182F6',
  },
  oxButtonCorrect: {
    backgroundColor: '#E8F9EE',
    borderColor: '#00C853',
  },
  oxButtonWrong: {
    backgroundColor: '#FFF0EF',
    borderColor: '#FF3B30',
  },
  oxButtonDim: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E8EB',
  },
  oxLabelBase: {
    fontSize: 28,
    fontWeight: '700',
  },
  oxLabel: {
    color: '#333D4B',
  },
  oxLabelSelected: {
    color: '#3182F6',
  },
  oxLabelCorrect: {
    color: '#00C853',
  },
  oxLabelWrong: {
    color: '#FF3B30',
  },
  oxLabelDim: {
    color: '#B0B8C1',
  },
  optionsContainer: {
    gap: 8,
    marginBottom: 12,
  },
  multiButtonBase: {
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
  },
  multiButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E8EB',
  },
  multiButtonSelected: {
    backgroundColor: '#EBF3FF',
    borderColor: '#3182F6',
  },
  multiButtonCorrect: {
    backgroundColor: '#E8F9EE',
    borderColor: '#00C853',
  },
  multiButtonWrong: {
    backgroundColor: '#FFF0EF',
    borderColor: '#FF3B30',
  },
  multiIndex: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B0B8C1',
    width: 16,
    textAlign: 'center',
  },
  multiTextBase: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  multiText: {
    color: '#333D4B',
  },
  multiTextSelected: {
    color: '#3182F6',
    fontWeight: '600',
  },
  multiTextCorrect: {
    color: '#00C853',
    fontWeight: '600',
  },
  multiTextWrong: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  feedbackCard: {
    borderRadius: 16,
    padding: 20,
    gap: 8,
    marginBottom: 12,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  feedbackText: {
    fontSize: 15,
    color: '#6B7684',
    lineHeight: 22,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 16,
    gap: 12,
  },
  nextButton: {
    backgroundColor: '#3182F6',
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
