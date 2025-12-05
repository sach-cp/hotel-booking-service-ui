export interface BookingRequest {
    roomId: number;
    numberOfPersons: number;   

    customerDto: {
        firstName: string;
        lastName: string;
        addressDto: {
            addressDetails: string;
            city: string;
            state: string;
            country: string;
            pinCode: string;
        }
        phoneNumber: string;
    };

    checkInDate: string;   // must be string for Spring Boot
    checkOutDate: string;

    purposeOfVisit: string;
    totalAmount: number;
    advanceAmount: number;
    paymentMode: string;
    paymentStatus: string;
}
