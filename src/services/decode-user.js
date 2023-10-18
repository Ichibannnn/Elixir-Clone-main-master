import CryptoJS from "crypto-js";
import { saltKey } from "../saltkey";

export const decodeUser = () => {
    let userDatadecrypted;
    if (sessionStorage.getItem('userToken')) {
        const userData = sessionStorage.getItem('userToken');
        const deciphertext = CryptoJS.AES.decrypt(userData, saltKey)
        userDatadecrypted = JSON.parse(deciphertext.toString(CryptoJS.enc.Utf8))
    }

    console.log(userDatadecrypted)

    return userDatadecrypted
}
