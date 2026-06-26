import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import HomeScreen from "./src/screens/HomeScreen";
import ActivityPickerModal from "./src/screens/ActivityPickerModal";

import { HOURLY_ITEMS } from "./src/data/hourlyContent";
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

  useEffect(() => {
    console.log("activities changed", activities);
  }, [activities]);

  const selectedDisplay = activities.map((a) => {
    const item = HOURLY_ITEMS[a.index];
    return {
      index: a.index,
      slogan: item.slogan,
      activity: item.activity,
      intervalMinutes: a.intervalMinutes,
    };
  });

  const addActivity = async (index: number, intervalMinutes: number) => {
    try {
      info("Adding activity New");

      const ids = await scheduleActivityNotifications(index, intervalMinutes);

      info(`scheduleActivityNotifications returned ${ids.length}`);

      setActivities((prev) => [
        ...prev.filter((x) => x.index !== index),
        {
          index,
          intervalMinutes,
          notificationIds: ids,
        },
      ]);

      info("setActivities called");
    } catch (error) {
      console.error("addActivity failed", error);
    }
  };

  const removeActivity = async (index: number) => {
    info("Removing activity", { index });

    let notificationIds: string[] | undefined;

    setActivities((prev) => {
      const activity = prev.find((x) => x.index === index);
      notificationIds = activity?.notificationIds;
      return prev.filter((x) => x.index !== index);
    });

    if (notificationIds?.length) {
      await cancelActivityNotifications(notificationIds);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <HomeScreen
        enabled={false}
        selected={selectedDisplay}
        statusMessage=""
        onChooseActivities={() => setShowPicker(true)}
        onToggleNotifications={() => {}}
        onRemoveActivity={removeActivity}
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
