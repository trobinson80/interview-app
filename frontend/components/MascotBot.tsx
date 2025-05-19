import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  ImageSourcePropType,
  Image,
} from 'react-native';

type Props = {
  image: ImageSourcePropType;
  messages: string[];
  intervalMs?: number;
};

export default function MascotBot({ image, messages, intervalMs = 60000 }: Props) {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const [message, setMessage] = useState('');

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const updateMessage = () => {
      const index = Math.floor(Math.random() * messages.length);
      setMessage(messages[index]);
    };

    updateMessage();
    const interval = setInterval(updateMessage, intervalMs);
    return () => clearInterval(interval);
  }, [messages, intervalMs]);

  return (
    <View style={styles.wrapper}>
      {message && (
        <View style={styles.speechBubble}>
          <Text style={styles.speechText}>{message}</Text>
          <View style={styles.bubbleTail} />
        </View>
      )}
      <Animated.Image
        source={image}
        style={[styles.image, { transform: [{ translateY: floatAnim }] }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    alignItems: 'center',
  },
  speechBubble: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    maxWidth: 180,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    position: 'relative',
  },
  speechText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#333',
    textAlign: 'center',
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -6,
    left: '50%',
    marginLeft: -6,
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderTopColor: '#fff',
    borderLeftWidth: 6,
    borderLeftColor: 'transparent',
    borderRightWidth: 6,
    borderRightColor: 'transparent',
  },
  image: {
    width: 80,
    height: 80,
  },
});
