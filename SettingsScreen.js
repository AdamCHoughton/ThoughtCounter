import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MESSAGE_SETS = {
  set1: [
    "Message 1 from set 1",
    "Message 2 from set 1",
    "Message 3 from set 1",
    "Message 4 from set 1",
    "Message 5 from set 1",
    "Message 6 from set 1",
    "Message 7 from set 1",
  ],
  set2: [
    "Message 1 from set 2",
    "Message 2 from set 2",
    "Message 3 from set 2",
    "Message 4 from set 2",
    "Message 5 from set 2",
    "Message 6 from set 2",
    "Message 7 from set 2",
  ],
  set3: [
    "Message 1 from set 3",
    "Message 2 from set 3",
    "Message 3 from set 3",
    "Message 4 from set 3",
    "Message 5 from set 3",
    "Message 6 from set 3",
    "Message 7 from set 3",
  ],
};

const SettingsScreen = ({ messages, setMessages }) => {
  const [newMessage, setNewMessage] = useState('');

  const saveMessages = async (updatedMessages) => {
    setMessages(updatedMessages);
    await AsyncStorage.setItem('userMessages', JSON.stringify(updatedMessages));
  };

  const editMessage = (index, newText) => {
    const updatedMessages = [...messages];
    updatedMessages[index] = newText;
    saveMessages(updatedMessages);
  };

  const addNewMessage = () => {
    if (newMessage.trim() !== '') {
      const updatedMessages = [...messages, newMessage.trim()];
      saveMessages(updatedMessages);
      setNewMessage('');
    }
  };

  const clearAllMessages = () => {
    Alert.alert(
      "Clear All Messages",
      "Are you sure you want to clear all messages?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", style: "destructive", onPress: () => saveMessages([]) }
      ]
    );
  };

  const loadMessageSet = (setKey) => {
    Alert.alert(
      "Load Message Set",
      `Are you sure you want to load ${setKey}? This will replace your current messages.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Load", onPress: () => saveMessages(MESSAGE_SETS[setKey]) }
      ]
    );
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.messageItem}>
      <TextInput
        style={styles.messageInput}
        value={item}
        onChangeText={(text) => editMessage(index, text)}
        multiline
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Current Messages</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => loadMessageSet('set1')}>
                <Text style={styles.buttonText}>Load Set 1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => loadMessageSet('set2')}>
                <Text style={styles.buttonText}>Load Set 2</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => loadMessageSet('set3')}>
                <Text style={styles.buttonText}>Load Set 3</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearAllMessages}>
              <Text style={styles.buttonText}>Clear All Messages</Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={
          <View style={styles.addMessageContainer}>
            <TextInput
              style={styles.input}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Enter new message"
              multiline
            />
            <TouchableOpacity style={styles.addButton} onPress={addNewMessage}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  messageItem: {
    marginBottom: 10,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addMessageContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#4CD964',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
});

export default SettingsScreen;