import Axios from "axios";
import { API_PATH } from "../constants";
import { AsyncStorage } from "react-native";

export const updateDeviceToken = async (fcmToken: string) => {
    let token = await AsyncStorage.getItem('token');
    if (token) {
        return Axios({
            baseURL: API_PATH + '/updateDeviceToken',
            method: 'POST',
            headers: { "Authorization": "Bearer " + token },
            data: { fcmToken, }
        });
    }
}