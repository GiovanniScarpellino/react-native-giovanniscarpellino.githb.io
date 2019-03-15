import React from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import Message from '../../interfaces/Message';
import { NavigationInjectedProps } from 'react-navigation';
import firebase from 'react-native-firebase';
import User from '../../interfaces/User';
import { addMessage } from '../../controllers/messages';

interface IProps extends NavigationInjectedProps {

}

interface IState {
    messages: IMessage[];
    user: User;
}

export default class Chat extends React.Component<IProps, IState>{

    constructor(props: IProps) {
        super(props);

        let user: User = props.navigation.getParam('user');

        this.state = {
            messages: [],
            user,
        }

        firebase.database().ref('/users/' + user.id + '/messages').on('child_added', async (snapshot) => {
            let data: Message = snapshot.val();
            if (data) {
                await this.setState({
                    messages: [{
                        _id: snapshot.key,
                        text: data.content,
                        createdAt: new Date(data.createdAt),
                        user: {
                            _id: data.position === 'right' ? 0 : 1,
                            avatar: 'https://i.kym-cdn.com/entries/icons/square/000/014/959/Screenshot_116.png',
                        }
                    }, ...this.state.messages]
                });
            }
        });
    }

    onSend = async (messages: IMessage[] = []) => {
        alert("MOUERTE");
        let newMessage = messages[0];
        const { user } = this.state;
        await addMessage({ content: newMessage.text }, user.id);
    }

    render() {
        return (
            <GiftedChat
                messages={this.state.messages}
                onSend={messages => this.onSend(messages)}
                user={{ _id: 1, }}
            />
        )
    }
}