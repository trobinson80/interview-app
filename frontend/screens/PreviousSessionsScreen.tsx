import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import { auth } from '../services/firebase';

const API_BASE = 'http://localhost:8000';

interface Metric {
  timestamp: string;
  overall_clarity: number;
  overall_completeness: number;
}

export default function PreviousSessionsScreen() {
  const [view, setView] = useState<'sessions' | 'data'>('sessions');
  const [range, setRange] = useState<'7' | '30'>('7');
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const { width } = useWindowDimensions();
  const isWideScreen = width > 800;
  const navigation = useNavigation();

  useEffect(() => {
    if (view === 'data') {
      const fetchMetrics = async () => {
        try {
          const user = auth.currentUser;
          const token = await user?.getIdToken();
          const res = await axios.get<{ metrics: Metric[] }>(`${API_BASE}/user/session-metrics`, {
            params: { days: range },
            headers: { Authorization: token },
          });
          setMetrics(res.data.metrics);
        } catch (err) {
          console.error('Error fetching metrics', err);
        }
      };
      fetchMetrics();
    }
  }, [view, range]);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.wrapper, isWideScreen && styles.wrapperWide]}>
        <View style={styles.toggleBar}>
          <TouchableOpacity
            style={[styles.toggleButton, view === 'sessions' && styles.activeButton]}
            onPress={() => setView('sessions')}
          >
            <Text style={styles.toggleText}>Previous Sessions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, view === 'data' && styles.activeButton]}
            onPress={() => setView('data')}
          >
            <Text style={styles.toggleText}>Data</Text>
          </TouchableOpacity>
        </View>

        {view === 'sessions' ? (
          <View style={styles.content}><Text>List of previous sessions will go here</Text></View>
        ) : (
          <View style={styles.content}>
            <View style={styles.rangeToggle}>
              <TouchableOpacity
                style={[styles.rangeButton, range === '7' && styles.activeRange]}
                onPress={() => setRange('7')}
              >
                <Text style={styles.rangeText}>Last 7 Days</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.rangeButton, range === '30' && styles.activeRange]}
                onPress={() => setRange('30')}
              >
                <Text style={styles.rangeText}>Last 30 Days</Text>
              </TouchableOpacity>
            </View>
            {metrics.length > 0 ? (
              <View style={styles.chartContainer}>
                <LineChart
                  data={{
                    labels: metrics.map(m => formatDate(m.timestamp)),
                    datasets: [
                      {
                        data: metrics.map(m => m.overall_clarity || 0),
                        color: () => '#007bff',
                        strokeWidth: 2,
                      },
                      {
                        data: metrics.map(m => m.overall_completeness || 0),
                        color: () => '#28a745',
                        strokeWidth: 2,
                      },
                    ],
                    legend: ['Clarity', 'Completeness'],
                  }}
                  width={isWideScreen ? 640 : width - 64}
                  height={240}
                  yAxisSuffix=""
                  chartConfig={{
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    propsForDots: {
                      r: '4',
                      strokeWidth: '2',
                      stroke: '#007bff',
                    },
                  }}
                  bezier
                  style={{ borderRadius: 8 }}
                />
              </View>
            ) : (
              <Text>No data available</Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    paddingVertical: 32,
  },
  wrapper: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Platform.OS === 'web' ? 0.1 : 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  wrapperWide: {
    maxWidth: 700,
  },
  toggleBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  activeButton: {
    backgroundColor: '#007bff',
  },
  toggleText: {
    color: '#000',
    fontWeight: 'bold',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rangeToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  rangeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#ddd',
  },
  activeRange: {
    backgroundColor: '#007bff',
  },
  rangeText: {
    fontWeight: '600',
  },
  chartContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
});