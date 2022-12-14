const express = require('express');
const {auth, resolver, loaders} = require('@iden3/js-iden3-auth')
const getRawBody = require('raw-body')
const cors = require("cors")
const app = express();
const port = 8080;

app.use(cors())


const userDetails = {
	userId: "",
	Authenticated: false 
}


app.get("/" , (req , res)=> {
	res.redirect("http://localhost:3000/qr-scan")
})

app.get("/userDetails" , (req , res)=> {
	res.json(userDetails)
})

app.get("/api/sign-in", (req, res) => {
    console.log('get Auth Request');
    GetAuthRequest(req,res);
});

app.post("/api/callback", (req, res) => {
    console.log('callback');
    Callback(req,res);
});

app.listen(port, () => {
    console.log('server running on port 8080');
});

// Create a map to store the auth requests and their session IDs
const requestMap = new Map();

// GetQR returns auth request
async function GetAuthRequest(req,res) {

	// Audience is verifier id
	const hostUrl = "https://deda-119-152-51-27.in.ngrok.io/";
	const sessionId = 1;
	const callbackURL = "api/callback"
	const audience = "423a11d9d98c13c94286856e739f123dsa80"

	const uri = `${hostUrl}${callbackURL}?sessionId=${sessionId}`;

	// Generate request for basic authentication
	const request = auth.createAuthorizationRequest(
		'Simple Auth',
		audience,
		uri,
	);
	
	request.id = '7f38a193-0918-4a48-9fac-36adfdb8b542';
	request.thid = '7f38a193-0918-4a48-9fac-36adfdb8b542';

	// Store auth request in map associated with session ID
	requestMap.set(`${sessionId}`, request);

	return res.status(200).set('Content-Type', 'application/json').send(request);
}

// Callback verifies the proof after sign-in callbacks
async function Callback(req,res) {

	// Get session ID from request
	const sessionId = req.query.sessionId;

	// get JWZ token params from the post request
	const raw = await getRawBody(req);
	const tokenStr = raw.toString().trim();

	// fetch authRequest from sessionID
	const authRequest = requestMap.get(`${sessionId}`);
		
	// Locate the directory that contains circuit's verification keys
	const verificationKeyloader = new loaders.FSKeyLoader('./keys');
	const sLoader = new loaders.UniversalSchemaLoader('ipfs.io');

	// Add Polygon Mumbai RPC node endpoint - needed to read on-chain state and identity state contract address
	const ethStateResolver = new resolver.EthStateResolver('https://polygon-mumbai.g.alchemy.com/v2/YFPZNAe_Te-glzJsu7nm_rxuZRhXarcN', '0x46Fd04eEa588a3EA7e9F055dd691C688c4148ab3');

	// EXECUTE VERIFICATION
	const verifier = new auth.Verifier(
	verificationKeyloader,
	sLoader, ethStateResolver,
);


try {
	authResponse = await verifier.fullVerify(tokenStr, authRequest);
	console.log(authResponse)
} catch (error) {
return res.status(500).send(error);
}
userDetails.userId = authResponse.from
userDetails.Authenticated = true
return res.status(200).set('Content-Type', 'application/json').send("user with ID: " + authResponse.from + " Succesfully authenticated");
}