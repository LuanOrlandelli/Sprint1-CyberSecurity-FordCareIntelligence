import React, { useEffect } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
} from "react-native";
import { colors } from "../theme/colors";
import { getToken } from "../storage/tokenStorage";

export default function LoadingScreen({ navigation }) {

  async function checkLogin() {
    const token = await getToken();

    if (token) {
      navigation.replace("Dashboard");
    } else {
      navigation.replace("Login");
    }
  }

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#003478" />

      <Text style={styles.text}>
        Carregando FordCare Intelligence...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F7FB",
  },
  text: {
    marginTop: 16,
    color: "#003478",
    fontSize: 16,
    fontWeight: "600",
  },
});