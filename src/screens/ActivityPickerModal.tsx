import React from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
import { HOURLY_ITEMS } from "../data/hourlyContent";

type Props = {
  visible: boolean;
  selectedIndices: Set<number>;
  onToggle: (index: number) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onClose: () => void;
};

export default function ActivityPickerModal({
  visible,
  selectedIndices,
  onToggle,
  onSelectAll,
  onClearAll,
  onClose,
}: Props) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Choose Activities</Text>

        <View style={styles.actions}>
          <Pressable style={styles.smallButton} onPress={onSelectAll}>
            <Text style={styles.smallButtonText}>Select All</Text>
          </Pressable>

          <Pressable style={styles.smallButton} onPress={onClearAll}>
            <Text style={styles.smallButtonText}>Clear</Text>
          </Pressable>
        </View>

        <FlatList
          data={HOURLY_ITEMS}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => {
            const selected = selectedIndices.has(index);

            return (
              <Pressable
                style={[styles.row, selected && styles.selectedRow]}
                onPress={() => onToggle(index)}
              >
                <Text style={styles.check}>{selected ? "✓" : "○"}</Text>

                <Text style={styles.activity}>{item.activity}</Text>
              </Pressable>
            );
          }}
        />

        <Pressable style={styles.doneButton} onPress={onClose}>
          <Text style={styles.doneButtonText}>Done</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#1a1a2e",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 20,
  },

  actions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },

  smallButton: {
    backgroundColor: "#334155",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },

  smallButtonText: {
    color: "#fff",
    fontWeight: "600",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16213e",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },

  selectedRow: {
    borderWidth: 2,
    borderColor: "#f97316",
  },

  check: {
    color: "#f97316",
    fontSize: 22,
    width: 32,
  },

  activity: {
    color: "#fff",
    fontSize: 16,
    flex: 1,
  },

  doneButton: {
    backgroundColor: "#f97316",
    padding: 16,
    borderRadius: 14,
    marginVertical: 20,
    alignItems: "center",
  },

  doneButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
