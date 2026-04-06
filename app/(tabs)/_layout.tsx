import { tabs } from '@/constants/data';
import { colors, components } from '@/constants/theme';
import { useAuth } from '@clerk/expo';
import { Redirect, Tabs } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const tabBar = components.tabBar;

export default function TabLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const insets = useSafeAreaInsets();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  const TabIcon = ({ focused, icon }: TabIconProps) => {
    return (
      <View style={ts.icon}>
        <View style={[ts.pill, focused && ts.active]}>
          <Image source={icon} style={ts.glyph} />
        </View>
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: Math.max(insets.bottom, tabBar.horizontalInset),
          height: tabBar.height,
          marginHorizontal: tabBar.horizontalInset,
          borderRadius: tabBar.radius,
          backgroundColor: colors.primary,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarItemStyle: {
          paddingVertical: tabBar.height / 2 - tabBar.iconFrame / 1.6,
        },
        tabBarIconStyle: {
          width: tabBar.iconFrame,
          height: tabBar.iconFrame,
          alignItems: 'center',
        },
      }}
    >
      {/* <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="Subscriptions" options={{ title: 'Subscriptions' }} />
      <Tabs.Screen name="Insights" options={{ title: 'Insights' }} />
      <Tabs.Screen name="Settings" options={{ title: 'Settings' }} />

      <Tabs.Screen name="subscriptions/[id]" options={{ href: null }} /> */}
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={tab.icon} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const ts = StyleSheet.create({
  icon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: 'transparent',
  },
  active: { backgroundColor: colors.accent },
  glyph: { width: 24, height: 24 },
});
