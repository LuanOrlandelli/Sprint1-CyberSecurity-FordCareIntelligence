import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";

import api from "../services/api";
import { colors } from "../theme/colors";
import LoadingOverlay from "../components/LoadingOverlay";

export default function AIScreen() {
  const [customerId, setCustomerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleClassify() {
    if (!customerId) {
      Alert.alert("Atenção", "Informe o ID do cliente.");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const response = await api.post("/predictions/classify", {
        customerId: Number(customerId),
      });

      await new Promise((resolve) => setTimeout(resolve, 1800));

      setResult(response.data);
    } catch (error) {
      console.log(
        "ERRO IA:",
        error.response?.status,
        error.response?.data || error.message
      );

      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          "Não foi possível classificar o cliente."
      );
    } finally {
      setLoading(false);
    }
  }

  const riskColor =
    result?.riskLevel === "HIGH"
      ? colors.danger
      : result?.riskLevel === "MEDIUM"
      ? colors.warning
      : colors.success;

  const riskInfo =
    result?.riskLevel === "HIGH"
      ? {
          title: "ALTO RISCO DE EVASÃO",
          icon: "🚨",
          description:
            "O cliente apresenta forte probabilidade de abandonar a rede Ford.",
          action:
            "Contato imediato com oferta personalizada de revisão, benefício exclusivo ou pacote de manutenção.",
          impact:
            "Esse cliente deve ser priorizado pela equipe, pois sua retenção pode contribuir diretamente para o aumento do VIN Share.",
        }
      : result?.riskLevel === "MEDIUM"
      ? {
          title: "RISCO MODERADO",
          icon: "⚠️",
          description:
            "O cliente apresenta sinais moderados de desengajamento com a rede autorizada.",
          action:
            "Reforçar relacionamento, enviar lembrete preventivo de manutenção e apresentar benefícios do pós-venda Ford.",
          impact:
            "Esse cliente ainda pode ser retido com ações de relacionamento e acompanhamento ativo.",
        }
      : {
          title: "CLIENTE ESTÁVEL",
          icon: "✅",
          description:
            "O cliente mantém bom relacionamento com a rede Ford e apresenta baixa probabilidade de evasão.",
          action:
            "Manter acompanhamento preventivo e comunicação periódica para fortalecer a fidelização.",
          impact:
            "Esse cliente contribui positivamente para a retenção e deve continuar recebendo ações de cuidado e relacionamento.",
        };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>Inteligência Artificial</Text>
          <Text style={styles.heroTitle}>Classificação de Risco</Text>
          <Text style={styles.heroText}>
            Analise o perfil do cliente, identifique risco de evasão e gere
            ações de retenção para fortalecer o VIN Share.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>ID do Cliente</Text>

          <TextInput
            style={styles.input}
            placeholder="Ex: 1"
            keyboardType="numeric"
            value={customerId}
            onChangeText={setCustomerId}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleClassify}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Analisando..." : "Analisar com IA"}
            </Text>
          </TouchableOpacity>
        </View>

        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Resultado da IA</Text>

            <Text style={styles.customerId}>Cliente #{result.customerId}</Text>

            <View style={[styles.riskBox, { borderColor: riskColor }]}>
              <Text style={styles.riskLabel}>
                {riskInfo.icon} Inteligência Artificial
              </Text>

              <Text style={[styles.riskValue, { color: riskColor }]}>
                {riskInfo.title}
              </Text>

              <Text style={styles.score}>
                Score preditivo: {result.riskScore}
              </Text>

              <Text style={styles.aiDescription}>
                {riskInfo.description}
              </Text>

              <View style={styles.aiActionBox}>
                <Text style={styles.aiActionTitle}>Ação recomendada</Text>
                <Text style={styles.aiActionText}>{riskInfo.action}</Text>
              </View>
            </View>

            <View style={styles.sectionBox}>
              <Text style={styles.sectionTitle}>Perfil identificado</Text>
              <Text style={styles.text}>{result.customerProfile}</Text>
            </View>

            <View style={styles.sectionBox}>
              <Text style={styles.sectionTitle}>
                Recomendação gerada pelo modelo
              </Text>
              <Text style={styles.text}>{result.recommendation}</Text>
            </View>

            <View style={styles.impactCard}>
              <Text style={styles.impactTitle}>Impacto no VIN Share</Text>
              <Text style={styles.impactText}>{riskInfo.impact}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <LoadingOverlay
        visible={loading}
        text="A IA está avaliando risco, perfil e recomendação do cliente."
      />
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
  hero: {
    backgroundColor: colors.primaryDark,
    padding: 24,
    borderRadius: 24,
    marginBottom: 20,
    elevation: 6,
  },
  heroLabel: {
    color: "#BFD7FF",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 8,
  },
  heroText: {
    color: "#E5EEFF",
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 24,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    color: colors.text,
    fontWeight: "800",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 16,
  },
  resultCard: {
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 24,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultLabel: {
    color: colors.secondary,
    fontWeight: "900",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  customerId: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.primary,
    marginBottom: 16,
  },
  riskBox: {
    borderWidth: 2,
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    backgroundColor: "#FFFFFF",
  },
  riskLabel: {
    color: colors.muted,
    fontWeight: "800",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  riskValue: {
    fontSize: 30,
    fontWeight: "900",
    marginTop: 8,
  },
  score: {
    color: colors.text,
    fontWeight: "900",
    marginTop: 6,
    fontSize: 15,
  },
  aiDescription: {
    marginTop: 10,
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  aiActionBox: {
    marginTop: 16,
    backgroundColor: "#F3F7FF",
    padding: 14,
    borderRadius: 16,
  },
  aiActionTitle: {
    color: colors.primary,
    fontWeight: "900",
    marginBottom: 6,
  },
  aiActionText: {
    color: colors.text,
    lineHeight: 20,
    fontWeight: "600",
  },
  sectionBox: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 6,
  },
  text: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  impactCard: {
    backgroundColor: colors.primaryDark,
    padding: 18,
    borderRadius: 20,
    marginTop: 4,
  },
  impactTitle: {
    color: "#BFD7FF",
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  impactText: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
  },
});