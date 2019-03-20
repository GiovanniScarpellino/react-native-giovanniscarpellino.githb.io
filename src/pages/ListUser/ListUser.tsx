import React from 'react';
import { ScrollView, View, StyleSheet, Text, AsyncStorage, Platform } from 'react-native';
import User from '../../interfaces/User';
import firebase from 'react-native-firebase';
import { NavigationInjectedProps } from 'react-navigation';
import Message from '../../interfaces/Message';
import { ListItem, Button, Header, Icon, Image, Badge, Avatar } from 'react-native-elements';
import { clearNavigationHistory } from '../../helper/navigation';

interface IProps extends NavigationInjectedProps {

}

interface IState {
    users: User[];
}

export default class ListUser extends React.Component<IProps, IState> {
    static navigationOptions = { header: null };

    constructor(props) {
        super(props);

        this.state = {
            users: [],
        }
    }

    goToListQuestion = () => {
        this.props.navigation
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
                        email: data[key].email,
                        active: data[key].active,
                        messages: data[key].messages,
                    });
                });
                this.setState({ users });
            }
        });
    }

    render() {
        return (
            <View>
                <Header
                    containerStyle={{ height: Platform.OS === 'ios' ? 70 : 70 - 24 }}
                    leftComponent={
                        <Button
                            type="clear"
                            icon={{
                                name: "close",
                                iconStyle: { color: "#FFF" },
                                containerStyle: { marginBottom: 25 }
                            }}
                            onPress={async () => {
                                await AsyncStorage.setItem('token', "");
                                await firebase.auth().signOut();
                                this.props.navigation.dispatch(clearNavigationHistory('Auth'));
                            }}
                        />
                    }
                    centerComponent={{ text: 'MESSAGES', style: { color: "#FFF", marginBottom: 24 } }}
                    rightComponent={
                        <Button
                            type="clear"
                            icon={{
                                name: "question-answer",
                                iconStyle: { color: "#FFF" },
                                containerStyle: { marginBottom: 25 }
                            }}
                            onPress={() => this.props.navigation.navigate('ListQuestion')}
                        />
                    }
                />
                <ScrollView>
                    <View style={styles.container}>
                        {this.state.users.length > 0 ? this.state.users.map((user, index) => {
                            const messages = user.messages;
                            if (messages) {
                                const lastMessage: Message = messages[Object.keys(messages)[0]];
                                let itemStyle = styles.item;
                                if (lastMessage.position === 'left') itemStyle = { ...itemStyle, ...styles.newMessage };
                                return (
                                    <ListItem
                                        key={index}
                                        title={<Text numberOfLines={1} style={{ fontWeight: 'bold', }}>{lastMessage.content}</Text>}
                                        subtitle={user.email ? <Text style={{ fontSize: 10 }}>{user.email}</Text> : null}
                                        leftAvatar={(
                                            <View>
                                                <Avatar
                                                    rounded
                                                    source={{
                                                        uri: 'https://source.unsplash.com/random/100x100',
                                                    }}
                                                    size="medium"
                                                />

                                                <Badge
                                                    status={user.active ? "success" : "error"}
                                                    value=" "
                                                    containerStyle={{ position: 'absolute', top: 0, right: 0 }}
                                                />
                                            </View>
                                        )}
                                        badge={{ value: Object.keys(messages).length }}
                                        onPress={() => this.gotToChat(user)}
                                        chevron
                                    />
                                )
                            }
                            return <></>;
                        }) : (
                                <Image source={{ uri: "https://source.unsplash.com/random/200x200" }} style={{ height: 200, width: 200, marginTop: 100, marginLeft: 80 }} />
                            )}
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        padding: 0,
    },
    container: {
        flex: 1,
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
        overflow: 'hidden',
    },
    newMessage: {
        backgroundColor: "#08ad10",
    },
    connected: {
        alignContent: "flex-end",
    }
});
