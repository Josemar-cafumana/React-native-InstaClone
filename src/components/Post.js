import { Avatar, Icon } from "@rneui/themed";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  useDisclose,
  Actionsheet,
  Box,
  FlatList,
  KeyboardAvoidingView,
} from "native-base";
import {  useEffect, useState } from "react";
import { Alert } from "react-native";
import Author from "./Author";
import { db, firebase } from "../../firebase";

export default function Post({
  id,
  username,
  profilePhoto,
  isVerified,
  localization,
  image,
  caption,
  owner_email,
  likes,
  likes_by_users,
  comments,
}) {
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    getUsername();
  }, []);

  const getUsername = async () => {
    const user = firebase.auth().currentUser;

    const unsubscribe = db
      .collection("users")
      .where("owner_uid", "==", user.uid)
      .limit(1)
      .onSnapshot((snapshot) =>
        snapshot.docs.map((doc) => {
          
          setCurrentUser({
            username: doc.data().username,
            profile_picture: doc.data().profile_picture,
          });
        })
      );

    return unsubscribe;
  };

  const handleLike = () => {
    const currentLikesStatus = !likes_by_users.includes(
      firebase.auth().currentUser.email
    );

    db.collection("users")
      .doc(owner_email)
      .collection("posts")
      .doc(id)
      .update({
        likes_by_users: currentLikesStatus
          ? firebase.firestore.FieldValue.arrayUnion(
              firebase.auth().currentUser.email
            )
          : firebase.firestore.FieldValue.arrayRemove(
              firebase.auth().currentUser.email
            ),
      });
  };

  const handleComment = (comment) => {
 
    const newComment = {
      id: Math.random(),
      name: currentUser.username,
      comment: comment,
      isVerified: false,
      image: currentUser.profile_picture,
    };
    db.collection("users")
      .doc(owner_email)
      .collection("posts")
      .doc(id)
      .update({
        comments: firebase.firestore.FieldValue.arrayUnion(newComment) 
      });
  };

 

  return (
    <View style={styles.container}>
      <Author
        username={username}
        localization={localization}
        isVerified={isVerified}
        profilePhoto={profilePhoto}
      />
      <Image source={{ uri: image }} style={styles.image} />
      <PostFooter
        likes={likes_by_users}
        username={username}
        caption={caption}
        comments={comments}
        profilePhoto={profilePhoto}
        handleLike={handleLike}
        handleComment={handleComment}
        currentUser={currentUser}
      />
    </View>
  );
}

