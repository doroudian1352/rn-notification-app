# Hourly Happiness (Expo)

A simple React Native app that sends **local notifications every hour** with an energetic slogan and a happy activity suggestion.

## Features

- 24 rotating slogan + activity pairs
- Hourly local notifications via `expo-notifications`
- In-app list of all messages
- Enable / disable reminders from the home screen

## Run the app

```bash
cd C:\Users\Lenovo\Projects\rn-notification-app
npm start
```

Then scan the QR code with **Expo Go** on your phone, or press `a` for Android emulator.

> **Note:** Local scheduled notifications work best on a **physical device**. Emulators may delay or skip alarms.

## How it works

1. Tap **Enable hourly notifications** and allow permission.
2. The app schedules the next **24 one-hour notifications**, each with the next slogan/activity from the list.
3. When you reopen the app, the schedule refreshes so reminders keep rolling.

## Project structure

- `src/data/hourlyContent.ts` — slogans and activities
- `src/notifications/setup.ts` — permissions and Android channel
- `src/notifications/scheduler.ts` — hourly scheduling logic
- `App.tsx` — UI
