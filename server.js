// =============================================================================
// A simple REST Server using express 4
// =============================================================================
importScripts=require('./importscripts.js').importScripts;
importScripts('./apikey.js');

const debug = true;
const port = 8085;

// Packages we need
const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

let app = express();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure to use swagger
const showExplorer = true;
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, showExplorer));

// ROUTES FOR OUR API
// =============================================================================
let router = express.Router();
// /api/
// Test ( GET http://localhost:8085/api/ )
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});
// /api/sendsms
// Sending SMS ( POST http://localhost:8085/api/sendsms )
router.route('/sendsms').post( function(req, res) {
    if(debug) {
        console.log('something is posted to sendSMS');
        console.log(req.body);
    }
    let to = req.body.To;
    let from = req.body.From;
    let body = req.body.Body;

    sendSMS_twilio(to, from, body,
        function(sms_sid) {
            if (debug) {
                console.log('Returned message = ' + sms_sid);
            }
            res.json({ Status: 'OK', To: to, From: from, Body: body, SmsId: sms_sid });
        },
        function(error) {
            if(debug){
                console.log('got error when calling twilio');
                console.log('err => ' + error);
            }
            res.json({ Status: 'ERROR', To: to + '', From: from + '', Body: body + '', Error: error });
        });

});


// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('REST-Service listens on port ' + port);


// =============================================================================
// Call Twilio to send SMS
// =============================================================================
function sendSMS_twilio(twilio_to, twilio_from, twilio_body, callback_OK, callback_ERROR)  {
    if (debug) {
        console.log('Sending data to twilio:');
    }
    let twilio_client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    twilio_client.messages.create({
        body: twilio_body,
        to: twilio_to,
        from: twilio_from
    }).then(
        function(message) {
            if(debug) {
                console.log('OK => ' + message.sid);
            }
            callback_OK(message.sid);
        }
    ).catch(
        function(error) {
            if(debug) {
                console.log('Catch Error => ' + error);
            }
            callback_ERROR(error);
        }
    ).finally(
        function () {
            if(debug) {
                console.log('Twilio call finished');
            }
        }
    );

}