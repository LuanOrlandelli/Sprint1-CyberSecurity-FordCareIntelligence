import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { colors } from "../theme/colors";

export default function LoadingOverlay({
  visible,
  text = "Processando informações....",
}) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.box}>
        <View style={styles.logoCircle}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>

        <Text style={styles.title}>FordCare Intelligence</Text>

        <Text style={styles.text}>{text}</Text>

        <View style={styles.securityBadge}>
          <Text style={styles.securityText}>
            Ambiente seguro • JWT • Auditoria
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  box: {
    width: 280,
    backgroundColor: "#FFFFFF",
    paddingVertical: 30,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: "center",
    elevation: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },

  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  title: {
    marginTop: 18,
    color: colors.primary,
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },

  text: {
    marginTop: 8,
    textAlign: "center",
    color: colors.muted,
    lineHeight: 22,
    fontSize: 14,
  },

  securityBadge: {
    marginTop: 18,
    backgroundColor: "#EEF3FA",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },

  securityText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "800",
  },
});