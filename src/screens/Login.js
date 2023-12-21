import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  StatusBar,
  Pressable,
  Alert
} from "react-native";
import React, { useState } from "react";

import { MaterialIcons, Feather } from "@expo/vector-icons";

import {
  Box,
  Button,
  FormControl,
  Icon,
  Input,
  Stack,
  WarningOutlineIcon,
} from "native-base";
import firebase, { FIREBASE_AUTH } from '../../firebase'

import { TouchableOpacity } from "react-native-gesture-handler";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signInWithEmailAndPassword } from "firebase/auth";

const schema = yup.object({
  email: yup.string('').email('Informe um endereço de email válido').required('Informe um endereço de email'),
  password: yup.string('').min(4, 'Informe 4 caracteres no mínimo').required('Informe a senha'),
});

const Login = ({ navigation }) => {
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

  const onSubmit = async ({ email, password}) => {
    try {
      const response = await signInWithEmailAndPassword(auth,email, password)
    } catch (e) {
      Alert.alert(e.message)
    }
    navigation.push('Home')
    //console.log(email, password)
};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/img/instagram.png')}/>
      </View>

      <View style={styles.formContainer}>
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

        <View style={{ alignItems: 'flex-end', marginBottom: 30}}>
          <Text style={{ color: '#6bb0f5'}}>Forgot password?</Text>
          </View>

        <Button onPress={handleSubmit(onSubmit)} size={"lg"} fontWeight='semibold' backgroundColor={(!!errors.email == false && !!errors.password == false) ? "#0096f6" : "#9acaf7"} mb={5} w="full">
          Login
        </Button>

        <View style={styles.signupContainer}> 
              <Text>Don't have an account?</Text>
              <TouchableOpacity  onPress={() => navigation.push('Register') }>
                <Text style={{ color: '#6bb0f5'}}> Sign Up</Text>
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
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    marginTop: 50
  }
});
export default Login;
