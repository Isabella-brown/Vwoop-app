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
  Alert,
} from 'react-native';

const {width, height} = Dimensions.get('window');
const {NfcModule} = NativeModules;

const VwoopPage: React.FC = () => {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;
  const spinButtonAnim = useRef(new Animated.Value(0)).current;
  const [isHceEnabled, setIsHceEnabled] = useState(false);
  const [isNfcSupported, setIsNfcSupported] = useState(false);
  const [isNfcEnabled, setIsNfcEnabled] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    // Check NFC support and status
    if (Platform.OS === 'android') {
      NfcModule.isNfcSupported().then((supported: boolean) => {
        setIsNfcSupported(supported);
        if (supported) {
          NfcModule.isNfcEnabled().then((enabled: boolean) => {
            setIsNfcEnabled(enabled);
          });
          
          // Check initial HCE state
          NfcModule.isHceEnabled().then((enabled: boolean) => {
            setIsHceEnabled(enabled);
          }).catch((err: Error) => {
            console.error('Error checking HCE state:', err);
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
      spinButtonAnim.setValue(0);
      hceStateSubscription.remove();
    };
  }, [pulseAnim, rotateAnim, rippleAnim, spinButtonAnim]);

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
        setIsToggling(true);
        
        // Spin animation for button press feedback
        Animated.timing(spinButtonAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start(() => {
          spinButtonAnim.setValue(0);
        });
        
        const newState = await NfcModule.toggleHce();
        setIsHceEnabled(newState);
        
        // Visual feedback
        if (newState) {
          startRippleAnimation();
        }
        
        setIsToggling(false);
      } catch (error) {
        console.error('Error toggling HCE:', error);
        Alert.alert('Error', 'Failed to toggle HCE mode. Please try again.');
        setIsToggling(false);
      }
    } else if (Platform.OS === 'android' && isNfcSupported && !isNfcEnabled) {
      Alert.alert(
        'NFC Required',
        'Please enable NFC in your device settings to use this feature.',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]
      );
    } else if (Platform.OS !== 'android') {
      Alert.alert(
        'Android Only Feature',
        'This feature is currently available only on Android devices.',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]
      );
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

  const spinButtonStyle = {
    transform: [
      {
        rotate: spinButtonAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      },
      {
        scale: spinButtonAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1, 1.3, 1],
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
        
        {/* Mode banner at the top */}
        <View style={[
          styles.modeBanner, 
          isHceEnabled ? styles.hceBanner : styles.nfcBanner
        ]}>
          <Text style={styles.modeText}>
            {isHceEnabled ? 'HCE MODE ACTIVE' : 'NFC READER MODE'}
          </Text>
        </View>
        
        <Text style={styles.subtitle}>
          {isHceEnabled
            ? 'Ready to be scanned by another device'
            : 'Touch your phone with another user to connect'}
        </Text>

        <View style={styles.animationContainer}>
          <Animated.View style={[
            styles.pulseCircle, 
            pulseStyle, 
            isHceEnabled && styles.hcePulseCircle
          ]} />
          <Animated.View style={[
            styles.rippleCircle, 
            rippleStyle, 
            isHceEnabled && styles.hceRippleCircle
          ]} />
          <TouchableOpacity
            onPress={handleVwoopPress}
            disabled={isToggling || (!isNfcSupported && Platform.OS === 'android')}>
            <Animated.View style={[styles.rotatingCircle, rotateStyle]}>
              <Animated.View style={[
                styles.innerCircle, 
                isHceEnabled && styles.activeInnerCircle,
                spinButtonStyle
              ]}>
                <Text style={[
                  styles.vwoopText,
                  isHceEnabled && styles.activeVwoopText
                ]}>
                  {isHceEnabled ? 'H' : 'N'}
                </Text>
              </Animated.View>
            </Animated.View>
          </TouchableOpacity>
        </View>

        <Text style={styles.instruction}>
          {isHceEnabled
            ? 'HCE Mode Active - Hold near another phone to connect'
            : 'Hold your phone near another user\'s phone to exchange contact information'}
        </Text>
        
        {!isNfcEnabled && isNfcSupported && Platform.OS === 'android' && (
          <Text style={styles.warning}>Please enable NFC in your device settings</Text>
        )}
        
        <View style={[
          styles.modeIndicator,
          isHceEnabled ? styles.hceModeIndicator : styles.nfcModeIndicator
        ]}>
          <Text style={styles.modeIndicatorText}>
            Current Mode: {isHceEnabled ? 'HCE (Host Card Emulation)' : 'NFC Reader'}
          </Text>
        </View>
        
        <Text style={styles.tapInstruction}>
          Tap the spinning button to switch between NFC Reader and HCE modes
        </Text>
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
    backgroundColor: 'rgba(128, 90, 213, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(128, 90, 213, 0.4)',
  },
  hcePulseCircle: {
    backgroundColor: 'rgba(252, 129, 129, 0.2)',
    borderColor: 'rgba(252, 129, 129, 0.4)',
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
  hceRippleCircle: {
    backgroundColor: 'rgba(252, 129, 129, 0.2)',
    borderColor: 'rgba(252, 129, 129, 0.4)',
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activeInnerCircle: {
    backgroundColor: '#FC8181',
    borderWidth: 3,
    borderColor: '#FED7D7',
    shadowColor: "#FC8181",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
  },
  vwoopText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  activeVwoopText: {
    color: 'white',
    fontSize: 42,
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
  modeBanner: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  hceBanner: {
    backgroundColor: '#FC8181',
  },
  nfcBanner: {
    backgroundColor: '#805AD5',
  },
  modeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modeIndicator: {
    marginTop: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  hceModeIndicator: {
    backgroundColor: 'rgba(252, 129, 129, 0.2)',
    borderWidth: 1,
    borderColor: '#FC8181',
  },
  nfcModeIndicator: {
    backgroundColor: 'rgba(128, 90, 213, 0.2)',
    borderWidth: 1,
    borderColor: '#805AD5',
  },
  modeIndicatorText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tapInstruction: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default VwoopPage; 