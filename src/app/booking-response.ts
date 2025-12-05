import { CustomerResponse } from "./customer-response";

export interface BookingResponse {
    hotelName?: string;
    bookingId?: number;
    checkInDate?: string;
    checkOutDate?: string;
    bookingDate?: string;
    numberOfPersons?: number;
    roomType?: string;
    roomNumber?: number;
    price?: number;
    status?: string;
    customerResponse?: CustomerResponse;
    purposeOfVisit?: string;
    advanceAmount?: number;
    paymentStatus?: string;
}
