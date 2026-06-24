import React from "react";
import { View, Text, Pressable, StyleSheet, Switch } from "react-native";

type Props = {
  enabled: boolean;
  selectedCount: number;
  statusMessage: string;
  onChooseActivities: () => void;
  onToggleNotifications: () => void;
};

export default function HomeScreen({
  enabled,
  selectedCount,
  statusMessage,
  onChooseActivities,
  onToggleNotifications,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>😊</Text>

      <Text style={styles.title}>Notify Hourly Happiness</Text>

      <Text style={styles.subtitle}>{selectedCount} activities selected</Text>

      <Pressable style={styles.activityButton} onPress={onChooseActivities}>
        <Text style={styles.activityButtonText}>Choose Activities</Text>
      </Pressable>

      <View style={styles.notificationRow}>
        <Text style={styles.notificationText}>Notifications</Text>

        <Switch value={enabled} onValueChange={onToggleNotifications} />
      </View>

      {!!statusMessage && <Text style={styles.status}>{statusMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  logo: {
    fontSize: 64,
    textAlign: "center",
  },

  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 12,
  },

  subtitle: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 8,
    fontSize: 16,
  },

  activityButton: {
    backgroundColor: "#f97316",
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 30,
    alignItems: "center",
  },

  activityButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  notificationRow: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  notificationText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  status: {
    marginTop: 24,
    textAlign: "center",
    color: "#facc15",
    lineHeight: 22,
  },
});
