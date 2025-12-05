import { AddressRequest } from "./address-request";

export interface AddHotelRequest {
    hotelName: string;
    addressDto: AddressRequest;
    phoneNumber?: string;
    emailId: string;
}
