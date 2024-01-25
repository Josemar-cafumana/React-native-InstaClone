import { View, Text, StyleSheet, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Stories from "../components/Stories";
import { USERS } from "../data/Users";
import Post from "../components/Post";
import { POSTS } from "../data/Posts";
import { FlatList } from "react-native";
import { ScrollView } from "native-base";
import { StatusBar } from "react-native";
import { db, firebase } from "../../firebase";
import Loading from "../components/Loading";

const Feed = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
  
    const unsubscribe = db.collectionGroup("posts")
      .onSnapshot((snapshot) => {

        setPosts(
          snapshot.docs.map((post) => ({
            id: post.id,
            ...post.data(),
          }))
        );
  

        setLoading(false);
      });
  

    return () => unsubscribe();
  }, []);
  

 return (
  <View style={styles.container}>
    <StatusBar barStyle="light-content" />
    <Header  navigation={navigation}/>
    {loading && <Loading />}
    
    <FlatList
      ListHeaderComponent={() => (
        <FlatList
          horizontal
          data={USERS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Stories {...item} />}
          style={{ marginBottom: 5 }}
        />
      )}
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Post {...item} />}
    />
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
