import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator, Image } from 'react-native'; // Added ActivityIndicator and Image imports
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { auth, db, storage } from "../firebase";
import { addDoc, collection, serverTimestamp, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Entypo } from '@expo/vector-icons';

const ChatScreen = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false); // Added state to manage loading state of image upload

  const { userId } = route.params;

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = auth.currentUser;
        setCurrentUser(user.uid);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const chatId = userId > currentUser ? `${userId + '-' + currentUser}` : `${currentUser + '-' + userId}`;
    const docref = doc(db, 'chatrooms', chatId);
    const colRef = collection(docref, 'messages');
    const q = query(colRef, orderBy('createdAt', "desc"));
    const unsubscribe = onSnapshot(q, (onSnap) => {
      const allMsg = onSnap.docs.map(mes => ({
        ...mes.data(),
        createdAt: mes.data().createdAt ? mes.data().createdAt.toDate() : new Date()
      }));
      setMessages(allMsg);
    });

    return () => {
      unsubscribe();
    };
  }, [currentUser, userId]);

  const onSend = useCallback((messagesArray) => {
    const msg = messagesArray[0];
    const Mymsg = {
      ...msg,
      sendBy: currentUser,
      sendTo: userId,
    };

    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, Mymsg),
    );

    if (msg.image) {
      handleSendImage(msg.image);
    } else {
      const chatId = userId > currentUser ? `${userId + '-' + currentUser}` : `${currentUser + '-' + userId}`;
      const docref = doc(db, 'chatrooms', chatId);
      const colRef = collection(docref, 'messages');
      addDoc(colRef, {
        ...Mymsg,
        createdAt: serverTimestamp(),
      });
    }
  }, [currentUser, userId]);

  const handleChoosePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const imageUrl = await uploadImage(result.uri);
      onSend([{ image: imageUrl }]);
    }
  };

  const uploadImage = async (uri) => {
    if (!uri) {
      console.error("URI is undefined or null");
      return null;
    }

    setUploadingImage(true); // Set loading state to true while uploading image

    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const ref = storage.ref().child(`images/${filename}`);
      await ref.put(blob);
      const downloadUrl = await ref.getDownloadURL();
      return downloadUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    } finally {
      setUploadingImage(false); // Set loading state back to false after upload
    }
  };

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        left: {
          backgroundColor: '#2c2c2c',
          maxWidth: 250,
        },
        right: {
          backgroundColor: 'rgba(255,255,255,0.8999)',
          maxWidth: 250,
        },
      }}
      textStyle={{
        left: {
          color: '#fff',
        },
        right: {
          color: 'black',
        },
      }}
      timeTextStyle={{
        left: {
          color: '#fff',
        },
        right: {
          color: 'black',
        },
      }}
    />
  );

  const renderInputToolbar = (props) => (
    <InputToolbar
      {...props}
      containerStyle={styles.inputToolbarContainer}
      textInputStyle={styles.inputToolbarTextInput}
      renderActions={renderCustomActions}
    />
  );

  const renderSend = (props) => (
    <TouchableOpacity onPress={() => props.onSend({ text: props.text.trim() }, true)} style={styles.sendButton}>
      {uploadingImage ? (
        <ActivityIndicator size="small" color="black" />
      ) : (
        <Ionicons name="send" size={30} color="black" />
      )}
    </TouchableOpacity>
  );

  const renderCustomActions = (props) => {
    return (
      <TouchableOpacity style={styles.customActionButton} onPress={handleChoosePhoto}>
       <Entypo name="attachment" size={24} color="black" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <GiftedChat
  messages={messages.map((message, index) => ({
    ...message,
    _id: index, // Ensure each message has a unique identifier
  }))}
  onSend={messagesArray => onSend(messagesArray)}
  user={{
    _id: currentUser,
    avatar: 'https://picsum.photos/200/300',
  }}
  renderBubble={renderBubble}
  renderInputToolbar={renderInputToolbar}
  renderSend={renderSend}
  renderActions={renderCustomActions}
  renderLoading={() => <ActivityIndicator size="large" color="#fff" />}
  renderMessageImage={props => <Image {...props} />}
  contentContainerStyle={styles.messageContainer}
/>

    </View>
  );
}

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  inputToolbarContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    height: 45,
    borderWidth: 3,
    borderRadius: 30,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: "rgba(255,255,255,0.8999)",
    paddingVertical: -5,
    paddingHorizontal: 10,
    marginBottom: 4,
    marginTop: 10,
  },
  inputToolbarTextInput: {
    fontSize: 16,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginBottom: 10,
  },
  messageContainer: {
    width: '100%',
    height: '70%',
  },
  customActionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginBottom: 10,
  },
});
