export const environment = {
    production: false,
    // API Gateway URL - routes to hotel and booking services
    apiGatewayUrl: 'http://localhost:8000',
    hotelServiceUrl: 'http://localhost:8081', // Use gateway for hotel service
    bookingServiceUrl: 'http://localhost:8082' // Use gateway for booking service
};
