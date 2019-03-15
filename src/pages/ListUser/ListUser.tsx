import React from 'react';
import { ScrollView, View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import User from '../../interfaces/User';
import firebase from 'react-native-firebase';
import { NavigationInjectedProps } from 'react-navigation';
import Message from '../../interfaces/Message';

interface IProps extends NavigationInjectedProps {

}

interface IState {
    users: User[];
}

export default class ListUser extends React.Component<IProps, IState> {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props);

        this.state = {
            users: [],
        }
    }

    gotToChat(user: User) {
        this.props.navigation.navigate('Chat', { user });
    }

    componentWillMount() {
        firebase.database().ref('/users').on('value', async (snapshot) => {
            let data = snapshot.val();
            if (data) {
                let users: User[] = [];
                await Object.keys(data).forEach(key => {
                    users.push({
                        id: key,
                        messages: data[key].messages,
                    });
                });
            }
        });
    }

    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.user}>Messages</Text>
                    <FlatList
                        style={styles.container}
                        data={this.state.users}
                        renderItem={(item) => {
                            const messages = item.item.messages;
                            const lastMessage: Message = messages[Object.keys(messages)[0]];
                            let itemStyle = styles.item;
                            if (lastMessage.position === 'left') itemStyle = { ...itemStyle, ...styles.newMessage};
                            return (
                                <TouchableOpacity onPress={() => this.gotToChat(item.item)} style={itemStyle}>
                                    <Text>LAST MESSAGE: {lastMessage && lastMessage.content}</Text>
                                </TouchableOpacity>
                            )
                        }}
                    />
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    user: {
        flex: 1,
        fontSize: 25,
        marginBottom: 15,
        alignContent: 'center',
        justifyContent: 'center',
    },
    item: {
        flex: 1,
        height: 100,
        justifyContent: 'center',
        backgroundColor: "#E7E7E7",
        padding: 15,
        marginBottom: 15,
    },
    newMessage: {
        backgroundColor: "#08ad10",
    }
});
