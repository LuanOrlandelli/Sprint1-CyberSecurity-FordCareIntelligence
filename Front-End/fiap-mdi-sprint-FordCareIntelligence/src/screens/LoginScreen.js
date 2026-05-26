import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";

import api from "../services/api";
import { saveToken } from "../storage/tokenStorage";
import { colors } from "../theme/colors";
import LoadingOverlay from "../components/LoadingOverlay";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("admin@fordcare.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      await new Promise((resolve) => setTimeout(resolve, 1400));

      await saveToken(response.data.token);

      navigation.replace("Dashboard");
    } catch (error) {
      console.log("ERRO LOGIN:", error.message);
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);

      Alert.alert(
        "Erro no login",
        error.response?.data?.message ||
          error.message ||
          "Não foi possível conectar."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.primaryDark}
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.backgroundGlowTop} />
        <View style={styles.backgroundGlowBottom} />

        <View style={styles.header}>
          <Text style={styles.badge}>Ford Motor Company</Text>

          <Text style={styles.logo}>FordCare</Text>

          <Text style={styles.logoStrong}>
            Intelligence
          </Text>

          <Text style={styles.subtitle}>
            Plataforma inteligente de retenção e fidelização no pós-venda Ford.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Acesso Corporativo
          </Text>

          <Text style={styles.cardSubtitle}>
            Entre com suas credenciais para acessar o painel executivo.
          </Text>

          <Text style={styles.label}>E-mail</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Senha</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={[
              styles.button,
              loading && styles.buttonDisabled,
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Autenticando..." : "Entrar"}
            </Text>
          </TouchableOpacity>

          <View style={styles.securityRow}>
            <Text style={styles.securityText}>
              JWT • RBAC • TLS • Auditoria • Rate Limiting
            </Text>
          </View>
        </View>

        <View style={styles.footerBox}>
          <Text style={styles.footer}>
            Challenge 2026 • FordCare Intelligence
          </Text>

          <Text style={styles.footerSub}>
            Plataforma acadêmica corporativa de retenção pós-venda.
          </Text>
        </View>
      </KeyboardAvoidingView>

      <LoadingOverlay
        visible={loading}
        text="Validando credenciais e carregando ambiente seguro."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: colors.background,
  },

  backgroundGlowTop: {
    position: "absolute",
    top: -120,
    right: -60,

    width: 260,
    height: 260,

    borderRadius: 999,

    backgroundColor: "#DCEBFF",

    opacity: 0.5,
  },

  backgroundGlowBottom: {
    position: "absolute",
    bottom: -140,
    left: -100,

    width: 280,
    height: 280,

    borderRadius: 999,

    backgroundColor: "#E8F1FF",

    opacity: 0.7,
  },

  header: {
    marginBottom: 34,
  },

  badge: {
    alignSelf: "flex-start",

    backgroundColor: "#E8F1FF",

    color: colors.primary,

    paddingHorizontal: 14,
    paddingVertical: 8,

    borderRadius: 999,

    fontSize: 12,
    fontWeight: "900",

    letterSpacing: 1,

    marginBottom: 18,
  },

  logo: {
    fontSize: 46,
    fontWeight: "900",
    color: colors.primary,
  },

  logoStrong: {
    fontSize: 42,
    fontWeight: "300",
    color: colors.secondary,
    marginTop: -8,
  },

  subtitle: {
    marginTop: 16,

    fontSize: 16,
    color: colors.muted,

    lineHeight: 24,
  },

  card: {
    backgroundColor: colors.card,

    padding: 24,

    borderRadius: 30,

    elevation: 8,

    borderWidth: 1,
    borderColor: colors.border,
  },

  cardTitle: {
    color: colors.primary,

    fontSize: 24,
    fontWeight: "900",

    marginBottom: 6,
  },

  cardSubtitle: {
    color: colors.muted,

    lineHeight: 22,

    marginBottom: 24,
  },

  label: {
    fontSize: 13,
    color: colors.text,
    fontWeight: "800",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#F9FAFB",

    padding: 16,

    borderRadius: 16,

    marginBottom: 18,

    borderWidth: 1,
    borderColor: colors.border,

    color: colors.text,

    fontSize: 15,
  },

  button: {
    backgroundColor: colors.primary,

    padding: 18,

    borderRadius: 18,

    alignItems: "center",

    marginTop: 6,

    elevation: 3,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#FFFFFF",

    fontWeight: "900",

    fontSize: 16,
  },

  securityRow: {
    marginTop: 18,

    alignItems: "center",
  },

  securityText: {
    color: colors.muted,

    fontSize: 12,
    fontWeight: "700",

    textAlign: "center",

    lineHeight: 18,
  },

  footerBox: {
    marginTop: 26,

    alignItems: "center",
  },

  footer: {
    textAlign: "center",

    color: colors.muted,

    fontSize: 12,

    fontWeight: "800",
  },

  footerSub: {
    marginTop: 6,

    color: "#9CA3AF",

    fontSize: 11,

    textAlign: "center",
  },
});