import Axios from 'axios';
import { API_PATH } from '../constants';
import Question from '../interfaces/Question';
import { AsyncStorage } from 'react-native';

export const anwserQuestion = async (question: Question): Promise<{ data: any }> => {
    let token = await AsyncStorage.getItem('token');
    if (token) {
        return Axios({
            baseURL: API_PATH + '/answerQuestion',
            method: 'POST',
            headers: { "Authorization": "Bearer " + token },
            data: {
                id: question.id,
                response: question.response,
                question: question.question,
                email: question.email,
                visibleOnWeb: question.visibleOnWeb,
            }
        });
    }
}