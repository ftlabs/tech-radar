'use strict';

const oTracking = require('o-tracking').init({
	server: 'https://spoor-api.ft.com/px.gif',
	context: {
		product: 'FTLabs Tech Radar'
	}
});

function makeTrackingRequest (details) {

	const trackingReq = details;
	trackingReq.category = 'ftlabs-tech-radar';

	oTracking.event({
		detail: trackingReq
	});
}

module.exports = makeTrackingRequest;
