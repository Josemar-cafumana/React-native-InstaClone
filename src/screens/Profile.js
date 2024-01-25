import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Avatar } from "@rneui/themed";
import { db, firebase } from "../../firebase";
import Header from "../components/Header";
import { Button } from "native-base";
import { Image } from "react-native";

import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import Loading from "../components/Loading";

const Profile = ({ navigation }) => {
  const [currentUser, setCurrentUser] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const scale = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState(null);



  useEffect( () => {
    setLoading(true);
    getUsername();

    const unsubscribe = db.collectionGroup("posts").onSnapshot((snapshot) => {
      setPosts(
        snapshot.docs
          .map((post) => ({
            id: post.id,
            ...post.data(),
          }))
      );

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getUsername = async () => {
    const user = firebase.auth().currentUser;

     db
      .collection("users")
      .where("owner_uid", "==", user.uid)
      .limit(1)
      .onSnapshot((snapshot) =>
        snapshot.docs.map((doc) => {
          setCurrentUser({
            username: doc.data().username,
            email: doc.data().email,
            profile_picture: doc.data().profile_picture,
          });
        })
      );

    setImage(currentUser.profile_picture);


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

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    await ImagePicker.requestMediaLibraryPermissionsAsync();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      resizeBox(0);
      savePhoto(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    // No permissions request is necessary for launching the image library
    await ImagePicker.requestCameraPermissionsAsync();
    let result = await ImagePicker.launchCameraAsync({
      cameraType: ImagePicker.CameraType.front,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      savePhoto();
      resizeBox(0);
    }
  };

  const uploadImage = async (image) => {
    try {
      const response = await fetch(image.uri);
      const blob = await response.blob();

      const filename = image.uri.substring(image.uri.lastIndexOf("/") + 1);

      const storageRef = firebase.storage().ref().child(filename);

      const uploadTaskSnapshot = await storageRef.put(blob);

      const downloadURL = await uploadTaskSnapshot.ref.getDownloadURL();

      return downloadURL;
    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
    }
  };

  const savePhoto = async (image) => {
   

    setLoading(true);
    let urlImage;
    try {
      let source = { uri: image };
      urlImage = await uploadImage(source);
    } catch (error) {
      Alert.alert("Erro durante o envio da imagem: " + error);
      return;
    }

    db.collection("users").doc(currentUser.email).update({
      profile_picture: urlImage,
    });

    setLoading(false);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000",
      }}
    >
      <Header mode="profile" navigation={navigation} />
   
      <View
        style={{
          flexDirection: "row",
          gap: 2,
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: 20,
          borderBottomWidth: 0.2,
          borderBottomColor: "#262626",
        }}
      >
        <View style={styles.container}>
          <Avatar size={100} rounded source={{ uri: image ? image : currentUser.profile_picture }} />

          <Text style={styles.username} numberOfLines={1}>
            {currentUser.username} 
          </Text>
        </View>
        <View style={{ paddingBottom: 15 }}>
          <Button bg={"#262626"} bgColor={"#262626"} my={2} onPress={() => resizeBox(1)}>
            Editar foto de perfil
          </Button>
          <Button bg={"#262626"} bgColor={"#262626"}>Editar informações de perfil</Button>
        </View>
      </View>
      <View
        style={[
          { flexDirection: "row", rowGap: 2, textAlign: "center" },
          posts.filter((post) => post.owner_email === currentUser.email).length == 0 && { position: "absolute", top: 370, right: 90 },
        ]}
      >
        {posts
        .filter((post) => post.owner_email === currentUser.email)
        .length > 0 ? (
          posts
          .filter((post) => post.owner_email === currentUser.email)
          .map((post) => (
            <Image
              source={{ uri: post.image }}
              style={styles.image}
              key={post.id}
            />
          ))
        ) : (
          <View>
            <Feather
              style={{
                borderRadius: 50,
                borderWidth: 3,
                borderColor: "white",
                paddingTop: 14,
                width: 100,
                height: 100,
                textAlign: "center",
                marginLeft: 60,
              }}
              name="camera"
              color="white"
              size={60}
            />

            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 22,
                marginTop: 8,
              }}
            >
              Ainda sem publicações
            </Text>
          </View>
        )}
      </View>

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

      {loading && <Loading />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    alignSelf: "flex-start",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: Dimensions.get("window").width * 0.33,
    height: (Dimensions.get("window").width * 1) / 3,
    resizeMode: "cover",
    marginTop: 5,
  },
  username: {
    marginTop: 5,
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  popup: {
    borderRadius: 8,
    backgroundColor: "#ddd",
    width: 150,
    position: "absolute",
    right: 30,
    top: 160,
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
});

export default Profile;