const PostFooter = ({
  likes,
  username,
  profilePhoto,
  caption,
  comments,
  currentUser,
  handleLike,
  handleComment
}) => {
  const { isOpen, onOpen, onClose } = useDisclose();
  const [comment, setComment] = useState("");
  const [inputFocused, setInputFocused] = useState(false);

  const handleAddComment = () => {
    handleComment(comment)
    setComment('')
  };

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={styles.rowContainer}>
          <TouchableWithoutFeedback onPress={handleLike}>
           {likes.includes(firebase.auth().currentUser.email)
           ? (
            <Icon
              type="material"
              style={{ marginRight: 8, borderColor: "red" }}
              name="favorite"
              size={30}
              color="red"
            />
           )
           : (
            <Icon
              type="feather"
              style={{ marginRight: 8, borderColor: "red" }}
              name="heart"
              size={30}
              color="#fff"
            />
           )
           } 
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={onOpen}
            style={{ backgroundColor: "red " }}
          >
            <Icon
              type="feather"
              style={{ marginRight: 8 }}
              name="message-circle"
              size={30}
              color="#fff"
            />
          </TouchableWithoutFeedback>
          <Icon
            type="feather"
            style={{ marginRight: 8, transform: [{ rotate: "15deg" }] }}
            name="send"
            size={29}
            color="#fff"
          />
        </View>
        <View style={styles.rowContainer}>
          <Icon
            type="feather"
            style={{ marginRight: 8, borderColor: "red" }}
            name="bookmark"
            size={30}
            color="#fff"
          />
        </View>
      </View>

      <View
        style={{ flexDirection: "row", marginTop: 5, paddingHorizontal: 10 }}
      >
        <Text style={{ color: "#fff", fontWeight: 600 }}>
          {likes.length} curtidas
        </Text>
      </View>

      <View
        style={{ flexDirection: "row", marginTop: 4, paddingHorizontal: 10 }}
      >
        <Text style={{ color: "#fff" }}>
          <Text style={{ fontWeight: "600" }}>{username}</Text>
          <Text>
            {" "}
            {caption.length > 91 ? caption.slice(0, 91) + "..." : caption}
          </Text>
        </Text>
      </View>

      <TouchableOpacity
        onPress={onOpen}
        style={{ marginTop: 5, paddingHorizontal: 10 }}
      >
        <Text style={{ color: "gray" }}>
          {comments.length > 1
            ? "Ver todos os " + comments.length + " comentários"
            : "Ver todos os comentários"}
        </Text>
      </TouchableOpacity>

      <Actionsheet isOpen={isOpen} onClose={onClose} position={"relative"}>
        <Actionsheet.Content
          w={Dimensions.get("window").width}
          bg={"dark.50"}
          pb={5}
          style={{ zIndex: 1000 }}
          h={
            inputFocused
              ? Dimensions.get("window").height * 0.9
              : Dimensions.get("window").height * 0.7
          }
        >
          <Box
            h={10}
            w={"100%"}
            alignItems={"center"}
            justifyContent={"flex-end"}
            borderBottomWidth={1}
            borderColor={"dark.100"}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                paddingVertical: 8,
                fontSize: 18,
              }}
            >
              Comentários
            </Text>
          </Box>

          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <Comment {...item} />}
          />
        </Actionsheet.Content>
        <KeyboardAvoidingView
          keyboardVerticalOffset={5}
          behavior="position"
          contentContainerStyle={{
            backgroundColor: "#18181b",
            borderTopWidth: 1,
            borderColor: "#27272a",
            height: 70,
          }}
          style={{
            backgroundColor: "#18181b",
            borderTopWidth: 1,
            borderColor: "#27272a",
            position: "absolute",
            bottom: 18,
            zIndex: 1000,
            width: "100%",
            height: 70,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              columnGap: 12,
              alignItems: "center",
              width: "100%",
              padding: 5,
              paddingVertical: 20,
            }}
          >
            <Avatar size={40} rounded source={{ uri: currentUser.profile_picture }} />
            <TextInput
              style={{
                borderWidth: 1,
                color: "#fff",
                borderColor: "#27272a",
                borderRadius: 50,
                paddingVertical: 10,
                paddingHorizontal: 10,
                width: "85%",
              }}
              onChangeText={(comment) => setComment(comment)}
              value={comment}
              onSubmitEditing={handleAddComment}
              placeholder="Adiciona um comentário..."
              placeholderTextColor="#ddd"
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
            />
          </View>
        </KeyboardAvoidingView>
      </Actionsheet>
    </>
  );
};

const Comment = ({ image, name, isVerified, comment }) => {
  return (
    <Actionsheet.Item bg={"dark.50"}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 35 }}>
        <View
          style={{
            flexDirection: "row",
            columnGap: 5,
            alignItems: "center",
            width: "85%",
          }}
        >
          <Avatar size={36} rounded source={{ uri: image }} />
          <View>
            <View style={styles2.flex}>
              <Text style={styles2.author}>{name} </Text>
              {isVerified && <Icon name="verified" size={13} color="#0095F6" />}
            </View>

            <Text style={[styles2.desc]}>{comment}</Text>
          </View>
        </View>

        <Text style={{ justifyContent: "flex-end" }}>
          <Icon type="feather" name="heart" size={13} color="#fff" />
        </Text>
      </View>
    </Actionsheet.Item>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
  },
  image: {
    width: Dimensions.get("window").width,
    height: (Dimensions.get("window").width * 3) / 4,
    resizeMode: "cover",
    marginTop: 5,
  },
  rowContainer: {
    marginTop: 5,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});

const styles2 = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
    margin: "auto",
  },
  descContainer: {
    flexDirection: "row",
    gap: 8,
  },
  flex: {
    flexDirection: "row",
    alignItems: "center",
  },
  author: {
    color: "#fff",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    fontWeight: "bold",
    fontSize: 14,
  },
  desc: {
    color: "#fff",
    fontSize: 12,
  },
});
