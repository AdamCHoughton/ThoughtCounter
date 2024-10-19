import React, { useState, useCallback, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './HomeScreen';
import SettingsScreen from './SettingsScreen';
import VisualizationScreen from './VisualizationScreen';

const Stack = createStackNavigator();

const INITIAL_MESSAGES = [
  "This is message 1",
  "This is message 2",
  "This is message 3",
  "This is message 4",
  "This is message 5",
  "This is message 6"
];

const STORAGE_KEY = '@thought_tracker_data';

export default function App() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [timestamps, setTimestamps] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData();
  }, [timestamps, messages]);

  const loadData = async () => {
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const { storedMessages, storedTimestamps } = JSON.parse(storedData);
        setMessages(storedMessages);
        setTimestamps(storedTimestamps);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async () => {
    try {
      const dataToStore = JSON.stringify({ storedMessages: messages, storedTimestamps: timestamps });
      await AsyncStorage.setItem(STORAGE_KEY, dataToStore);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const loadTestData = useCallback(() => {
    const testData = [];
    const currentDate = new Date();
    
    // Generate 1000 random entries over the past 12 months
    for (let i = 0; i < 1000; i++) {
      const randomDaysAgo = Math.floor(Math.random() * 365);
      const randomHours = Math.floor(Math.random() * 24);
      const randomMinutes = Math.floor(Math.random() * 60);
      
      const entryDate = new Date(currentDate);
      entryDate.setDate(entryDate.getDate() - randomDaysAgo);
      entryDate.setHours(randomHours, randomMinutes, 0, 0);
      
      testData.push({
        id: Date.now().toString() + i,
        time: entryDate.toISOString(),
        message: INITIAL_MESSAGES[Math.floor(Math.random() * INITIAL_MESSAGES.length)]
      });
    }
    
    setTimestamps(prevTimestamps => [...prevTimestamps, ...testData]);
  }, []);

  const visualizationScreenComponent = useCallback(
    (props) => (
      <VisualizationScreen
        {...props}
        timestamps={timestamps}
        loadTestData={loadTestData}
      />
    ),
    [timestamps, loadTestData]
  );

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home">
          {props => (
            <HomeScreen
              {...props}
              messages={messages}
              timestamps={timestamps}
              setTimestamps={setTimestamps}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="Settings"
          options={{ title: 'Manage Messages' }}
        >
          {props => (
            <SettingsScreen
              {...props}
              messages={messages}
              setMessages={setMessages}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="Visualization"
          options={{ title: 'Visualize Data' }}
          component={visualizationScreenComponent}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}