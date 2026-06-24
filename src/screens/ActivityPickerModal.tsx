import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { HOURLY_ITEMS } from "../data/hourlyContent";
import { SelectedActivity } from "../types/SelectedActivity";

type Props = {
  visible: boolean;
  activities: SelectedActivity[];

  onAddActivity: (index: number, intervalMinutes: number) => void;

  onRemoveActivity: (index: number) => void;

  onClose: () => void;
};

export default function ActivityPickerModal({
  visible,
  activities,
  onAddActivity,
  onRemoveActivity,
  onClose,
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [intervalText, setIntervalText] = useState("60");

  const isSelected = (index: number) =>
    activities.some((x) => x.index === index);

  const getInterval = (index: number) =>
    activities.find((x) => x.index === index)?.intervalMinutes;

  const handlePressActivity = (index: number) => {
    if (isSelected(index)) {
      onRemoveActivity(index);
      return;
    }

    setSelectedIndex(index);
    setIntervalText("60");
  };

  const handleSaveInterval = () => {
    if (selectedIndex === null) {
      return;
    }

    const interval = Number(intervalText);

    if (Number.isNaN(interval) || interval <= 0) {
      return;
    }

    onAddActivity(selectedIndex, interval);

    setSelectedIndex(null);
  };

  return (
    <>
      <Modal visible={visible} animationType="slide">
        <View style={styles.container}>
          <Text style={styles.title}>Choose Activities</Text>

          <FlatList
            data={HOURLY_ITEMS}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => {
              const selected = isSelected(index);

              return (
                <Pressable
                  style={[styles.row, selected && styles.selectedRow]}
                  onPress={() => handlePressActivity(index)}
                >
                  <Text style={styles.activity}>{item.activity}</Text>

                  {selected && (
                    <Text style={styles.interval}>
                      Every {getInterval(index)} min
                    </Text>
                  )}
                </Pressable>
              );
            }}
          />

          <Pressable style={styles.doneButton} onPress={onClose}>
            <Text style={styles.doneButtonText}>Done</Text>
          </Pressable>
        </View>
      </Modal>

      <Modal visible={selectedIndex !== null} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>Reminder Interval</Text>

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={intervalText}
              onChangeText={setIntervalText}
              placeholder="Minutes"
            />

            <Text style={styles.helpText}>Example: 15, 30, 60</Text>

            <View style={styles.dialogButtons}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setSelectedIndex(null)}
              >
                <Text>Cancel</Text>
              </Pressable>

              <Pressable style={styles.saveButton} onPress={handleSaveInterval}>
                <Text
                  style={{
                    color: "#fff",
                  }}
                >
                  Save
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 20,
  },

  row: {
    backgroundColor: "#16213e",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },

  selectedRow: {
    borderWidth: 2,
    borderColor: "#f97316",
  },

  activity: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  interval: {
    color: "#f97316",
    marginTop: 4,
  },

  doneButton: {
    backgroundColor: "#f97316",
    padding: 16,
    borderRadius: 12,
    marginVertical: 20,
    alignItems: "center",
  },

  doneButtonText: {
    color: "#fff",
    fontWeight: "700",
  },

  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  dialog: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },

  dialogTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
  },

  helpText: {
    marginTop: 8,
    color: "#666",
  },

  dialogButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },

  cancelButton: {
    marginRight: 10,
    padding: 10,
  },

  saveButton: {
    backgroundColor: "#f97316",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
