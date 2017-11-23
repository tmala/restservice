# restservice
A simple rest-service for different usage.
Start the service with
````
 > node server.js
````

## /api/
returns a string indicating that the server is up and running
## /api/sendsms
Sends an SMS using Twilio SMS Service
## /api-docs
Swagger Documentation and testing tools
The file swagger.json is edited manually

### Prerequisities
a file named apikey.js must be present, and must contain the following two constants
````
const TWILIO_ACCOUNT_SID = <Your Account sid at Twilio>
const TWILIO_AUTH_TOKEN = <Your Auth token at Twilio>
````


