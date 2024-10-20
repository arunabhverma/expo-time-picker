import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const WIDTH = 300;
const HEIGHT = WIDTH;

const RADIUS = WIDTH / 2;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;
const NUM_DIGITS = 12;
const DIGIT_CONTAINER = 50;

const CircularTimePicker = () => {
  const tickX = useSharedValue(0);
  const tickY = useSharedValue(0);
  const digits = [12, ...Array.from({ length: 11 }, (_, i) => i + 1)];

  const getCircularPosition = (index: number) => {
    const angle = (index / NUM_DIGITS) * (2 * Math.PI) - Math.PI / 2;
    const x = CENTER_X + RADIUS * Math.cos(angle);
    const y = CENTER_Y + RADIUS * Math.sin(angle);
    return { x, y, angle };
  };

  const pan = Gesture.Pan()
    .onStart((e) => {})
    .onChange((e) => {
      tickX.value += e.changeX;
      tickY.value += e.changeY;
    })
    .onFinalize(() => {});

  const animatedStyle = useAnimatedStyle(() => {
    const angle = Math.atan2(tickY.value, tickX.value) * (180 / Math.PI);
    return {
      transform: [
        { translateX: -RADIUS / 2 }, // Move origin horizontally (half the width of the needle)
        {
          rotate: `${angle}deg`,
        },
        { translateX: RADIUS / 2 }, // Translate back to original position (reverse of initial translation)
      ],
    };
  });

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <GestureDetector gesture={pan}>
          <View style={styles.watchMainWrapper}>
            <View style={styles.watchWrapper}>
              {digits.map((digit, index) => {
                const { x, y, angle } = getCircularPosition(index);

                return (
                  <View
                    key={`${index}`}
                    style={[
                      styles.digitContainer,
                      {
                        left: x,
                        top: y,
                        transform: [{ rotate: `${angle / Math.PI}deg` }],
                      },
                    ]}
                  >
                    <Text style={styles.digit}>{digit}</Text>
                  </View>
                );
              })}
            </View>
            <Animated.View
              style={[
                {
                  width: RADIUS,
                  height: 5,
                  backgroundColor: "red",
                  borderRadius: 10,
                  position: "absolute",
                  top: HEIGHT / 2 + 40 / 2,
                  left: WIDTH / 2 + 40 / 2,
                },
                animatedStyle,
              ]}
            />
          </View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  digitContainer: {
    width: DIGIT_CONTAINER,
    height: DIGIT_CONTAINER,
    borderRadius: DIGIT_CONTAINER / 2,
    backgroundColor: "red",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  watchMainWrapper: {
    padding: 10,
    backgroundColor: "lightgray",
    borderRadius: 2 * WIDTH,
  },
  watchWrapper: {
    width: WIDTH + DIGIT_CONTAINER,
    height: HEIGHT + DIGIT_CONTAINER,
    borderRadius: WIDTH,
  },
  digit: {
    fontSize: 30,
    fontWeight: "bold",
  },
});

export default CircularTimePicker;
