import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, TextStyle } from 'react-native';

interface AnimatedTitleProps {
  text: string;
  style?: TextStyle;
  duration?: number;
  springTension?: number;
  springFriction?: number;
  slideDistance?: number;
}

export default function AnimatedTitle({
  text,
  style,
  duration = 1000,
  springTension = 50,
  springFriction = 7,
  slideDistance = -50,
}: AnimatedTitleProps) {
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleScale = useRef(new Animated.Value(0.5)).current;
  const titleTranslateY = useRef(new Animated.Value(slideDistance)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: duration,
        useNativeDriver: true,
      }),
      Animated.spring(titleScale, {
        toValue: 1,
        tension: springTension,
        friction: springFriction,
        useNativeDriver: true,
      }),
      Animated.timing(titleTranslateY, {
        toValue: 0,
        duration: duration * 0.8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [titleOpacity, titleScale, titleTranslateY, duration, springTension, springFriction]);

  return (
    <Animated.Text
      style={[
        styles.defaultTitle,
        style,
        {
          opacity: titleOpacity,
          transform: [{ scale: titleScale }, { translateY: titleTranslateY }],
        },
      ]}
    >
      {text}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  defaultTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
});
