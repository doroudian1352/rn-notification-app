import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import HomeScreen from "./src/screens/HomeScreen";
import ActivityPickerModal from "./src/screens/ActivityPickerModal";

import { SelectedActivity } from "./src/types/SelectedActivity";
import {
  scheduleActivityNotifications,
  cancelActivityNotifications,
} from "./src/notifications/scheduler";
import { info } from "./src/logger";
import {
  configureNotificationHandler,
  requestNotificationPermissions,
} from "./src/notifications/setup";

export default function App() {
  useEffect(() => {
    void (async () => {
      configureNotificationHandler();

      const granted = await requestNotificationPermissions();

      console.log("Notification permission:", granted);
    })();
  }, []);

  const [showPicker, setShowPicker] = useState(false);

  const [activities, setActivities] = useState<SelectedActivity[]>([]);

  const addActivity = async (index: number, intervalMinutes: number) => {
    info("Adding activity");
    const ids = await scheduleActivityNotifications(index, intervalMinutes);

    setActivities((prev) => [
      ...prev.filter((x) => x.index !== index),
      {
        index,
        intervalMinutes,
        notificationIds: ids,
      },
    ]);
  };

  const removeActivity = async (index: number) => {
    const activity = activities.find((x) => x.index === index);

    if (activity) {
      await cancelActivityNotifications(activity.notificationIds);
    }

    setActivities((prev) => prev.filter((x) => x.index !== index));
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <HomeScreen
        enabled={false}
        selectedCount={activities.length}
        statusMessage=""
        onChooseActivities={() => setShowPicker(true)}
        onToggleNotifications={() => {}}
      />

      <ActivityPickerModal
        visible={showPicker}
        activities={activities}
        onAddActivity={addActivity}
        onRemoveActivity={removeActivity}
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
