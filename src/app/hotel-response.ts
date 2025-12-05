import { Address } from "./address";

export interface HotelResponse {
    hotelId: number;
    hotelName: string;
    address: Address;
    phoneNumber: string;
    emailId: string;
}
