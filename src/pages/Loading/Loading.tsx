import React, { Component } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, AsyncStorage } from 'react-native';
import { NavigationInjectedProps, NavigationActions, StackActions } from 'react-navigation';
import firebase from 'react-native-firebase';
import { clearNavigationHistory } from '../../helper/navigation';

interface IProps extends NavigationInjectedProps {

}

export default class Loading extends Component<IProps, any> {
    static navigationOptions = { header: null, }

    async componentDidMount() {
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
            await AsyncStorage.setItem('token', await currentUser.getIdToken());
            this.props.navigation.dispatch(clearNavigationHistory('ListUser'));
        } else {
            this.props.navigation.dispatch(clearNavigationHistory('Auth'));
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Loading</Text>
                <ActivityIndicator size="large" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})