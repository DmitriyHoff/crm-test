import axios, { AxiosInstance } from 'axios';

const TOKEN_URL = 'https://app2.gnzs.ru/amocrm/test/oauth/get-token.php';
const X_CLIENT_ID = '31992158';

export class InstanceAxios{
    public static instance: AxiosInstance

    public static async init() {
        try {
            const response = await axios.get(TOKEN_URL, {
                headers: { 'X-Client-Id': X_CLIENT_ID },
            });
    
            if (response.status === 200) {
                const { data } = response;
                InstanceAxios.instance = axios.create({
                    baseURL: `https://${data.base_domain}`,
                    timeout:30_000,
                    headers: {
                        Authorization: `Bearer ${data.access_token}`,
                    }
                })
                console.log('CRM credentials received')
            } else return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}
