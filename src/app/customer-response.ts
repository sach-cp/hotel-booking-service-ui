import { AddressResponse } from "./address-response";

export interface CustomerResponse {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    addressResponse?: AddressResponse;
}
