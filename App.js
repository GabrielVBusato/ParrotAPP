import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StatusBar
} from 'react-native';

const socket = new WebSocket('ws://echo.websocket.org');

export default () => {
  const flatList = useRef(null)
  const [userMessage, setUserMessage] = useState('')
  const [messages, setMessages] = useState([])

  useEffect(() => {
    socket.onopen = () => socket.send(JSON.stringify({ type: 'server', payload: 'Parabéns, você se conectou ao chat!' }));
    socket.onmessage = ({ data }) => setMessages((oldMessages) => [...oldMessages, JSON.parse(data)])
  }, [])

  const renderItem = ({ item, index }) => {
    if (item.type === 'server') {
      return (
        <View style={{ alignItems: 'baseline' }}>
          <View style={styles.serverMessage}>
            <Text style={styles.serverText}>
              {item.payload}
            </Text>
          </View>
        </View>
      )
    } else {
      return (
        <View style={{ alignItems: 'baseline' }}>
          <View style={styles.userMessage}>
            <Text style={styles.userText}>
              {item.payload}
            </Text>
          </View>
        </View>
      )
    }
  }

  const sendMessage = () => {
    setMessages((oldMessages) => [...oldMessages, { type: 'user', payload: userMessage }])
    socket.send(JSON.stringify({ type: 'server', payload: userMessage }))
    setUserMessage('')
  }

  const onChangeText = (text) => {
    setUserMessage(text)
  }


  return (
    <View style={styles.main}>
      <StatusBar backgroundColor='#ffff' barStyle='dark-content' />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat do papagaio</Text>
      </View>
      <FlatList
        ref={flatList}
        style={styles.chat}
        renderItem={renderItem}
        onContentSizeChange={() => setInterval(() => flatList.current.scrollToEnd(), 1100)}
        data={messages}
        contentContainerStyle={{ paddingTop: 20, paddingHorizontal: 20 }}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListFooterComponent={() => <View style={{ height: 20 }} />}
      />
      <View style={styles.messageInput}>
        <TextInput value={userMessage} style={{ flex: 1 }} onChangeText={onChangeText} placeholder='Digite sua mensagem aqui...' />
        <TouchableOpacity onPress={sendMessage}>
          <Text style={styles.sendButton}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#ffff'
  },
  header: {
    backgroundColor: '#ffff',
    elevation: 5,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  chat: {
    backgroundColor: '#ffff',
  },
  serverMessage: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 4,
    padding: 10,
  },
  serverText: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  messageInput: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.2)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sendButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 10,
    borderRadius: 4,
    fontSize: 14,
    fontWeight: 'bold'
  },
  userMessage: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 4,
    padding: 10,
    alignSelf: 'flex-end'
  },
  userText: {
    fontSize: 14,
  },
})

