import axios from 'axios'

export interface RespType {
    userId: string;
    width: number;
    height: number;
    maxMoves: number;
    target: [number];
}

const URL: string = (process.env.REACT_APP_API_ENDPOINT as string);

export const initResp = async (userId?: string) => {
    try {
        const response = await axios.get<RespType>(`${URL}${userId ? `/user/${userId}` : ''}`);
        return response.data;
    } catch (error) {
        return error;
    }
}