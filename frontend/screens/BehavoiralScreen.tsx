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
} from 'react-native';
import MascotBot from '../components/MascotBot';
import axios from 'axios';
import { auth } from '../services/firebase';

const API_BASE = 'http://localhost:8000';

interface QuestionResponse {
  question: string;
}

interface FeedbackResponse {
  feedback: {
    situation: string;
    task: string;
    action: string;
    result: string;
    overall_score: number;
  };
}

export default function BehavioralScreen() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackResponse['feedback'] | null>(null);
  const { width } = useWindowDimensions();
  const isWideScreen = width > 600;

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
    } catch (err) {
      console.error('Failed to fetch question:', err);
    }
    setLoading(false);
  };

  const submitAnswer = async () => {
    try {
      const user = auth.currentUser;
      const token = await user?.getIdToken();

      const res = await axios.post<FeedbackResponse>(
        `${API_BASE}/user/answer`,
        { question, answer },
        { headers: { Authorization: token } }
      );
      setFeedback(res.data.feedback);
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit answer:', err);
    }
  };

  return (
    <View style={styles.screenWrapper}>
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
              />

              <TouchableOpacity style={styles.button} onPress={submitAnswer}>
                <Text style={styles.buttonText}>Submit Answer</Text>
              </TouchableOpacity>

              {submitted && (
                <>
                  <Text style={styles.confirmation}>✅ Answer submitted!</Text>

                  {feedback && (
                    <View style={styles.feedbackBox}>
                      <Text style={styles.feedbackHeader}>Feedback</Text>
                      <Text>🧩 Situation: {feedback.situation}</Text>
                      <Text>🎯 Task: {feedback.task}</Text>
                      <Text>⚙️ Action: {feedback.action}</Text>
                      <Text>🏁 Result: {feedback.result}</Text>
                      <Text>📊 Overall Score: {feedback.overall_score}/10</Text>
                    </View>
                  )}
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
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
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
  confirmation: {
    marginTop: 12,
    color: 'green',
    textAlign: 'center',
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
  mascotWrapper: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
});
