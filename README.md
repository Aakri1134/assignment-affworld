# My Tasks: Todo App using React Native with expo CLI

## Overview

This app was prepared as an assignment for AffWorld LLC as part of the React Native Development Internship. The app helps you add, edit, and delete todos, keeping your tasks organized. As per the requirements I have used Expo Notifications to send Notification reminders to the users, 5 minutes before the Completion time of the task.

I have also implemented the following bonus features:-

- I have made a Task Edit Screen, which can be accessed using a dedicated button next to each task, or by long pressing the tasks.
- I have used AsyncStorage to locally save the data so that the data persists between sessions.
- I have added a prioritization feature, where the priority of a task can be set, which is accordingly displayed using the UI.
- I have made sure that notifications are properly handled in case of task completions and edits.

## Instructions

To run the app locally, clone the repository using the command,

```bash
git clone https://github.com/Aakri1134/assignment-affworld
```

Run the following commands to install dependencies,

```
npm install
```

Run the following command to run the app using Expo Go,

```
npx expo start
```

Run the following code to run the app on Android or iOS `(necessary for notifications, as Expo Go does not support Notifications)`.

for Android,

```
npx expo run:android
```

for iOS,

```
npx expo run:ios
```

**Remember to add SDK location for Android development build, at `android/local.properties`**

## UX enhancement features

- Dedicated modals for update and delete confirmation.
- Delete present inside the Update page to prevent accidental deletes
- Separate modal for adding inputs, implemented to make the design more simplistic and intuitive.

## Challenges faced

- **Testing :**
 Having upgraded to a newer system, I had to reinstall required SDKs, especially because Expo Go does not support Notifications, meaning I would require a development build for testing.

- **Notifications :**
 It was my first time using Expo notifications, so I had to look up the docs to properly use it in my project.
