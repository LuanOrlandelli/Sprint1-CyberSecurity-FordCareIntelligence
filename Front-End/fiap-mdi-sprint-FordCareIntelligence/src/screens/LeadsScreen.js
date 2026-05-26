import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";

import api from "../services/api";
import { colors } from "../theme/colors";
import LoadingOverlay from "../components/LoadingOverlay";

export default function LeadsScreen({ navigation }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingLeadId, setProcessingLeadId] = useState(null);

  async function loadLeads() {
    try {
      const response = await api.get("/leads");
      setLeads(response.data);
    } catch (error) {
      console.log(
        "ERRO LEADS:",
        error.response?.status,
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateLeadStatus(id) {
    try {
      setProcessingLeadId(id);

      await new Promise((resolve) => setTimeout(resolve, 100));

      await api.put(`/leads/${id}/status`, {
        status: "CONVERTED",
      });

      await new Promise((resolve) => setTimeout(resolve, 1200));

      Alert.alert(
        "Lead convertido",
        "A oportunidade foi convertida em ação estratégica de retenção."
      );

      loadLeads();
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível atualizar o lead."
      );
    } finally {
      setProcessingLeadId(null);
    }
  }

  useEffect(() => {
    loadLeads();
  }, []);

  const totalLeads = leads.length;

  const convertedLeads = leads.filter(
    (lead) => lead.status === "CONVERTED"
  ).length;

  const activeLeads = leads.filter(
    (lead) => lead.status !== "CONVERTED"
  ).length;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        style={styles.container}
        data={leads}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.hero}>
              <Text style={styles.heroLabel}>CRM de Retenção</Text>
              <Text style={styles.heroTitle}>Gestão de Leads</Text>
              <Text style={styles.heroText}>
                Monitore oportunidades, acompanhe ações comerciais e fortaleça a retenção pós-venda.
              </Text>
            </View>

            <View style={styles.metricsRow}>
              <MetricCard label="Total" value={totalLeads} />
              <MetricCard label="Ativos" value={activeLeads} warning />
              <MetricCard label="Convertidos" value={convertedLeads} success />
            </View>

            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate("CreateLead")}
            >
              <Text style={styles.createButtonText}>+ Novo Lead Estratégico</Text>
            </TouchableOpacity>
          </>
        }
        renderItem={({ item }) => {
            const statusColor =
              item.status === "CONVERTED"
                ? colors.success
                : item.status === "CONTACTED"
                ? colors.warning
                : colors.secondary;

            const statusLabel =
              item.status === "CONVERTED"
                ? "Convertido"
                : item.status === "CONTACTED"
                ? "Em contato"
                : "Novo lead";

            const priority =
              item.status === "NEW"
                ? "Alta prioridade"
                : item.status === "CONTACTED"
                ? "Acompanhamento"
                : "Concluído";

            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>
                      {item.customerName}
                    </Text>

                    <Text style={styles.cardSubtitle}>
                      Lead #{item.id} • Cliente ID {item.customerId}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusColor },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {statusLabel}
                    </Text>
                  </View>
                </View>

                <View style={styles.priorityBox}>
                  <Text style={styles.priorityLabel}>
                    Prioridade comercial
                  </Text>

                  <Text
                    style={[
                      styles.priorityText,
                      { color: statusColor },
                    ]}
                  >
                    {priority}
                  </Text>
                </View>

                <View style={styles.infoBox}>
                  <Info
                    label="Origem do Lead"
                    value={item.origin}
                  />

                  <Info
                    label="Concessionária"
                    value={`Unidade ${item.dealershipId}`}
                  />

                  <Info
                    label="Observações"
                    value={item.notes || "-"}
                  />
                </View>

                {item.status !== "CONVERTED" ? (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => updateLeadStatus(item.id)}
                  >
                    <Text style={styles.buttonText}>
                      Converter em ação de retenção
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.convertedBox}>
                    <Text style={styles.convertedTitle}>
                      Lead convertido com sucesso
                    </Text>

                    <Text style={styles.convertedText}>
                      O cliente já está em acompanhamento estratégico pela equipe de retenção.
                    </Text>
                  </View>
                )}
              </View>
            );
          }}
      />

      <LoadingOverlay
        visible={processingLeadId !== null}
        text="Atualizando pipeline comercial e convertendo lead."
      />
    </View>
  );
}

function MetricCard({ label, value, success, warning }) {
  const color = success
    ? colors.success
    : warning
    ? colors.warning
    : colors.primary;

  return (
    <View style={styles.metricCard}>
      <View
        style={[
          styles.metricBar,
          { backgroundColor: color },
        ]}
      />

      <Text style={styles.metricValue}>
        {value}
      </Text>

      <Text style={styles.metricLabel}>
        {label}
      </Text>
    </View>
  );
}

function Info({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>
        {label}
      </Text>

      <Text style={styles.infoValue}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  listContent: {
    padding: 24,
    paddingBottom: 40,
  },

  hero: {
    backgroundColor: colors.primaryDark,
    padding: 24,
    borderRadius: 26,
    marginBottom: 18,
    elevation: 6,
  },

  heroLabel: {
    color: "#BFD7FF",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 8,
  },

  heroText: {
    color: "#E5EEFF",
    lineHeight: 22,
    fontSize: 15,
  },

  metricsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },

  metricCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 22,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },

  metricBar: {
    width: 34,
    height: 5,
    borderRadius: 999,
    marginBottom: 14,
  },

  metricValue: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: "900",
  },

  metricLabel: {
    color: colors.text,
    fontWeight: "800",
    marginTop: 2,
  },

  createButton: {
    backgroundColor: colors.primary,
    padding: 17,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 18,
    elevation: 3,
  },

  createButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 15,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 26,
    marginBottom: 18,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 16,
  },

  cardTitle: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "900",
  },

  cardSubtitle: {
    color: colors.muted,
    marginTop: 4,
    fontSize: 13,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },

  statusText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 11,
  },

  priorityBox: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    borderRadius: 18,
    marginBottom: 14,
  },

  priorityLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },

  priorityText: {
    fontWeight: "900",
    fontSize: 16,
  },

  infoBox: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },

  infoRow: {
    marginBottom: 10,
  },

  infoLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 3,
  },

  infoValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
  },

  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 16,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 15,
  },

  convertedBox: {
    marginTop: 16,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    padding: 16,
    borderRadius: 18,
  },

  convertedTitle: {
    color: colors.success,
    fontWeight: "900",
    marginBottom: 6,
  },

  convertedText: {
    color: colors.text,
    lineHeight: 20,
    fontSize: 14,
  },
});