import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";

import { PieChart, BarChart } from "react-native-chart-kit";
import api from "../services/api";
import { removeToken } from "../storage/tokenStorage";
import { colors } from "../theme/colors";

const screenWidth = Dimensions.get("window").width;

export default function DashboardScreen({ navigation }) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    try {
      const response = await api.get("/insights/dashboard");
      setDashboard(response.data);
    } catch (error) {
      console.log(
        "ERRO DASHBOARD:",
        error.response?.status,
        error.response?.data || error.message
      );

      if (error.response?.status === 401 || error.response?.status === 403) {
        await removeToken();

        Alert.alert("Sessão expirada", "Faça login novamente.");

        navigation.replace("Login");
        return;
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await removeToken();
    navigation.replace("Login");
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando indicadores...</Text>
      </View>
    );
  }

  if (!dashboard) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>
          Não foi possível carregar o dashboard.
        </Text>
      </View>
    );
  }

  const riskData = [
    {
      name: "Alto",
      population: dashboard.highRiskCustomers,
      color: colors.danger,
      legendFontColor: colors.text,
      legendFontSize: 12,
    },
    {
      name: "Médio",
      population: dashboard.mediumRiskCustomers,
      color: colors.warning,
      legendFontColor: colors.text,
      legendFontSize: 12,
    },
    {
      name: "Baixo",
      population: dashboard.lowRiskCustomers,
      color: colors.success,
      legendFontColor: colors.text,
      legendFontSize: 12,
    },
  ];

  const leadsData = {
    labels: ["Total", "Novos"],
    datasets: [
      {
        data: [dashboard.totalLeads, dashboard.newLeads],
      },
    ],
  };

  const executiveSummary =
    dashboard.highRiskCustomers > dashboard.mediumRiskCustomers
      ? {
          title: "Alerta prioritário",
          text:
            "O número de clientes em alto risco está elevado. Recomenda-se priorizar ações de retenção, contato preventivo e campanhas de relacionamento para proteger o VIN Share.",
        }
      : {
          title: "Cenário controlado",
          text:
            "A distribuição de risco está equilibrada. O foco deve permanecer em fidelização preventiva e acompanhamento contínuo dos clientes.",
        };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.heroLabel}>FordCare Intelligence</Text>
        <Text style={styles.heroTitle}>Painel de Retenção</Text>
        <Text style={styles.heroText}>
          Monitore clientes, riscos e oportunidades no pós-venda.
        </Text>
      </View>

      <View style={styles.grid}>
        <MetricCard label="Clientes" value={dashboard.totalCustomers} />
        <MetricCard
          label="Alto risco"
          value={dashboard.highRiskCustomers}
          danger
        />
        <MetricCard label="Leads" value={dashboard.totalLeads} />
        <MetricCard
          label="Novos leads"
          value={dashboard.newLeads}
          warning
        />
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Distribuição de risco</Text>

        <PieChart
          data={riskData}
          width={screenWidth - 48}
          height={190}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="8"
          absolute
        />
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Leads em acompanhamento</Text>

        <BarChart
          data={leadsData}
          width={screenWidth - 76}
          height={220}
          chartConfig={chartConfig}
          fromZero
          showValuesOnTopOfBars
          style={styles.barChart}
        />
      </View>

      <View style={styles.executiveCard}>
        <Text style={styles.executiveLabel}>Resumo Executivo</Text>

        <Text style={styles.executiveTitle}>
          {executiveSummary.title}
        </Text>

        <Text style={styles.executiveText}>
          {executiveSummary.text}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("Customers")}
        >
          <Text style={styles.primaryButtonText}>Ver clientes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("Leads")}
        >
          <Text style={styles.secondaryButtonText}>Ver leads</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("AI")}
        >
          <Text style={styles.secondaryButtonText}>Análise com IA</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function MetricCard({ label, value, danger, warning }) {
  const badgeStyle = danger
    ? styles.badgeDanger
    : warning
    ? styles.badgeWarning
    : styles.badgeDefault;

  return (
    <View style={styles.card}>
      <View style={[styles.badge, badgeStyle]} />
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#FFFFFF",
  backgroundGradientTo: "#FFFFFF",
  decimalPlaces: 0,
  color: () => colors.primary,
  labelColor: () => colors.text,
  barPercentage: 0.7,
  propsForBackgroundLines: {
    strokeDasharray: "",
    stroke: "#E5E7EB",
  },
};

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
    padding: 24,
    borderRadius: 24,
    marginBottom: 22,
    elevation: 6,
  },
  heroLabel: {
    color: "#BFD7FF",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 8,
  },
  heroText: {
    color: "#E5EEFF",
    fontSize: 15,
    lineHeight: 22,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  card: {
    width: "47%",
    backgroundColor: colors.card,
    padding: 18,
    borderRadius: 22,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badge: {
    width: 34,
    height: 5,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeDefault: {
    backgroundColor: colors.secondary,
  },
  badgeDanger: {
    backgroundColor: colors.danger,
  },
  badgeWarning: {
    backgroundColor: colors.warning,
  },
  cardValue: {
    fontSize: 34,
    fontWeight: "900",
    color: colors.primary,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
    marginTop: 4,
  },
  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 14,
    marginTop: 18,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chartTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: colors.primary,
    marginBottom: 8,
    marginLeft: 6,
  },
  barChart: {
    borderRadius: 18,
  },
  executiveCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: 24,
    padding: 22,
    marginTop: 18,
    elevation: 5,
  },
  executiveLabel: {
    color: "#BFD7FF",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  executiveTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 10,
  },
  executiveText: {
    color: "#E5EEFF",
    fontSize: 15,
    lineHeight: 24,
  },
  actions: {
    marginTop: 26,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 16,
  },
  logoutButton: {
    padding: 15,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.danger,
  },
  logoutText: {
    color: colors.danger,
    fontWeight: "900",
  },
});