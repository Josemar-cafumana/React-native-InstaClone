import {
  View,
  StyleSheet,
  Text,
  Platform,
  SafeAreaView,
  Alert,
} from "react-native";
import { Badge, Icon } from "@rneui/themed";
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { firebase } from "../../firebase";

export default function Header({ navigation, mode = 'default' }) {
  const logout = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.rowContainer}>
        <Text style={styles.title}>Instagram</Text>
        <Icon
          style={{ marginLeft: 8, paddingTop: 3 }}
          name="expand-more"
          size={20}
          color="#fff"
        />
      </View>

      <View style={styles.rowContainer}>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('add')}>
        <Icon
          type="feather"
          style={{ marginRight: 8 }}
          name="plus-square"
          size={25}
          color="#fff"
        />
        </TouchableWithoutFeedback>
        
        {mode === 'default' && (
          <>
          <Icon
          type="feather"
          style={{ marginRight: 8, borderColor: "red" }}
          name="heart"
          size={25}
          color="#fff"
        />
        <View>
          <Icon
            type="feather"
            style={{ marginRight: 0 }}
            name="message-circle"
            size={25}
            color="#fff"
          />
          <Badge
            status="error"
            value={10}
            containerStyle={{
              position: "absolute",
              top: -7,
              left: 10,
              borderWidth: 0,
            }}
            badgeStyle={{ borderColor: "red" }}
          />
        </View>
        </>
        )}

{mode === 'profile' && (
    <TouchableOpacity onPress={logout}>
   <Icon
   type="material"
   style={{ marginRight: 8, borderColor: "red" }}
   name="logout"
   size={25}
   color="#fff"
 />
 </TouchableOpacity>
)}

        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#000",
  },
  rowContainer: {
    backgroundColor: "#000",
    paddingTop: 5,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontFamily: "Billabong",
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  user: {
    fontSize: 10,
    color: "#888",
  },
  avatar: {
    width: 30,
    height: 30,
    marginLeft: 10,
  },
});
