/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

LogBox.ignoreLogs([
  'Encountered',
  'State updates',
  'VirtualizedLists',
  'Setting a timer',
  'Your data will be downloaded and filtered on the client',
  'virtualizedCell cellKey',
  'Please report: Excessive number of pending callbacks: 501',
  'Setting a timer for a long period of time',
  'Animated.event now requires a second argument for options',
  'Animated: `useNativeDriver` was not specified.',
]);

AppRegistry.registerComponent(appName, () => App);
