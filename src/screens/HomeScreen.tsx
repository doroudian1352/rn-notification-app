import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Switch,
  FlatList,
} from "react-native";

export type SelectedDisplayActivity = {
  index: number;
  slogan: string;
  activity: string;
  intervalMinutes: number;
};

type Props = {
  enabled: boolean;
  selected: SelectedDisplayActivity[];
  statusMessage: string;
  onChooseActivities: () => void;
  onToggleNotifications: () => void;
  onRemoveActivity: (index: number) => void;
};

export default function HomeScreen({
  enabled,
  selected,
  statusMessage,
  onChooseActivities,
  onToggleNotifications,
  onRemoveActivity,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>😊</Text>

      <Text style={styles.title}>Notify Hourly Happiness</Text>

      <Text style={styles.subtitle}>{selected.length} activities selected</Text>

      <Pressable style={styles.activityButton} onPress={onChooseActivities}>
        <Text style={styles.activityButtonText}>Choose Activities</Text>
      </Pressable>

      {selected.length === 0 ? (
        <Text style={styles.empty}>No activities selected yet.</Text>
      ) : (
        <FlatList
          data={selected}
          keyExtractor={(_, index) => String(index)}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.activityItem}>
              <View style={styles.activityHeader}>
                <Text style={styles.activitySlogan}>{item.slogan}</Text>
                <Pressable
                  style={styles.removeButton}
                  onPress={() => onRemoveActivity(item.index)}
                  hitSlop={8}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </Pressable>
              </View>
              <Text style={styles.activityText}>{item.activity}</Text>
              <Text style={styles.activityInterval}>
                Every {item.intervalMinutes} min
              </Text>
            </View>
          )}
        />
      )}

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
    paddingTop: 56,
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

  empty: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 16,
    fontSize: 14,
  },

  list: {
    marginTop: 16,
    maxHeight: 300,
  },

  listContent: {
    paddingBottom: 8,
  },

  activityItem: {
    backgroundColor: "#0f3460",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },

  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  activitySlogan: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
    flexWrap: "wrap",
  },

  removeButton: {
    marginLeft: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ef4444",
  },

  removeText: {
    color: "#ef4444",
    fontSize: 12,
    fontWeight: "700",
  },

  activityText: {
    color: "#cbd5e1",
    fontSize: 13,
    marginTop: 4,
    lineHeight: 19,
  },

  activityInterval: {
    color: "#f97316",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 8,
  },

  notificationRow: {
    marginTop: 24,
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
