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
import { FIREBASE_AUTH } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export function StackRoutes() {
  const auth = FIREBASE_AUTH;
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(user);
      }
    });
  }, []);

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
        name="TelaF"
        component={Feed}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Avatar
              size={28}
              rounded
              source={{ uri: "https://randomuser.me/api/portraits/men/36.jpg" }}
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
