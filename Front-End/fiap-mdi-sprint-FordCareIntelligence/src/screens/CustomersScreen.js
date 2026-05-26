import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";

import api from "../services/api";
import { colors } from "../theme/colors";

export default function CustomersScreen({ navigation }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadCustomers() {
    try {
      const response = await api.get("/customers");
      setCustomers(response.data);
    } catch (error) {
      console.log("ERRO CLIENTES:", error.response?.status, error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando clientes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clientes</Text>
      <Text style={styles.subtitle}>
        Clientes monitorados por risco, veículo e oportunidade de retenção
      </Text>

      <FlatList
        data={customers}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => {
          const riskColor =
            item.riskLevel === "HIGH"
              ? colors.danger
              : item.riskLevel === "MEDIUM"
              ? colors.warning
              : item.riskLevel === "LOW"
              ? colors.success
              : colors.muted;

          const riskLabel =
            item.riskLevel === "HIGH"
              ? "Alto risco"
              : item.riskLevel === "MEDIUM"
              ? "Risco médio"
              : item.riskLevel === "LOW"
              ? "Baixo risco"
              : "Não classificado";

          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate("CustomerDetail", {
                  customerId: item.id,
                })
              }
            >
              <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{item.name?.charAt(0)}</Text>
                </View>

                <View style={styles.cardContent}>
                  <Text style={styles.customerName}>{item.name}</Text>
                  <Text style={styles.customerInfo}>{item.email}</Text>
                  <Text style={styles.customerInfo}>{item.phone}</Text>
                </View>
              </View>

              <View style={styles.vehicleBox}>
                <Text style={styles.vehicleLabel}>Veículo monitorado</Text>
                <Text style={styles.vehicleText}>
                  {item.vehicleModel || "Veículo não informado"}
                  {item.vehicleYear ? ` • ${item.vehicleYear}` : ""}
                </Text>
              </View>

              <View style={styles.footerRow}>
                <View style={[styles.riskBadge, { backgroundColor: riskColor }]}>
                  <Text style={styles.riskBadgeText}>{riskLabel}</Text>
                </View>

                <Text style={styles.scoreText}>
                  Score: {item.riskScore ?? "-"}
                </Text>

                <Text style={styles.arrow}>›</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    color: colors.primary,
    fontWeight: "600",
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: colors.primary,
  },
  subtitle: {
    fontSize: 15,
    color: colors.muted,
    marginBottom: 20,
    marginTop: 4,
    lineHeight: 21,
  },
  card: {
    backgroundColor: colors.card,
    padding: 18,
    borderRadius: 24,
    marginBottom: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },
  cardContent: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 4,
  },
  customerInfo: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 2,
  },
  vehicleBox: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
  },
  vehicleLabel: {
    fontSize: 11,
    fontWeight: "900",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: 4,
  },
  vehicleText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    marginRight: 10,
  },
  riskBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },
  scoreText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
    flex: 1,
  },
  arrow: {
    fontSize: 32,
    color: colors.secondary,
    fontWeight: "300",
  },
});