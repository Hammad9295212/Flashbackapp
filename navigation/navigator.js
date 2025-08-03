import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PhotoContinue from '../screens/PhotoContinue';
import Login from '../screens/Login';
import Camera from '../screens/Camera';
import Create from '../screens/Create';
import Settings from '../screens/Settings';
import SnapView from "../screens/SnapView";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainStackNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Tab"
                    component={TabNavi}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="photo"
                    component={PhotoContinue}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="SnapView"
                    component={SnapView}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const TabNavi = () => {
    return (
        <Tab.Navigator
            initialRouteName="Create"
            screenOptions={({ route }) => ({
                tabBarStyle: {
                    backgroundColor: '#292A24',
                    height: 60,
                    paddingBottom: 10,
                },
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: 'grey',
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Create') {
                        iconName = focused ? 'create' : 'create-outline';
                    } else if (route.name === 'Camera') {
                        iconName = focused ? 'camera' : 'camera-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarLabel: ({ focused, color }) => {
                    let label;
                    if (route.name === 'Create') {
                        label = 'Create';
                    } else if (route.name === 'Camera') {
                        label = 'Camera';
                    } else if (route.name === 'Settings') {
                        label = 'Settings';
                    }
                    return <Text style={{ color }}>{label}</Text>;
                },
                headerShown: false,
            })}
        >
            <Tab.Screen name="Create" component={Create} />
            <Tab.Screen name="Camera" component={Camera} />
            <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
    );
};

export default MainStackNavigator;
