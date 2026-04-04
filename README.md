# Recurly

A React Native mobile application built with Expo for subscription management. This app provides a user-friendly interface for handling subscriptions, user authentication, and insights, leveraging the power of Recurly's subscription billing platform.

## Features

- **Onboarding**: Welcome screens to guide new users through the app setup.
- **Authentication**: Secure sign-in and sign-up flows for user management.
- **Subscription Management**: View and manage subscriptions with detailed pages for each subscription.
- **Insights**: Dashboard for viewing key metrics and analytics related to subscriptions.
- **Settings**: User preferences and app configuration options.
- **Cross-Platform**: Runs on iOS, Android, and Web using Expo.

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router for file-based routing
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Language**: TypeScript
- **State Management**: React hooks (built-in)
- **Icons**: Expo Vector Icons and Expo Symbols
- **Animations**: React Native Reanimated
- **Gestures**: React Native Gesture Handler
- **Image Handling**: Expo Image
- **Web Browser Integration**: Expo Web Browser
- **Haptics**: Expo Haptics for tactile feedback

## Installation

1. **Prerequisites**:
   - Node.js (v18 or later)
   - npm or yarn
   - Expo CLI: `npm install -g @expo/cli`
   - For iOS: Xcode (macOS only)
   - For Android: Android Studio

2. **Clone the repository**:

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

```bash
cd recurly
```

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start the development server**:

   ```bash
   npm start
   ```

3. **Run on specific platform**:
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Web: `npm run web`

## Scripts

- `npm start`: Start the Expo development server
- `npm run android`: Start on Android emulator/device
- `npm run ios`: Start on iOS simulator/device
- `npm run web`: Start on web browser
- `npm run lint`: Run ESLint for code linting
- `npm run reset-project`: Reset the project (utility script)

## Dependencies

### Production Dependencies

- `@expo/vector-icons`: Icon library for Expo
- `@react-navigation/bottom-tabs`: Bottom tab navigation
- `@react-navigation/elements`: Navigation UI elements
- `@react-navigation/native`: Core navigation library
- `clsx`: Utility for constructing className strings
- `expo`: Expo SDK
- `expo-constants`: App constants
- `expo-font`: Custom fonts
- `expo-haptics`: Haptic feedback
- `expo-image`: Image component
- `expo-linking`: Deep linking
- `expo-router`: File-based routing
- `expo-splash-screen`: Splash screen
- `expo-status-bar`: Status bar customization
- `expo-symbols`: Symbol icons
- `expo-system-ui`: System UI controls
- `expo-web-browser`: Web browser integration
- `nativewind`: Tailwind CSS for React Native
- `react`: React library
- `react-dom`: React DOM for web
- `react-native`: React Native framework
- `react-native-css`: CSS support for React Native
- `react-native-gesture-handler`: Gesture handling
- `react-native-reanimated`: Animations
- `react-native-safe-area-context`: Safe area handling
- `react-native-screens`: Screen optimization
- `react-native-web`: Web support
- `react-native-worklets`: Worklets for performance

### Development Dependencies

- `@tailwindcss/postcss`: PostCSS plugin for Tailwind
- `@types/react`: TypeScript types for React
- `eslint`: Linting tool
- `eslint-config-expo`: ESLint config for Expo
- `postcss`: CSS processing
- `tailwindcss`: Tailwind CSS
- `typescript`: TypeScript compiler

## Configuration

- **TypeScript**: Configured in `tsconfig.json`
- **Tailwind CSS**: Configured in `tailwind.config.js` and `postcss.config.mjs`
- **Metro**: Bundler configuration in `metro.config.js`
- **ESLint**: Linting rules in `eslint.config.js`
- **Expo**: App configuration in `app.json`

## App Flow

1. **Onboarding**: New users are greeted with onboarding screens
2. **Authentication**: Users sign in or sign up
3. **Main App**: Tab-based navigation with:
   - **Home**: Dashboard overview
   - **Subscriptions**: List of user subscriptions
   - **Insights**: Analytics and metrics
   - **Settings**: User preferences
4. **Subscription Details**: Dynamic pages for individual subscription management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting: `npm run lint`
5. Test on multiple platforms
6. Submit a pull request

## License

[Add your license here]

## Support

For support or questions, please [add contact information or issue tracker link].
