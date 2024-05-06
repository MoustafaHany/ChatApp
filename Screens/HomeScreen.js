import React, { useState, useEffect } from "react";
import { Button, FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { doc, getDocs, onSnapshot, deleteDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from '@expo/vector-icons';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get data from AsyncStorage if available
        const storedData = await AsyncStorage.getItem('userData');
        if (storedData) {
          setUserData(JSON.parse(storedData));
        }

        const userRef = collection(db, "Users");
        const querySnapshot = await getDocs(userRef);
        const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Update state and AsyncStorage with fetched data
        setUserData(usersData);
        await AsyncStorage.setItem('userData', JSON.stringify(usersData));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    // Add authentication state change listener
    const unsubscribeAuth = auth.onAuthStateChanged(() => {
      // When authentication state changes, refetch user data
      fetchUserData();
    });

    // Add Firestore snapshot listener for real-time updates
    const unsubscribeSnapshot = onSnapshot(collection(db, "Users"), (snapshot) => {
      const updatedUserData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserData(updatedUserData);
      AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
    });

    // Clean up listeners
    return () => {
      unsubscribeAuth();
      unsubscribeSnapshot();
    };
  }, []);

  const handleDelete = async (userId) => {
    try {
      await deleteDoc(doc(db, "Users", userId));
      
      // Update state and AsyncStorage after deletion
      const updatedUserData = userData.filter(user => user.id !== userId);
      setUserData(updatedUserData);
      AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const filteredUserData = userData.filter(user => {
    const fullName = `${user.First_Name} ${user.Last_Name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Pressable
        onPress={() => navigation.navigate('Chat', { userId: item.id, name:item.First_Name })}
        style={styles.together}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: "https://picsum.photos/200/300" }} style={styles.image} />
        </View>
        <View style={styles.textItemContainer}>
          <Text style={[styles.title, styles.text1]}>{item.First_Name}</Text>
          <Text style={[styles.title, styles.text2]}>{item.Email}</Text>
        </View>
      </Pressable>
      <Pressable onPress={() => handleDelete(item.id)} style={styles.deleteIcon}>
        <AntDesign name="deleteuser" size={24} color="#fff" />
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Users..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        style={styles.containerItem}
        data={filteredUserData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#141414",
  },
  item: {
    marginVertical: 8,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Align the delete button to the right
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.4)',
    borderWidth: 3,
    borderRadius: 30,
  },
  title: {
    color: '#fff'
  },
  containerItem: {
    width: "100%",
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 40,
    borderColor: "#fff",
    borderWidth: 3,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
  },
  textItemContainer: {
    width: "77%",
    color: '#fff',
    marginHorizontal: 20,
  },
  text1: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  text2: {
    fontSize: 6,
  },
  deleteIcon:{
    marginRight: 15,
  },
  together:{
    marginLeft: 5,
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    margin: 10,
    borderRadius: 10,
    width: '90%',
  }
});
