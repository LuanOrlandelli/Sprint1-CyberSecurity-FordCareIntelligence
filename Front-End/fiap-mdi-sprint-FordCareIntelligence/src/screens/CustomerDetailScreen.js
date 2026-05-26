import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";

import api from "../services/api";
import { colors } from "../theme/colors";

export default function CustomerDetailScreen({ route }) {
  const { customerId } = route.params;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reclassifying, setReclassifying] = useState(false);

  async function loadCustomerDetail() {
    try {
      const response = await api.get(`/customers/${customerId}`);
      setData(response.data);
    } catch (error) {
      console.log(
        "ERRO DETALHE:",
        error.response?.status,
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomerDetail();
  }, []);

  async function handleReclassify() {
    try {
      setReclassifying(true);

      await api.post("/predictions/classify", {
        customerId: customerId,
      });

      Alert.alert(
        "Classificação atualizada",
        "A IA gerou uma nova análise preditiva do cliente."
      );

      loadCustomerDetail();
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível reclassificar o cliente."
      );
    } finally {
      setReclassifying(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando cliente...</Text>
      </View>
    );
  }

  const customer = data?.customer;
  const vehicle = data?.vehicle;
  const prediction = data?.prediction;
  const recommendation = data?.recommendation;

  const riskColor =
    prediction?.riskLevel === "HIGH"
      ? colors.danger
      : prediction?.riskLevel === "MEDIUM"
      ? colors.warning
      : colors.success;

  const riskInfo =
    prediction?.riskLevel === "HIGH"
      ? {
          icon: "🚨",
          title: "ALTO RISCO DE EVASÃO",
          description:
            "O cliente apresenta alta probabilidade de abandonar a rede autorizada Ford.",
          impact:
            "Esse cliente exige ação imediata para evitar perda de retenção e impacto negativo no VIN Share.",
        }
      : prediction?.riskLevel === "MEDIUM"
      ? {
          icon: "⚠️",
          title: "RISCO MODERADO",
          description:
            "O cliente apresenta sinais moderados de desengajamento.",
          impact:
            "Campanhas preventivas e relacionamento ativo podem aumentar a fidelização.",
        }
      : {
          icon: "✅",
          title: "CLIENTE ESTÁVEL",
          description:
            "O cliente demonstra bom relacionamento com a rede Ford.",
          impact:
            "A manutenção da experiência positiva fortalece retenção e relacionamento.",
        };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {customer?.name?.charAt(0)}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{customer?.name}</Text>
          <Text style={styles.email}>{customer?.email}</Text>
        </View>
      </View>

      <View style={[styles.riskCard, { borderColor: riskColor }]}>
        <Text style={styles.riskLabel}>
          {riskInfo.icon} Inteligência Artificial
        </Text>

        <Text style={[styles.riskValue, { color: riskColor }]}>
          {riskInfo.title}
        </Text>

        <Text style={styles.score}>
          Score preditivo: {prediction?.riskScore ?? "-"}
        </Text>

        <Text style={styles.riskDescription}>
          {riskInfo.description}
        </Text>
      </View>

      <View style={styles.impactCard}>
        <Text style={styles.impactLabel}>
          Impacto no VIN Share
        </Text>

        <Text style={styles.impactText}>
          {riskInfo.impact}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.aiButton,
          reclassifying && styles.aiButtonDisabled,
        ]}
        onPress={handleReclassify}
        disabled={reclassifying}
      >
        <Text style={styles.aiButtonText}>
          {reclassifying
            ? "Reclassificando..."
            : "Atualizar classificação com IA"}
        </Text>
      </TouchableOpacity>

      <Section title="Dados do cliente">
        <Info label="Telefone" value={customer?.phone} />
        <Info label="CPF" value={customer?.cpf} />
        <Info label="ID do cliente" value={customer?.id} />
      </Section>

      <Section title="Veículo monitorado">
        <Info label="Modelo" value={vehicle?.model} />
        <Info label="Ano" value={vehicle?.year} />
        <Info label="VIN" value={vehicle?.vin} />
        <Info
          label="Garantia ativa"
          value={vehicle?.warrantyActive ? "Sim" : "Não"}
        />
      </Section>

      <Section title="Perfil identificado pela IA">
        <Text style={styles.profile}>
          {prediction?.customerProfile}
        </Text>
      </Section>

      <View style={styles.recommendationCard}>
        <Text style={styles.recommendationLabel}>
          Recomendação estratégica
        </Text>

        <Text style={styles.recommendationTitle}>
          {recommendation?.title}
        </Text>

        <Text style={styles.recommendationText}>
          {recommendation?.description}
        </Text>

        <View
          style={[
            styles.priorityBadge,
            { backgroundColor: riskColor },
          ]}
        >
          <Text style={styles.priorityText}>
            Prioridade {recommendation?.priority}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Info({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value ?? "-"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
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
  hero: {
    backgroundColor: colors.primary,
    padding: 20,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    elevation: 6,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },
  name: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },
  email: {
    color: "#DCEBFF",
    fontSize: 13,
    marginTop: 4,
  },
  riskCard: {
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderRadius: 24,
    borderWidth: 2,
    marginBottom: 16,
    elevation: 4,
  },
  riskLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  riskValue: {
    fontSize: 28,
    fontWeight: "900",
    marginTop: 8,
  },
  score: {
    color: colors.text,
    fontSize: 15,
    marginTop: 6,
    fontWeight: "800",
  },
  riskDescription: {
    marginTop: 12,
    color: colors.text,
    lineHeight: 22,
    fontSize: 15,
  },
  impactCard: {
    backgroundColor: colors.primaryDark,
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
    elevation: 5,
  },
  impactLabel: {
    color: "#BFD7FF",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  impactText: {
    color: "#FFFFFF",
    lineHeight: 22,
    fontSize: 15,
  },
  aiButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 16,
    elevation: 3,
  },
  aiButtonDisabled: {
    opacity: 0.7,
  },
  aiButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 15,
  },
  section: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 22,
    marginBottom: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: colors.primary,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 9,
  },
  infoLabel: {
    color: colors.muted,
    fontWeight: "700",
  },
  infoValue: {
    color: colors.text,
    fontWeight: "700",
    flex: 1,
    textAlign: "right",
  },
  profile: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  recommendationCard: {
    backgroundColor: colors.primaryDark,
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
    elevation: 6,
  },
  recommendationLabel: {
    color: "#BFD7FF",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  recommendationTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8,
  },
  recommendationText: {
    color: "#E5EEFF",
    fontSize: 15,
    lineHeight: 22,
  },
  priorityBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    marginTop: 16,
  },
  priorityText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 12,
  },
});