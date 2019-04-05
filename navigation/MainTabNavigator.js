import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import WordSelectionToRecordScreen from '../screens/WordSelectionToRecordScreen';
import WordSelectionToSuggestScreen from '../screens/WordSelectionToSuggestScreen';

import SettingsScreen from '../screens/SettingsScreen';
import RecordScreen from '../screens/RecordScreen';
import SuggestionScreen from '../screens/SuggestionScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

const WorkStack = createStackNavigator(
  {
    WordSelection: WordSelectionToRecordScreen,
    Record: RecordScreen
  },
  {
    initialRouteName: 'WordSelection',
  }
); 

WorkStack.navigationOptions = {
  tabBarLabel: 'Work',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-home' : 'md-home'}
    />
  ),
};

const SuggestionStack = createStackNavigator(
  {
    WordSelection : WordSelectionToSuggestScreen,
    Suggestion: SuggestionScreen
  }
); 

SuggestionStack.navigationOptions = {
  tabBarLabel: 'Suggestion',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

// WordSelectionStack.navigationOptions = {
//   tabBarLabel: 'WordSelection',
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon
//       focused={focused}
//       name={Platform.OS === 'ios' ? 'ios-home' : 'md-home'}
//     />
//   ),
// };

// const RecordStack = createStackNavigator({
//   Record: RecordScreen,
// });

// RecordStack.navigationOptions = {
//   tabBarLabel: 'Recording',
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon
//       focused={focused}
//       name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
//     />
//   ),
// };

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  WorkStack,
  SuggestionStack,
  SettingsStack,
});
