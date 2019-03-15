import Axios from 'axios';
import { API_PATH } from '../constants';
import Message from '../interfaces/Message';

export const addMessage = (message: Message, userId: string): Promise<{ data: any }> => {
    return Axios({
        baseURL:  API_PATH + '/newMessage',
        method: 'POST',
        data: {
            userId,
            content: message.content,
            position: 'left',
        }
    });
}