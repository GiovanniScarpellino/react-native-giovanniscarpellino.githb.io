import Axios from "axios";
import { API_PATH } from "../constants";

export const updateDeviceToken = (fcmToken: string) => {
    return Axios({
        baseURL: API_PATH + '/updateDeviceToken',
        method: 'POST',
        data: { fcmToken, }
    });
}