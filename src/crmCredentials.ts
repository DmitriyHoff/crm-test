import axios from 'axios';

const TOKEN_URL = 'https://app2.gnzs.ru/amocrm/test/oauth/get-token.php';
const X_CLIENT_ID = '31992158';

export interface CrmCredentials {
    access_token: string;
    base_domain: string;
}

export async function getCrmCredentials(): Promise<CrmCredentials | null> {
    try {
        const response = await axios.get(TOKEN_URL, {
            headers: { 'X-Client-Id': X_CLIENT_ID },
        });

        if (response.status === 200) {
            return response.data;
        } else return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}
