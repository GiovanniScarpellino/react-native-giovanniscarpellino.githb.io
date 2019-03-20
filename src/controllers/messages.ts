import Axios from 'axios';
import { API_PATH } from '../constants';
import Message from '../interfaces/Message';
import { AsyncStorage } from 'react-native';

export const addMessage = async (message: Message, userId: string, lastMessage: string): Promise<{ data: any }> => {
    let token = await AsyncStorage.getItem('token');
    if (token) {
        return Axios({
            baseURL: API_PATH + '/newMessage',
            method: 'POST',
            headers: { "Authorization": "Bearer " + token },
            data: {
                userId,
                content: message.content,
                position: 'left',
                lastMessage,
            }
        });
    }
}