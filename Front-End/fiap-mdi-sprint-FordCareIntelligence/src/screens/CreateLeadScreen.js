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

export default function CreateLeadScreen({ navigation }) {
  const [customerId, setCustomerId] = useState("");
  const [dealershipId, setDealershipId] = useState("1");
  const [origin, setOrigin] = useState("Manual");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreateLead() {
    if (!customerId || !dealershipId || !origin) {
      Alert.alert("Atenção", "Preencha cliente, concessionária e origem.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/leads", {
        customerId: Number(customerId),
        dealershipId: Number(dealershipId),
        origin,
        notes,
      });

      Alert.alert("Sucesso", "Lead criado com sucesso.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar o lead.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Novo Lead</Text>
      <Text style={styles.subtitle}>
        Registre uma nova oportunidade de retenção.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>ID do Cliente</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Ex: 1"
          value={customerId}
          onChangeText={setCustomerId}
        />

        <Text style={styles.label}>ID da Concessionária</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Ex: 1"
          value={dealershipId}
          onChangeText={setDealershipId}
        />

        <Text style={styles.label}>Origem</Text>
        <TextInput
          style={styles.input}
          placeholder="Manual, IA Prediction..."
          value={origin}
          onChangeText={setOrigin}
        />

        <Text style={styles.label}>Observações</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descreva a oportunidade..."
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCreateLead}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Criando..." : "Criar lead"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: colors.primary,
  },
  subtitle: {
    fontSize: 15,
    color: colors.muted,
    marginTop: 4,
    marginBottom: 20,
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
    fontSize: 13,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 6,
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
  textArea: {
    height: 110,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 16,
  },
});