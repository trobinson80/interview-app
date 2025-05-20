import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  useWindowDimensions,
  Platform,
  ScrollView,
} from 'react-native';
import MascotBot from '../components/MascotBot';
import axios from 'axios';
import { auth } from '../services/firebase';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BehavioralStackParamList } from '../navigation/types';

const API_BASE = 'http://localhost:8000';

type NavigationProp = NativeStackNavigationProp<BehavioralStackParamList>;

interface QuestionResponse {
  question: string;
  id: string;
  session_id: string;
}

interface StarSection {
  response: string;
  clarity_score: string;
  completeness_score: string;
}

interface FeedbackResponse {
  situation: StarSection;
  task: StarSection;
  action: StarSection;
  result: StarSection;
  overall_score: string;
  feedback: string;
}

export default function BehavioralScreen() {
  const [question, setQuestion] = useState('');
  const [questionId, setQuestionId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
  const { width } = useWindowDimensions();
  const isWideScreen = width > 600;
  const navigation = useNavigation<NavigationProp>();

  const startSession = async () => {
    setLoading(true);
    setAnswer('');
    setSubmitted(false);
    setFeedback(null);
    try {
      const user = auth.currentUser;
      const token = await user?.getIdToken();

      const res = await axios.get<QuestionResponse>(`${API_BASE}/user/question`, {
        headers: { Authorization: token },
      });
      setQuestion(res.data.question);
      setQuestionId(res.data.id);
      setSessionId(res.data.session_id);
    } catch (err) {
      console.error('Failed to fetch question:', err);
    }
    setLoading(false);
  };

  const submitAnswer = async () => {
    setSubmitting(true);
    try {
      const user = auth.currentUser;
      const token = await user?.getIdToken();

      const res = await axios.post<FeedbackResponse>(
        `${API_BASE}/user/answer`,
        { question, answer, session_id: sessionId },
        { headers: { Authorization: token } }
      );
      setFeedback(res.data);
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit answer:', err);
    }
    setSubmitting(false);
  };

  const starKeys: (keyof Pick<FeedbackResponse, 'situation' | 'task' | 'action' | 'result'>)[] = ['situation', 'task', 'action', 'result'];

  return (
    <ScrollView contentContainerStyle={styles.screenWrapper}>
      <View style={styles.outer}>
        <View style={[styles.inner, isWideScreen && styles.innerWide]}>
          <Text style={styles.text}>Behavioral Practice</Text>

          {!question && !loading && (
            <TouchableOpacity style={styles.button} onPress={startSession}>
              <Text style={styles.buttonText}>Start New Session</Text>
            </TouchableOpacity>
          )}

          {loading && <ActivityIndicator size="large" color="#007bff" />}

          {question && (
            <>
              <View style={styles.questionBubble}>
                <Text style={styles.questionText}>{question}</Text>
              </View>

              <TextInput
                style={styles.textArea}
                value={answer}
                onChangeText={setAnswer}
                multiline
                placeholder="Type your answer here..."
                editable={!submitted}
              />

              {!submitted && (
                <TouchableOpacity
                  style={[styles.button, submitting && { backgroundColor: '#ccc' }]}
                  onPress={submitAnswer}
                  disabled={submitting}
                >
                  {submitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Submit Answer</Text>
                  )}
                </TouchableOpacity>
              )}

              {submitted && feedback && (
                <>
                  <View style={styles.feedbackBox}>
                    <Text style={styles.feedbackHeader}>Feedback</Text>
                    {starKeys.map((key) => {
                      const section = feedback[key];
                      return (
                        <View key={key} style={{ marginBottom: 10 }}>
                          <Text style={styles.starTitle}>{key.toUpperCase()}</Text>
                          <Text>{section.response}</Text>
                          <Text style={styles.scoreText}>
                            Clarity: {section.clarity_score} | Completeness: {section.completeness_score}
                          </Text>
                        </View>
                      );
                    })}
                    <Text style={styles.overallScore}>📊 Overall Score: {feedback.overall_score}</Text>
                    <Text style={styles.feedbackSummary}>{feedback.feedback}</Text>
                  </View>

                  <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PreviousSessions')}>
                    <Text style={styles.buttonText}>View Previous Sessions</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}
        </View>
      </View>

      <View style={styles.mascotWrapper}>
        <MascotBot
          image={require('../assets/Echo.png')}
          messages={[
            "Take a breath—what’s your STAR?",
            "Start with the situation, then flow.",
            "Stay present. You've got this.",
            "Speak from experience, not perfection.",
            "Progress, not perfection.",
          ]}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flexGrow: 1,
    backgroundColor: '#f4f4f4',
  },
  outer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  inner: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Platform.OS === 'web' ? 0.1 : 0.25,
    shadowRadius: 8,
  },
  innerWide: {
    maxWidth: 500,
    padding: 32,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  questionBubble: {
    backgroundColor: '#e0e0ff',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    width: '100%',
  },
  questionText: {
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 16,
    textAlignVertical: 'top',
    width: '100%',
  },
  feedbackBox: {
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
  },
  feedbackHeader: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 16,
  },
  starTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scoreText: {
    fontSize: 12,
    color: '#555',
  },
  overallScore: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 14,
  },
  feedbackSummary: {
    marginTop: 8,
    fontSize: 13,
    color: '#333',
  },
  mascotWrapper: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
});