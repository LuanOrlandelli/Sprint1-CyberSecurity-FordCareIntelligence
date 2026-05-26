import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import CustomersScreen from "../screens/CustomersScreen";
import CustomerDetailScreen from "../screens/CustomerDetailScreen";
import LeadsScreen from "../screens/LeadsScreen";
import LoadingScreen from "../screens/LoadingScreen";
import CreateLeadScreen from "../screens/CreateLeadScreen";
import AIScreen from "../screens/AIScreen";

const Stack = createNativeStackNavigator();

export default function AppRoutes() {
  return (
    <Stack.Navigator initialRouteName="Loading">
      
      <Stack.Screen
        name="Loading"
        component={LoadingScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: "FordCare Intelligence" }}
      />

      <Stack.Screen
        name="Customers"
        component={CustomersScreen}
        options={{ title: "Clientes" }}
      />

      <Stack.Screen
        name="CustomerDetail"
        component={CustomerDetailScreen}
        options={{ title: "Detalhe do Cliente" }}
      />

      <Stack.Screen
        name="Leads"
        component={LeadsScreen}
        options={{ title: "Leads" }}
      />

      <Stack.Screen
        name="CreateLead"
        component={CreateLeadScreen}
        options={{ title: "Novo Lead" }}
      />

      <Stack.Screen
        name="AI"
        component={AIScreen}
        options={{ title: "IA FordCare" }}
      />

    </Stack.Navigator>
  );
}