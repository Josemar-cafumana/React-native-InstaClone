import { Text, View } from "react-native";
import { Avatar } from "@rneui/themed";
import { StyleSheet } from "react-native";
import { Icon } from "@rneui/themed";
export default function Author({ username, localization = null , profilePhoto, isVerified = false }) {
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={styles.descContainer}>
          <Avatar
            size={36}
            rounded
            source={{ uri: profilePhoto }}
          />
          <View>
            <View style={styles.flex}>
              <Text style={styles.author}>{username} </Text>
              {isVerified && <Icon name="verified" size={13} color="#0095F6" />}
              
            </View>

            <Text style={styles.desc}>{localization}</Text>
          </View>
        </View>

        <Text>
          <Icon name="more-horiz" size={20} color="#fff" />
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingHorizontal: 10,
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
