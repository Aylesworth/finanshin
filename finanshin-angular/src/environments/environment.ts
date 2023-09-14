export const environment = {
    apiUrl: 'http://localhost:8080/api/v1',
    auth0: {
        domain: 'dev-m4q170uq7sxa7j5q.us.auth0.com',
        clientId: 'q4apKlAIYUsD7q44hub97QNdcEUEkbFz',
        authorizationParams: {
            redirect_uri: window.location.origin,
            // audience: 'http://localhost:8080/api/v1',
            // scope: ''
        },
    //     httpInterceptor: {
    //         allowedList: [
    //           { 
    //             uri: 'http://localhost:8080/api/v1/*',
    //             tokenOptions: {
    //               authorizationParams: {
    //                 audience: 'http://localhost:8080/api/v1',
    //                 // scope: ''
    //               }
    //             }
    //           }
    //         ]
    //       }
    }
};
