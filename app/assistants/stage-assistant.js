var apikey = '';
var apibase = 'http://openapi.etsy.com/v2/';


function StageAssistant() {
	/* this is the creator function for your stage assistant object */
}

StageAssistant.prototype.setup = function() {
	this.controller.pushScene("main");
};
