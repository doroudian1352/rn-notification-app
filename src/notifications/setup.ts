import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { step, info, warn } from "../logger";

export function configureNotificationHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
  info("Notification handler configured");
}

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("hourly-happiness", {
      name: "Hourly happiness",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF6B35",
    });
    info("Android notification channel ensured: hourly-happiness");
  }

  step("requestNotificationPermissions: checking existing permissions");
  const { status: existing } = await Notifications.getPermissionsAsync();
  info(`Existing permission status: ${existing}`);
  if (existing === "granted") {
    info("Permissions already granted");
    return true;
  }

  step("requestNotificationPermissions: requesting permissions from user");
  const { status } = await Notifications.requestPermissionsAsync();
  info(`Permission request result: ${status}`);
  return status === "granted";
}
