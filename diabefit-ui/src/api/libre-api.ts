import axios from "axios";
import { getLibreAPI } from "../store/sessionStorage";
import { LIBRE_API_URL } from "../config/data";

export const getLibreData = async () => {

    const token = getLibreAPI();

    const { data } = await axios.get(
    LIBRE_API_URL,
    {
        headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Accept": "*/*",
        "version": "4.7.0",
        "product": "llu.android",
        "authorization": `Bearer ${token}`

        },
    },
    );
    const infromation = data.data[0] ? data.data[0] : null;
    if(!infromation) return infromation;
    return infromation?.glucoseItem?.Value ?? null ;
};
