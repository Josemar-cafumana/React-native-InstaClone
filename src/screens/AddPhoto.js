import React, { useState, useRef, useEffect } from "react";
import {
  Image,
  View,
  Platform,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  KeyboardAvoidingView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { Box, TextArea, Button } from "native-base";
import { StatusBar } from "react-native";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { FIREBASE_AUTH, FIREBASE_STORAGE, FIREBASE_STORE } from "../../firebase";
import { getDoc } from "firebase/firestore";

export default function AddPhoto({ navigation }) {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [caption, setCaption] = useState("");
  const [visible, setVisible] = useState(false);
  const scale = useRef(new Animated.Value(0)).current;
  const textAreaRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    getUsername()
  }, [])
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (textAreaRef.current) {
      textAreaRef.current.blur();
      setIsFocused(false);
    }
  };

  function resizeBox(to) {
    to === 1 && setVisible(true);
    Animated.timing(scale, {
      toValue: to,
      useNativeDriver: true,
      duration: 200,
      easing: Easing.linear,
    }).start(() => to === 0 && setVisible(false));
  }

  const getUsername = async () => {
    const user = FIREBASE_AUTH.currentUser
    const q = query(collection(FIREBASE_STORE, "users"), where("ownwer_uid", "==", user.uid));
    const querySnapshot = await getDoc(q);
    querySnapshot.forEach((doc) => {
      setCurrentUser(doc.data())
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });

  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    await ImagePicker.requestMediaLibraryPermissionsAsync();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      await uploadImage(result.assets[0].uri)
      resizeBox(0);
    }
  };

  const uploadImage = async (uri) => {
    const response = await fetch(uri)
    const blob = response.blob();

    const storageRef = ref(FIREBASE_STORAGE, 'posts/' + new Date().getTime())
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on("state_changed", (snapshot) => {
      
    },
    (error) => {

    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then(async (download) => {
        console.log("Imagem ",download)
        setImageUrl(download)
      })
    })
  }

  const takePhoto = async () => {
    // No permissions request is necessary for launching the image library
    await ImagePicker.requestCameraPermissionsAsync();
    let result = await ImagePicker.launchCameraAsync({
      cameraType: ImagePicker.CameraType.front,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });


    if (!result.canceled) {
      setImage(result.assets[0].uri);
      await uploadImage(result.assets[0].uri)
      resizeBox(0);
    }
  };

  const savePost = async () => {
    const data = {
      caption,
      image,
      imageUrl
    };

    
    console.warn(data);
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
      }}
    >
      <SafeAreaView
        style={{ flex: 1, alignItems: "center", backgroundColor: "#000" }}
      >
        <StatusBar barStyle="light-content" />
        <KeyboardAvoidingView
          keyboardVerticalOffset={-150}
          behavior="position"
          contentContainerStyle={{
            flex: 1,
            alignItems: "center",
            backgroundColor: "#000",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("home")}
            style={{ left: 0, top: 23, position: "absolute" }}
          >
            <Text>
              <MaterialIcons name="arrow-back-ios" color="white" size={25} />
            </Text>
          </TouchableOpacity>
          <Text style={styles.title}>Nova publicação</Text>
          {image ? (
            <Image
              onTouchStart={() => resizeBox(1)}
              source={{ uri: image }}
              style={styles.image}
            />
          ) : (
            <View style={styles.image} onTouchStart={() => resizeBox(1)}>
              <MaterialIcons name="photo-camera" size={50} />
            </View>
          )}

          <Box alignItems="center" w="100%" my={3}>
            {isFocused && (
              <View style={{ right: 0 }} onTouchStart={handleBlur}>
                <MaterialIcons name="close" color="white" size={20} />
              </View>
            )}
            <TextArea
              ref={textAreaRef}
              h={20}
              placeholder="Escreve uma legenda..."
              w="100%"
              focusOutlineColor="black"
              backgroundColor="black"
              borderColor="dark.100"
              borderWidth={0}
              borderBottomWidth={1}
              onFocus={handleFocus}
              color="white"
              value={caption}
              onChangeText={(c) => setCaption(c)}
              style={{ borderWidth: 0 }}
            />
          </Box>

          <Box
            alignItems="center"
            w={(Dimensions.get("window").width * 0.95) / 1}
          >
            <Button
              size={"lg"}
              backgroundColor="info.600"
              w="full"
              onPress={savePost}
            >
              Partilhar
            </Button>
          </Box>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <Modal transparent visible={visible}>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => resizeBox(0)}>
          <Animated.View
            style={[
              styles.popup,
              {
                opacity: scale.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
              {
                transform: [{ scale }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.optionContainer}
              onPress={() => takePhoto()}
            >
              <Text style={styles.optionText}>Câmera</Text>
              <MaterialIcons name="photo-camera" size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionContainer}
              onPress={pickImage}
            >
              <Text style={styles.optionText}>Galeria</Text>
              <MaterialIcons name="grid-view" size={20} />
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  popup: {
    borderRadius: 8,
    backgroundColor: "#ddd",
    width: 150,
    position: "absolute",
    right: 30,
    top: 335,
  },
  optionContainer: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 10,

    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  optionText: {
    marginRight: 5,
    fontWeight: "bold",
    fontSize: 14,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginVertical: Platform.OS == "ios" ? 25 : 20,
  },
  image: {
    marginVertical: 15,
    backgroundColor: "#ddd",
    width: 230,
    height: 250,
    alignItems: "center",
    justifyContent: "center",
  },
});
