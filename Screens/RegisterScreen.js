import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import { doc, setDoc } from "firebase/firestore";
import { Feather } from '@expo/vector-icons';

const RegisterScreen = () => {
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [Phone, setPhone] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConFirmPassword, setConFirmPassword] = useState("");
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, Email, Password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User signed up successfully!");
        window.alert("User signed up successfully!");
        // Navigate to the Home page after successful login
        navigation.navigate("Home");
        AddUserToFireStore();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        Alert.alert(errorMessage);
        window.alert(errorMessage);
      });
  };

  const HandleConfirmPassword=()=>{
    if(Password==ConFirmPassword)
    handleSignUp();
    else window.alert("Confirm Password not The Same To Your Password");
  }

  const AddUserToFireStore = async () => {
    await setDoc(doc(db, "Users", auth.currentUser.uid), {
      First_Name: FirstName,
      Last_Name: LastName,
      Phone: Phone,
      Email: Email,
    });
  };

  return (
    <View style={styles.Conatiner}>
      <View style={styles.InputContainer}>
        <TextInput
          placeholder="First Name"
          style={styles.Input}
          value={FirstName}
          onChangeText={setFirstName}
        />
        <TextInput
          placeholder="Last Name"
          style={styles.Input}
          value={LastName}
          onChangeText={setLastName}
        />
        <TextInput
          placeholder="Phone"
          style={styles.Input}
          value={Phone}
          onChangeText={setPhone}
        />
        <TextInput
          placeholder="Email"
          style={styles.Input}
          value={Email}
          onChangeText={setEmail}
        />
       
        <TextInput
          placeholder="Password"
          style={styles.Input}
          value={Password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
       <Pressable style={styles.ButtonPassword} onPress={() => setShowPassword(!showPassword)} >
        <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="black" />
        </Pressable>
       
        <TextInput
          placeholder="Confirm Password"
          style={styles.Input}
          value={ConFirmPassword}
          onChangeText={setConFirmPassword}
          secureTextEntry={!showPassword1}

        />
        
        <Pressable style={styles.ButtonPassword} onPress={() => setShowPassword1(!showPassword1)} >
        <Feather name={showPassword1 ? "eye" : "eye-off"} size={20} color="black" />
        </Pressable>
        
      </View>
      <View style={styles.ButtonContainer}>
        <Pressable style={styles.Button} onPress={HandleConfirmPassword}>
          <Text style={styles.ButtonText}>Register</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  Conatiner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#141414",
  },
  InputContainer: {
    width: "80%",
    height: "80%",
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    borderColor: "rgba(255,255,255,0.3)",
    borderWidth: 4,
  },
  Input: {
    width: "90%",
    height: "20%",
    marginVertical: 10,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#eeeee4",
    fontSize: 20,
    paddingLeft: 15,
  },
  ButtonContainer: {
    width: "80%",
    height: "10%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  Button: {
    width: 160,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 20,
    borderColor: "#eeeee4",
    borderWidth: 3,

  },
  ButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize:20,
  },
  ButtonPassword:{
    position:'relative',
    bottom:40,
    left:'39%',
  }
});
