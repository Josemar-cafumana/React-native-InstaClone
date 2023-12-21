import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  StatusBar,
  Pressable,
  Alert,
} from "react-native";
import React, { useState } from "react";

import { MaterialIcons } from "@expo/vector-icons";

import {
  Button,
  FormControl,
  Icon,
  Input,
  WarningOutlineIcon,
} from "native-base";
import { TouchableOpacity } from "react-native-gesture-handler";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH, FIREBASE_STORE } from "../../firebase";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

const schema = yup.object({
  username: yup.string("").required("Informe o nome de usuário"),
  email: yup
    .string("")
    .email("Informe um endereço de email válido")
    .required("Informe um endereço de email"),
  password: yup
    .string("")
    .min(4, "Informe 4 caracteres no mínimo")
    .required("Informe a senha"),
});
const Register = ({ navigation }) => {
  const [show, setShow] = useState(false);
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const auth = FIREBASE_AUTH;
  const db = FIREBASE_STORE;

  const onSubmit = async ({ email, password, username}) => {
    try {
      const authUser = await createUserWithEmailAndPassword(auth,email, password)
      
       await setDoc(doc(db, "userPosts",  authUser.user.email ), {
        owner_uid: authUser.user.uid,
        username: username,
        email: authUser.user.email,
        profile_picture: 'https://randomuser.me/api/portraits/men/36.jpg'
      });
    
    } catch (e) {
      Alert.alert(e.message)
      console.log(e.message)
    }
    navigation.push('Login')
    //console.log(email, password)
};


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.logoContainer}>
        <Image source={require("../../assets/img/instagram.png")} />
      </View>

      <View style={styles.formContainer}>
        <FormControl isInvalid={!!errors.username} w="100%" mb={5}>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                size="xl"
                py={4}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                fontSize={14}
                keyboardType="email-address"
                textContentType="emailAddress"
                placeholder="Username"
              />
            )}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {errors.username?.message}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.email} w="100%" mb={5}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                size="xl"
                py={4}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                fontSize={14}
                keyboardType="email-address"
                textContentType="emailAddress"
                placeholder="Phone number, username or email"
              />
            )}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {errors.email?.message}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.password} w="100%" mb={5}>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                size="xl"
                py={4}
                fontSize={14}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Password"
                type={show ? "text" : "password"}
                InputRightElement={
                  <Pressable onPress={() => setShow(!show)}>
                    <Icon
                      as={
                        <MaterialIcons
                          name={show ? "visibility" : "visibility-off"}
                        />
                      }
                      size={5}
                      mr="2"
                      color="muted.400"
                    />
                  </Pressable>
                }
              />
            )}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {errors.password?.message}
          </FormControl.ErrorMessage>
        </FormControl>

        <View style={{ alignItems: "flex-end", marginBottom: 30 }}>
          <Text style={{ color: "#6bb0f5" }}>Forgot password?</Text>
        </View>

        <Button
          onPress={handleSubmit(onSubmit)}
          size={"lg"}
          fontWeight="semibold"
          backgroundColor={
            !!errors.email == false &&
            !!errors.password == false &&
            !!errors.username == false
              ? "#0096f6"
              : "#9acaf7"
          }
          mb={5}
          w="full"
        >
          Register
        </Button>

        <View style={styles.signupContainer}>
          <Text>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.push("Login")}>
            <Text style={{ color: "#6bb0f5" }}> Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {},
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 50,
  },
  formContainer: {
    paddingHorizontal: 10,
  },
  signupContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    marginTop: 50,
  },
});
export default Register;
