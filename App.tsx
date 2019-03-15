import React from 'react';
import { StyleSheet, View, ScrollView, FlatList, Text, TouchableOpacity } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import firebase from 'react-native-firebase';
import { RemoteMessage } from 'react-native-firebase/messaging';
import User from './src/interfaces/User';
import ListUser from './src/pages/ListUser/ListUser';
import Chat from './src/pages/Chat/Chat';

const AppNavigator = createStackNavigator({
    First: { screen: ListUser },
    Chat,
});

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {

    onTokenRefreshListener;
    messageListener;

    async componentWillMount() {
        const fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            await firebase.database().ref('/token').set(fcmToken);
        }

        this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(async (fcmToken) => {
            await firebase.database().ref('/token').set(fcmToken);
        });

        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.messageListener = firebase.messaging().onMessage((message: RemoteMessage) => {
                let notification = new firebase.notifications.Notification()
                    .setNotificationId('notificationId')
                    .setTitle('My notification title')
                    .setBody('My notification body')
                    .setData({
                        key1: 'value1',
                        key2: 'value2',
                    });
                notification.android.setChannelId("giovanniscarpellino");
                firebase.notifications().displayNotification(notification);
            });
        } else {
            try {
                await firebase.messaging().requestPermission();
            } catch (error) { }
        }
    }

    componentWillUnmount() {
        this.onTokenRefreshListener();
        if (this.messageListener) this.messageListener();
    }

    render() {
        return <AppContainer />;
    }
}