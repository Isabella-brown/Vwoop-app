import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  TouchableOpacity,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';

const {width, height} = Dimensions.get('window');
const {NfcModule} = NativeModules;

const VwoopPage: React.FC = () => {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;
  const [isHceEnabled, setIsHceEnabled] = useState(false);
  const [isNfcSupported, setIsNfcSupported] = useState(false);
  const [isNfcEnabled, setIsNfcEnabled] = useState(false);

  useEffect(() => {
    // Check NFC support and status
    if (Platform.OS === 'android') {
      NfcModule.isNfcSupported().then((supported: boolean) => {
        setIsNfcSupported(supported);
        if (supported) {
          NfcModule.isNfcEnabled().then((enabled: boolean) => {
            setIsNfcEnabled(enabled);
          });
        }
      });
    }

    // Set up event listeners
    const eventEmitter = new NativeEventEmitter(NfcModule);
    const hceStateSubscription = eventEmitter.addListener(
      'onHceStateChanged',
      (enabled: boolean) => {
        setIsHceEnabled(enabled);
        if (enabled) {
          // Start ripple animation when HCE is enabled
          startRippleAnimation();
        }
      },
    );

    // Create pulse animation
    const pulseAnimation = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 0,
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]);

    // Create rotation animation
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    // Start animations
    Animated.loop(pulseAnimation).start();
    rotateAnimation.start();

    return () => {
      pulseAnim.setValue(0);
      rotateAnim.setValue(0);
      rippleAnim.setValue(0);
      hceStateSubscription.remove();
    };
  }, [pulseAnim, rotateAnim, rippleAnim]);

  const startRippleAnimation = () => {
    rippleAnim.setValue(0);
    Animated.sequence([
      Animated.timing(rippleAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(rippleAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleVwoopPress = async () => {
    if (Platform.OS === 'android' && isNfcSupported && isNfcEnabled) {
      try {
        const newState = await NfcModule.toggleHce();
        setIsHceEnabled(newState);
      } catch (error) {
        console.error('Error toggling HCE:', error);
      }
    }
  };

  const pulseStyle = {
    transform: [
      {
        scale: pulseAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.2],
        }),
      },
    ],
    opacity: pulseAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1],
    }),
  };

  const rotateStyle = {
    transform: [
      {
        rotate: rotateAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
  };

  const rippleStyle = {
    transform: [
      {
        scale: rippleAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 2],
        }),
      },
    ],
    opacity: rippleAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.5, 0.8, 0],
    }),
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Vwoop!</Text>
        <Text style={styles.subtitle}>
          {isHceEnabled
            ? 'HCE Mode: Ready to connect'
            : 'Touch your phone with another user to connect'}
        </Text>

        <View style={styles.animationContainer}>
          <Animated.View style={[styles.pulseCircle, pulseStyle]} />
          <Animated.View style={[styles.rippleCircle, rippleStyle]} />
          <TouchableOpacity
            onPress={handleVwoopPress}
            disabled={!isNfcSupported || !isNfcEnabled}>
            <Animated.View style={[styles.rotatingCircle, rotateStyle]}>
              <View style={[styles.innerCircle, isHceEnabled && styles.activeInnerCircle]}>
                <Text style={styles.vwoopText}>V</Text>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </View>

        <Text style={styles.instruction}>
          {isHceEnabled
            ? 'HCE Mode Active - Hold near another phone to connect'
            : 'Hold your phone near another user\'s phone to exchange contact information'}
        </Text>
        {!isNfcEnabled && isNfcSupported && (
          <Text style={styles.warning}>Please enable NFC in your device settings</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 40,
  },
  animationContainer: {
    width: width * 0.7,
    height: width * 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  pulseCircle: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  rippleCircle: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: 'rgba(128, 90, 213, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(128, 90, 213, 0.4)',
  },
  rotatingCircle: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  innerCircle: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    backgroundColor: '#805AD5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeInnerCircle: {
    backgroundColor: '#6B46C1',
    borderWidth: 2,
    borderColor: '#9F7AEA',
  },
  vwoopText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  instruction: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    maxWidth: width * 0.8,
    lineHeight: 24,
  },
  warning: {
    fontSize: 14,
    color: '#FC8181',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default VwoopPage; 