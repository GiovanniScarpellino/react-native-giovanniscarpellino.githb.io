import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import firebase from 'react-native-firebase';
import ListUser from './src/pages/ListUser/ListUser';
import Chat from './src/pages/Chat/Chat';

const AppNavigator = createStackNavigator({
    First: { screen: ListUser },
    Chat,
});

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {

    onTokenRefreshListener;
    notificationListener;

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
            this.createNotificationListeners();
        } else {
            try {
                await firebase.messaging().requestPermission();
            } catch (error) { }
        }
    }

    componentWillUnmount() {
        this.onTokenRefreshListener();
        if (this.notificationListener) this.notificationListener();
    }

    // Notification listener
    async createNotificationListeners() {
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            const { title, body } = notification;
            this.buildNotification(title, body);
        });
    }

    buildNotification(title, body) {
        const notification = new firebase.notifications.Notification()
            .setTitle(title)
            .setBody(body)
            .setSound('default');
        notification.android.setChannelId("giovanniscarpellino");
        firebase.notifications().displayNotification(notification);
    }

    render() {
        return <AppContainer />;
    }
}