import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import Feed from "./screens/Feed";
import { Avatar } from "@rneui/themed";
import AddPhoto from "./screens/AddPhoto";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./screens/Login";
import Register from "./screens/Register";
import { useEffect, useState } from "react";
import { db, firebase } from "../firebase";
import Profile from "./screens/Profile";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export function StackRoutes() {
  const [currentUser, setCurrentUser] = useState(null);

  const userHandler = (user) =>
    user ? setCurrentUser(user) : setCurrentUser(null);

  useEffect(
    () => firebase.auth().onAuthStateChanged((user) => userHandler(user)),
    []
  );

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      {currentUser ? (
        <Stack.Screen name="Home" component={TabRoutes} />
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </>
      )}
    </Stack.Navigator>
  );
}

export function TabRoutes() {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const user = firebase.auth().currentUser;

    const unsubscribe = db
      .collection("users")
      .where("owner_uid", "==", user.uid)
      .limit(1)
      .onSnapshot((snapshot) =>
        snapshot.docs.map((doc) => {
          setImage(doc.data().profile_picture)
          
        })
      );

   
  },[])
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#000", borderTopWidth: 0 },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="home"
        component={Feed}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={"#fff"} size={26} />
          ),
        }}
      />

      <Tab.Screen
        name="TelaB"
        component={Feed}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="search" color={"#fff"} size={24} />
          ),
        }}
      />

      <Tab.Screen
        name="add"
        component={AddPhoto}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="plus-square" color={"#fff"} size={25} />
          ),
          tabBarStyle: {
            display: "none",
          },
        }}
      />

      <Tab.Screen
        name="TelaD"
        component={Feed}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="tv" color={"#fff"} size={26} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Avatar
              size={28}
              rounded
              source={{ uri: image }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function Navigator() {
  return (
    <NavigationContainer>
      <StackRoutes />
    </NavigationContainer>
  );
}
