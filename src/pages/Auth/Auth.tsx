import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Button, AsyncStorage } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import firebase, { RNFirebase } from 'react-native-firebase';
import { clearNavigationHistory } from '../../helper/navigation';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';

interface IProps extends NavigationInjectedProps {

}

interface IState {
    isSigninInProgress: boolean;
}

export default class PhoneAuth extends Component<IProps, IState> {
    static navigationOptions = { header: null, }

    constructor(props: IProps) {
        super(props);

        this.state = {
            isSigninInProgress: false,
        }
    }

    redirectToListUser = () => {
        this.props.navigation.dispatch(clearNavigationHistory('ListUser'));
    }

    login = async () => {
        this.setState({ isSigninInProgress: true });
        try {
            // add any configuration settings here:
            await GoogleSignin.configure();

            const data = await GoogleSignin.signIn();

            // create a new firebase credential with the token
            const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken)
            // login with credential
            const firebaseUserCredential = await firebase.auth().signInWithCredential(credential);

            await AsyncStorage.setItem('token', await firebaseUserCredential.user.getIdToken());

            this.redirectToListUser();
        } catch (e) {
            alert("Something wrong...");
        }
        this.setState({ isSigninInProgress: false });
    }

    render() {
        return (
            <View style={styles.container}>
                <GoogleSigninButton
                    style={{ width: 250, height: 48 }}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={this.login}
                    disabled={this.state.isSigninInProgress} />
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