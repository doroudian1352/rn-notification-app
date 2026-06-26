import * as Notifications from "expo-notifications";
import { HOURLY_ITEMS, type HourlyItem } from "../data/hourlyContent";
import { step, info, warn } from "../logger";

const HOURS_AHEAD = 24;
const MS_PER_HOUR = 60 * 60 * 1000;
const TEST_MODE = true;
function resolveItems(selectedIndices?: number[]): HourlyItem[] {
  if (!selectedIndices || selectedIndices.length === 0) {
    return HOURLY_ITEMS;
  }
  return selectedIndices.map((index) => HOURLY_ITEMS[index]);
}

function itemForHour(items: HourlyItem[], offset: number, startIndex: number) {
  const index = (startIndex + offset) % items.length;
  return items[index];
}

/** Schedule the next 24 hourly local notifications with rotating slogans and activities. */
export async function scheduleHourlyNotifications(
  selectedIndices?: number[],
  startIndex = Math.floor(Date.now() / MS_PER_HOUR) %
    (selectedIndices?.length || HOURLY_ITEMS.length),
): Promise<number> {
  const items = resolveItems(selectedIndices);
  if (items.length === 0) {
    return 0;
  }

  step("scheduleHourlyNotifications: start", {
    startIndex,
    itemsCount: items.length,
  });
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    info("Cleared existing scheduled notifications");
  } catch (e) {
    warn("Failed to clear scheduled notifications prior to scheduling", e);
  }

  const now = Date.now();
  let scheduled = 0;

  for (let i = 0; i < HOURS_AHEAD; i++) {
    const item = itemForHour(items, i, startIndex);
    const triggerDate = new Date(now + (i + 1) * MS_PER_HOUR);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: item.slogan,
        body: `Happy activity: ${item.activity}`,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
        channelId: "hourly-happiness",
      },
    });
    scheduled += 1;
    info("Scheduled notification", {
      when: triggerDate.toISOString(),
      slogan: item.slogan,
    });
  }

  info(`scheduleHourlyNotifications: finished — scheduled ${scheduled}`);
  return scheduled;
}

export async function scheduleHomeArrivalNotification(): Promise<void> {
  step("scheduleHomeArrivalNotification: start");
  const triggerDate = new Date(Date.now() + 60 * 1000);

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: " Congradulation",
        body: "You are Here To Get Your Hourly Happiness!",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
        channelId: "hourly-happiness",
      },
    });
    info("Scheduled Home arrival notification", {
      when: triggerDate.toISOString(),
    });
  } catch (e) {
    warn("Failed to schedule Home arrival notification", e);
  }
}

export async function cancelHourlyNotifications(): Promise<void> {
  step("cancelHourlyNotifications: start");
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    info("All scheduled notifications cancelled");
  } catch (e) {
    warn("Failed to cancel scheduled notifications", e);
  }
}

export async function getScheduledCount(): Promise<number> {
  const pending = await Notifications.getAllScheduledNotificationsAsync();
  info(`getScheduledCount -> ${pending.length}`);
  return pending.length;
}

export async function scheduleActivityNotifications(
  index: number,
  intervalMinutes: number,
): Promise<string[]> {
  const item = HOURLY_ITEMS[index];

  const ids: string[] = [];
  console.log("====================================");
  console.log("Start Register Notification");
  console.log("====================================");
  const now = Date.now();
  const maxMinutes = TEST_MODE || intervalMinutes < 5 ? 5 : 24 * 60;

  for (
    let minutes = intervalMinutes;
    minutes <= maxMinutes;
    minutes += intervalMinutes
  ) {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: item.slogan,
        body: item.activity,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: new Date(now + minutes * 60 * 1000),
        channelId: "hourly-happiness",
      },
    });
    info("Scheduled activity notification Id: " + id);
    ids.push(id);
  }

  return ids;
}

export async function cancelActivityNotifications(notificationIds: string[]) {
  info("Remove NotificationIds: " + notificationIds);
  for (const id of notificationIds) {
    await Notifications.cancelScheduledNotificationAsync(id);
  }
}
