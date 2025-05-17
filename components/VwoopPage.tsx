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
  // Create multiple ripple animations
  const rippleAnim1 = useRef(new Animated.Value(0)).current;
  const rippleAnim2 = useRef(new Animated.Value(0)).current;
  const rippleAnim3 = useRef(new Animated.Value(0)).current;
  const [isNfcSupported, setIsNfcSupported] = useState(false);
  const [isNfcAvailable, setIsNfcAvailable] = useState(false);
  const [isNfcEnabled, setIsNfcEnabled] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check NFC support and status
    if (Platform.OS === 'android' && NfcModule) {
      NfcModule.isNfcSupported().then((supported: boolean) => {
        setIsNfcSupported(supported);
        setIsNfcAvailable(supported);
        if (supported) {
          NfcModule.isNfcEnabled().then((enabled: boolean) => {
            setIsNfcEnabled(enabled);
          });
        }
      }).catch((error: any) => {
        console.log('NFC support check failed:', error);
        setIsNfcSupported(false);
        setIsNfcAvailable(false);
      });
    } else {
      setIsNfcSupported(false);
      setIsNfcAvailable(false);
    }

    let nfcDiscoverySubscription: { remove: () => void } | null = null;
    if (Platform.OS === 'android' && NfcModule) {
      const eventEmitter = new NativeEventEmitter(NfcModule);
      nfcDiscoverySubscription = eventEmitter.addListener(
        'onNfcDiscovered',
        () => {
          // Start ripple animation when NFC is discovered
          startRippleAnimation();
          setIsConnected(true);
          // Reset connection state after animation
          setTimeout(() => setIsConnected(false), 2000);
        },
      );
    }

    // Create pulse animation (background circle)
    const pulseAnimation = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 0,
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]);

    // Create rotation animation (outer circle)
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
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
      rippleAnim1.setValue(0);
      rippleAnim2.setValue(0);
      rippleAnim3.setValue(0);
      if (nfcDiscoverySubscription) {
        nfcDiscoverySubscription.remove();
      }
    };
  }, [pulseAnim, rotateAnim, rippleAnim1, rippleAnim2, rippleAnim3]);

  const startRippleAnimation = () => {
    // Reset all ripple animations
    rippleAnim1.setValue(0);
    rippleAnim2.setValue(0);
    rippleAnim3.setValue(0);

    // Create ripple animations with different delays
    const createRippleAnimation = (anim: Animated.Value, delay: number) => {
      return Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 500,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]);
    };

    // Start all ripple animations
    Animated.parallel([
      createRippleAnimation(rippleAnim1, 0),
      createRippleAnimation(rippleAnim2, 200),
      createRippleAnimation(rippleAnim3, 400),
    ]).start();
  };

  const pulseStyle = {
    transform: [
      {
        scale: pulseAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.3],
        }),
      },
    ],
    opacity: pulseAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.6],
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

  // Create ripple styles with different scales and opacities
  const createRippleStyle = (anim: Animated.Value, scaleRange: [number, number], opacityRange: [number, number, number]) => ({
    transform: [
      {
        scale: anim.interpolate({
          inputRange: [0, 1],
          outputRange: scaleRange,
        }),
      },
    ],
    opacity: anim.interpolate({
      inputRange: [0, 0.3, 1],
      outputRange: opacityRange,
    }),
  });

  const rippleStyle1 = createRippleStyle(rippleAnim1, [1, 2.2], [0.8, 0.5, 0]);
  const rippleStyle2 = createRippleStyle(rippleAnim2, [1, 2.4], [0.7, 0.4, 0]);
  const rippleStyle3 = createRippleStyle(rippleAnim3, [1, 2.6], [0.6, 0.3, 0]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Vwoop!</Text>
        <Text style={styles.subtitle}>
          {isConnected
            ? 'Connected!'
            : isNfcAvailable
            ? 'Hold your phone near another user\'s phone to connect'
            : 'NFC is not available on this device.'}
        </Text>

        <View style={styles.animationContainer}>
          <Animated.View style={[styles.pulseCircle, pulseStyle]} />
          <Animated.View style={[styles.rippleCircle, rippleStyle1]} />
          <Animated.View style={[styles.rippleCircle, rippleStyle2]} />
          <Animated.View style={[styles.rippleCircle, rippleStyle3]} />
          <Animated.View style={[styles.rotatingCircle, rotateStyle]}>
            <View style={[styles.innerCircle, isConnected && styles.connectedInnerCircle]}>
              <Text style={styles.vwoopText}>V</Text>
            </View>
          </Animated.View>
        </View>

        <Text style={styles.instruction}>
          {isConnected
            ? 'Connection successful!'
            : isNfcAvailable
            ? 'Ready to connect - Hold near another phone to exchange contact information'
            : 'NFC is not available on this device.'}
        </Text>
        {!isNfcEnabled && isNfcSupported && (
          <Text style={styles.warning}>Please enable NFC in your device settings</Text>
        )}
        {!isNfcAvailable && Platform.OS === 'android' && (
          <Text style={styles.warning}>NFC is not supported on this device.</Text>
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
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  rippleCircle: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: 'rgba(128, 90, 213, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(128, 90, 213, 0.6)',
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
    overflow: 'hidden',
  },
  innerCircle: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    backgroundColor: '#805AD5',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  connectedInnerCircle: {
    backgroundColor: '#6B46C1',
    borderWidth: 2,
    borderColor: '#9F7AEA',
    transform: [{scale: 1.1}],
    overflow: 'hidden',
  },
  vwoopText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
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