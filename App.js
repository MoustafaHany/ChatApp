import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './Screens/LoginScreen';
import RegisterScreen from './Screens/RegisterScreen';
import HomeScreen from './Screens/HomeScreen';
import ChatScreen from './Screens/ChatScreen';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

import { GoogleAuthProvider,GithubAuthProvider,FacebookAuthProvider
   ,signInWithPopup } from "firebase/auth";
import { auth } from "./firebase"; 

export default function App() {
  const Stack = createNativeStackNavigator();
  const provider = new GoogleAuthProvider();
  const provider1 = new GithubAuthProvider();
  const provider2 = new FacebookAuthProvider();

  const handleGoogleLogin = (navigation) => {
    signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
    navigation.navigate('Home');
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
  };

  const handleGithubLogin = (navigation) =>{

    signInWithPopup(auth, provider1)
      .then((result) => {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
    
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        navigation.navigate('Home');
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GithubAuthProvider.credentialFromError(error);
        // ...
      });
  }
  const handleFacebookLogin = (navigation) =>{

    signInWithPopup(auth, provider2)
  .then((result) => {
    // The signed-in user info.
    const user = result.user;

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;

    // IdP data available using getAdditionalUserInfo(result)
    // ...
    navigation.navigate('Home');
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = FacebookAuthProvider.credentialFromError(error);

    // ...
  });
  }
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={({ navigation }) => ({
            headerStyle: {
              backgroundColor: '#2c2c2c',
              
            },
            headerTitleStyle:{
              color:'#fff',
              fontWeight:'bold',
              fontSize:35,
            } ,
            headerShown: true,

            headerRight: () => (
              <View style={styles.Header1}>
                <Text style={{fontSize:15,color:'#fff'}}>with</Text>
                <Pressable onPress={() => handleGoogleLogin(navigation)}> 
                  <AntDesign name="google" size={26} color="#fff" />
                </Pressable>
                <Pressable onPress={() => handleGithubLogin(navigation)}> 
                <FontAwesome name="github" size={30} color="#fff" />
                </Pressable>
                <Pressable onPress={() => handleFacebookLogin(navigation)}> 
                <FontAwesome5 name="facebook" size={26} color="#fff" />
                </Pressable>
                
                
              </View>
            ),

          })}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{
            headerStyle: {
              backgroundColor: '#2c2c2c',
            },
            headerTitleStyle:{
              color:'#fff',
              fontWeight:'bold',
              fontSize:35,
            } ,
            headerShown: true,


          }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={({ navigation }) => ({
            headerStyle: {
              backgroundColor: '#2c2c2c', // Background color for Home screen header
            },
            headerRight: () => (
              <View style={styles.Header1}>
                <Feather name="camera" size={24} color="#fff" />
                <FontAwesome5 name="search" size={24} color="#fff" />
                <Entypo name="dots-three-vertical" size={24} color="#fff" />
                <Pressable onPress={() => navigation.navigate('Login')}> {/* Handle navigation onPress */}
                  <FontAwesome name="sign-out" size={24} color="#fff" />
                </Pressable>
              </View>
            ),
            headerTitleStyle:{
              color:'#fff',
              fontWeight:'bold',
              fontSize:30,
            } ,
            headerLeft:() => null, // Hide headerLeft
          })}
        />
        <Stack.Screen 
          name="Chat" 
          component={ChatScreen} 
          options={({ navigation,route }) => ({
            headerStyle: {
              backgroundColor: '#2c2c2c',
            },
            headerRight: () => (
              <View style={styles.Header2}>
                <Feather name="video" size={22} color="#fff" />
                <Feather name="phone" size={22} color="#fff" />
                <Entypo name="dots-three-vertical" size={22} color="#fff" />
              </View>
            ),
            headerTitleStyle:{
              color:'#fff',
              fontWeight:'bold',
              fontSize:20,
              width:180,
              
            } ,
            title:route.params.name,
          })}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  Header1:{
    width:130,
    marginHorizontal:10,
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent:'space-between',
    alignItems:'center'
  },
  Header2:{
    width:80,
    marginHorizontal:10,
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent:'space-between',
    alignItems:'center',
  }
});
