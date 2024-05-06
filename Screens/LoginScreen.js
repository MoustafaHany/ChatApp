import React, { useState } from "react";
import {StyleSheet, KeyboardAvoidingView,
  TextInput, View, Text, Pressable, Alert, Image} from "react-native";
import {signInWithEmailAndPassword, sendPasswordResetEmail,
  createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; 
import { useNavigation } from "@react-navigation/native";
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const LoginScreen = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);


  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User signed in successfully!");
        window.alert("User signed in successfully!");
        // Navigate to the Home page after successful login
        navigation.navigate("Home");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        Alert.alert(errorMessage);
        window.alert(errorMessage);
      });
  };

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User signed up successfully!");
        window.alert("User signed up successfully!");
        Alert.alert("User signed up successfully!");
        // Navigate to the Home page after successful login
        navigation.navigate("Home");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        Alert.alert(errorMessage);
        window.alert(errorMessage);
      });
  };

  const handleForgotPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
       
        console.log("Password Reset Email Sent", "Check your email inbox for instructions to reset your password.");
        window.alert("Password Reset Email Sent", "Check your email inbox for instructions to reset your password.");
        Alert.alert("Password Reset Email Sent", "Check your email inbox for instructions to reset your password.");
      })
      .catch((error) => {
        
        console.log("Password Reset Failed", error.message);
        window.alert(errorMessage);
        Alert.alert(errorMessage);
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/Black App.png')} // Change the image path accordingly
          style={styles.image}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <View style={styles.Icons}>
        <MaterialCommunityIcons name="gmail" size={20} color="black" />
        </View>
        <TextInput
          placeholder="Password"
          style={styles.input}
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={!showPassword}
        />
        <Pressable style={styles.Icon} onPress={() => setShowPassword(!showPassword)} >
        <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="black" />
        </Pressable>


      </View>
      <View style={styles.buttonContainer}>
        <Pressable onPress={handleSignIn} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Register')}style={styles.button}>
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>
      </View>
      <View>
      <Pressable onPress={handleForgotPassword} style={styles.Forgot}>
          <Text style={styles.TextForget}>Forgot Password ? </Text>
        </Pressable>
        </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:'#000000'
  },
  inputContainer: {
    width: "80%",
    height: "30%",
    justifyContent: "center",
    alignItems: "center",
    marginTop:10,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "rgba(255,255,255,0.8999)",
    paddingLeft:15,
    paddingRight:30,
    fontSize:20,
    borderColor:'rgba(255,255,255,0.2)',
    borderRadius:30,
    borderWidth:3,
  },
  image: {
    width: 290, // Adjust the width of the image as needed
    height:270 , // Adjust the height of the image as needed
    resizeMode: "contain", // Adjust the resizeMode as needed
  },
  buttonContainer: {
    marginTop:10,
    width: "100%",
    height: "10%",
    justifyContent:'space-evenly',
    flexWrap:'wrap',
    flexDirection:'row',
    marginBottom:5,
  },
  button: {
    backgroundColor: "rgba(255,255,255,0.3)",
    width: 120,
    height: 40,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:20,
    borderColor:'#fff',
    borderWidth:3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  imageContainer:{
    marginTop:40,
    marginBottom:10,
    backgroundColor:'#fff',
    width:150,
    height:150,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:'50%',
    borderWidth:2,
    borderColor:'#fff',

  },
  Forgot:{
    height:40,
    marginBottom:20,
    marginBottom:5,
    
  },
  TextForget:{
    fontSize:20,
    fontWeight:'bold',
    color:'#fff'
  },
  Icon:{
    position:'relative',
    left:"42%",
    top:-32,
    

  },
  Icons:{
    position:'relative',
    left:"42%",
    top:-35,

  }

});
