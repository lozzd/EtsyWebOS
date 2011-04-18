function ListingViewAssistant(tappeditem) {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
	gListingdata = tappeditem;
}

ListingViewAssistant.prototype.setup = function() {
	/* this function is for setup tasks that have to happen when the scene is first created */
	this.controller.get("listingName").update(gListingdata.listingTitle);
	this.controller.get("listingDesc").update(gListingdata.description);
	this.getImageURLs(gListingdata.listing_id);
	/* use Mojo.View.render to render view templates and add them to the scene, if needed */
	
	/* setup widgets here */
	
	/* add event handlers to listen to events from widgets */
};

ListingViewAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

ListingViewAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

ListingViewAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};

ListingViewAssistant.prototype.getImageURLs = function(listingid) {
// TODO: Let's make this a ImageViewer! Those sound fun. 
	var url = apibase + 'public/listings/' +listingid + '/images?api_key=' + apikey;
	var request = new Ajax.Request(url, {
		method: 'get',
		onSuccess: function(transport){
			var data = transport.responseText.evalJSON();
			if (data.results != null) {
				this.listingimageurl = data.results[0].url_170x135;
				this.imagesrc = '<img src="' + this.listingimageurl + '">';
			}
			this.controller.get("listingImage").update(this.imagesrc);
		}.bind(this),
		onFailure: function(){ 
			Mojo.Log.error('Failed to get response from Etsy API');
		}
	});
};

