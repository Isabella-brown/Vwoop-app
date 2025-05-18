import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('window');

export type Screen = 'home' | 'account' | 'vwoop';

interface MenuBarProps {
  currentScreen: Screen;
  onScreenChange: (screen: Screen) => void;
}

const MenuBar: React.FC<MenuBarProps> = ({currentScreen, onScreenChange}) => {
  return (
    <View style={styles.menuBar}>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => onScreenChange('home')}>
        <Text
          style={[
            styles.menuText,
            currentScreen === 'home' && styles.menuTextActive,
          ]}>
          Events
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoContainer}
        onPress={() => onScreenChange('vwoop')}>
        <Image
          source={require('../assets/images/Vwoop Logo.png')}
          style={[
            styles.logo,
            currentScreen === 'vwoop' && styles.logoActive,
          ]}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => onScreenChange('account')}>
        <Text
          style={[
            styles.menuText,
            currentScreen === 'account' && styles.menuTextActive,
          ]}>
          Account
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  menuBar: {
    height: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  menuItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '600',
  },
  menuTextActive: {
    color: 'white',
  },
  logoContainer: {
    padding: 8,
    borderRadius: 20,
  },
  logo: {
    width: width * 0.3,
    height: 40,
  },
  logoActive: {
    opacity: 0.8,
    transform: [{scale: 0.95}],
  },
});

export default MenuBar; 