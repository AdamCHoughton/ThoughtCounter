import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';

const HomeScreen = ({ navigation, messages, timestamps, setTimestamps }) => {
  const [currentMessage, setCurrentMessage] = useState('');

  const handleTrackMe = () => {
    const newTimestamp = new Date().toISOString();
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    const newEntry = { id: Date.now().toString(), time: newTimestamp, message: randomMessage };
    setTimestamps(prevTimestamps => [...prevTimestamps, newEntry]);
    setCurrentMessage(randomMessage);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.timestampText}>{new Date(item.time).toLocaleString()}</Text>
      <Text style={styles.messageText}>{item.message}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.button} onPress={handleTrackMe}>
          <Text style={styles.buttonText}>Track Me</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.settingsButtonText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.visualizeButton} onPress={() => navigation.navigate('Visualization')}>
          <Text style={styles.visualizeButtonText}>Visualize</Text>
        </TouchableOpacity>
      </View>
      {currentMessage ? (
        <View style={styles.messageContainer}>
          <Text style={styles.currentMessage}>{currentMessage}</Text>
        </View>
      ) : null}
      <View style={styles.content}>
        <Text style={styles.title}>Tracked Timestamps and Messages:</Text>
        <FlatList
          data={timestamps}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text>No tracked events yet.</Text>}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  settingsButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  visualizeButton: {
    backgroundColor: '#34C759',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  visualizeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  messageContainer: {
    padding: 15,
    backgroundColor: '#e6f7ff',
    borderBottomWidth: 1,
    borderBottomColor: '#b3e0ff',
  },
  currentMessage: {
    fontSize: 16,
    color: '#0066cc',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    marginBottom: 10,
  },
  timestampText: {
    fontSize: 14,
    color: '#666',
  },
  messageText: {
    fontSize: 16,
    marginTop: 5,
  },
});

export default HomeScreen;