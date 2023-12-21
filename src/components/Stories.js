import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Avatar, Chip } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";

const Stories = ({ id, user, image }) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7}>
      <Avatar
        containerStyle={{ borderWidth: 2, borderColor: "red" }}
        size={75}
        rounded
        source={{ uri: image }}
      />

      <Text style={styles.username} numberOfLines={1}>
        {user}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    alignItems: "center",
  },

  username: {
    marginTop: 5,
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
});
export default Stories;
