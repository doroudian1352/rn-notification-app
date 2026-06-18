import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { HOURLY_ITEMS } from "../data/hourlyContent";

type SelectActivityScreenProps = {
  selectedIndices: Set<number>;
  onToggle: (index: number) => void;
  onDone: () => void;
};

export function SelectActivityScreen({
  selectedIndices,
  onToggle,
  onDone,
}: SelectActivityScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onDone}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.title}>Select activities</Text>
        <Text style={styles.subtitle}>
          Choose which activities appear in your hourly notifications.
        </Text>
      </View>

      <FlatList
        data={HOURLY_ITEMS}
        keyExtractor={(_, index) => String(index)}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => {
          const selected = selectedIndices.has(index);
          return (
            <Pressable
              style={[styles.item, selected && styles.itemSelected]}
              onPress={() => onToggle(index)}
            >
              <View
                style={[styles.checkbox, selected && styles.checkboxSelected]}
              >
                {selected ? <Text style={styles.checkmark}>✓</Text> : null}
              </View>
              <View style={styles.itemBody}>
                <Text style={styles.slogan}>{item.slogan}</Text>
                <Text style={styles.activity}>{item.activity}</Text>
              </View>
            </Pressable>
          );
        }}
      />

      <View style={styles.footer}>
        <Text style={styles.footerCount}>
          {selectedIndices.size} of {HOURLY_ITEMS.length} selected
        </Text>
        <Pressable style={styles.doneButton} onPress={onDone}>
          <Text style={styles.doneButtonText}>Done</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    paddingTop: 56,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#c9d1d9",
    lineHeight: 20,
  },
  backButton: {
    marginBottom: 8,
  },
  backText: {
    color: "#f8fafc",
    fontWeight: "700",
    marginBottom: 6,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#0f3460",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  itemSelected: {
    borderColor: "#f97316",
    backgroundColor: "#16213e",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#64748b",
    marginRight: 12,
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: "#f97316",
    borderColor: "#f97316",
  },
  checkmark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  itemBody: {
    flex: 1,
  },
  slogan: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  activity: {
    marginTop: 6,
    fontSize: 14,
    color: "#cbd5e1",
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#16213e",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerCount: {
    fontSize: 14,
    color: "#94a3b8",
  },
  doneButton: {
    backgroundColor: "#f97316",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  doneButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
