import { View, Text, StyleSheet, Dimensions } from "react-native";
import React, { useEffect } from "react";
import Header from "../components/Header";
import Stories from "../components/Stories";
import { USERS } from "../data/Users";
import Post from "../components/Post";
import { POSTS } from "../data/Posts";
import { FlatList } from "react-native";
import { ScrollView } from "native-base";
import { StatusBar } from "react-native";
import { FIREBASE_AUTH, FIREBASE_STORE } from "../../firebase";
import { collection, collectionGroup, getDocs } from "firebase/firestore";

const Feed = () => {
  const auth = FIREBASE_AUTH;
  const db = FIREBASE_STORE;

  useEffect(() => {
    fetchData()
  },[])

  const fetchData = async () => {
    const querySnapshot = await getDocs(collectionGroup(db, "posts"));

    querySnapshot.forEach((doc) => {  
      console.log(JSON.stringify(doc.data()))
      
    });
  }

  return (
    <View style={styles.container}>
      <ScrollView width={Dimensions.get("window").width}
      showsVerticalScrollIndicator={false}
      >
        <StatusBar barStyle="light-content" />
        <Header />

        <FlatList
          horizontal
          data={USERS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Stories {...item} />}
          style={{ marginBottom: 5 }}
        />

        <FlatList
          data={POSTS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Post {...item} />}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
});
export default Feed;
