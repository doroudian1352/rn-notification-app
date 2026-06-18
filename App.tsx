import { useCallback, useEffect, useMemo, useState } from "react";
import { AppState, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import HomeScreen from "./src/screens/HomeScreen";
import ActivityPickerModal from "./src/screens/ActivityPickerModal";

import { HOURLY_ITEMS } from "./src/data/hourlyContent";

import {
  configureNotificationHandler,
  requestNotificationPermissions,
} from "./src/notifications/setup";

import {
  cancelHourlyNotifications,
  getScheduledCount,
  scheduleHourlyNotifications,
  scheduleHomeArrivalNotification,
} from "./src/notifications/scheduler";

import { info, step, warn } from "./src/logger";

export default function App() {
  const [showPicker, setShowPicker] = useState(false);

  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(
    new Set(),
  );

  const [enabled, setEnabled] = useState(false);

  const [scheduledCount, setScheduledCount] = useState(0);

  const [statusMessage, setStatusMessage] = useState("");

  const selectedArray = useMemo(
    () => [...selectedIndices].sort((a, b) => a - b),
    [selectedIndices],
  );

  const refreshScheduledCount = useCallback(async () => {
    const count = await getScheduledCount();
    setScheduledCount(count);
  }, []);

  const enableHourlyNotifications = useCallback(async () => {
    step("enableHourlyNotifications: start");

    if (selectedIndices.size === 0) {
      setStatusMessage(
        "Select at least one activity before enabling notifications.",
      );
      return;
    }

    configureNotificationHandler();

    const granted = await requestNotificationPermissions();

    if (!granted) {
      warn("Notification permission denied");

      setEnabled(false);

      setStatusMessage("Notification permission is required.");

      return;
    }

    const count = await scheduleHourlyNotifications(selectedArray);

    setEnabled(true);

    setScheduledCount(count);

    setStatusMessage("Hourly happiness reminders are active.");

    info(`Scheduled ${count} reminders`);
  }, [selectedArray, selectedIndices.size]);

  const disableHourlyNotifications = useCallback(async () => {
    step("disableHourlyNotifications");

    await cancelHourlyNotifications();

    setEnabled(false);

    setScheduledCount(0);

    setStatusMessage("Notifications turned off.");
  }, []);

  const toggleActivity = useCallback((index: number) => {
    setSelectedIndices((prev) => {
      const next = new Set(prev);

      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }

      return next;
    });
  }, []);

  const selectAllActivities = useCallback(() => {
    setSelectedIndices(new Set(HOURLY_ITEMS.map((_, index) => index)));
  }, []);

  const clearAllActivities = useCallback(() => {
    setSelectedIndices(new Set());
  }, []);

  useEffect(() => {
    step("App mounted");

    configureNotificationHandler();

    void (async () => {
      const count = await getScheduledCount();

      setScheduledCount(count);

      if (count > 0) {
        setEnabled(true);

        setStatusMessage("Hourly happiness reminders are active.");
      }
    })();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active" && enabled && selectedIndices.size > 0) {
        info("App active: refreshing reminders");

        void scheduleHourlyNotifications(selectedArray).then(
          refreshScheduledCount,
        );
      }
    });

    return () => subscription.remove();
  }, [enabled, selectedIndices.size, selectedArray, refreshScheduledCount]);

  useEffect(() => {
    void (async () => {
      const granted = await requestNotificationPermissions();

      if (!granted) {
        return;
      }

      await scheduleHomeArrivalNotification();
    })();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <HomeScreen
        enabled={enabled}
        selectedCount={selectedIndices.size}
        statusMessage={statusMessage}
        onChooseActivities={() => setShowPicker(true)}
        onToggleNotifications={() =>
          enabled ? disableHourlyNotifications() : enableHourlyNotifications()
        }
      />

      <ActivityPickerModal
        visible={showPicker}
        selectedIndices={selectedIndices}
        onToggle={toggleActivity}
        onSelectAll={selectAllActivities}
        onClearAll={clearAllActivities}
        onClose={() => setShowPicker(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
