curPhotoIndex = 1;
positionDelta = {
	left: -1,
	center: 0,
	right: 1
};
imagesarray = [];

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
	this.leftHandler = this.leftHandler.bind(this);
	this.rightHandler = this.rightHandler.bind(this);	

	this.controller.setupWidget('listingImage', 
		this.attributes = {
			noExtractFS: true
		}, 
		this.viewerModel = { 
			onLeftFunction: this.leftHandler,
			onRightFunction: this.rightHandler
		}
	);
	
	/* add event handlers to listen to events from widgets */
};

ListingViewAssistant.prototype.leftHandler = function() {
		this.movePhotoIndex('left');
		this.controller.get("listingImage").mojo.leftUrlProvided(this.getUrlForThe('left'));
}

ListingViewAssistant.prototype.rightHandler = function() {
		this.movePhotoIndex('right');
		this.controller.get("listingImage").mojo.rightUrlProvided(this.getUrlForThe('right'));
}


ListingViewAssistant.prototype.movePhotoIndex = function (direction) {
           	curPhotoIndex = curPhotoIndex + positionDelta[direction];
                
                if(curPhotoIndex > imagesarray.length-1 || curPhotoIndex < 1) {        
                        curPhotoIndex = this.wrapAroundMarioStyle( curPhotoIndex, imagesarray.length );
                }
};
                
ListingViewAssistant.prototype.getUrlForThe = function( position ){
                var urlIndex;
                urlIndex = curPhotoIndex + positionDelta[position];
                
                if(urlIndex > imagesarray.length-1 || urlIndex < 0) {    
                        urlIndex = this.wrapAroundMarioStyle( urlIndex, imagesarray.length ); 
                }
                        
                return imagesarray[urlIndex];
        };
ListingViewAssistant.prototype.wrapAroundMarioStyle = function( index, max ){
                return Math.abs( Math.abs( index ) - max );
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
	var url = apibase + 'public/listings/' +listingid + '/images?api_key=' + apikey;
	var request = new Ajax.Request(url, {
		method: 'get',
		onSuccess: function(transport){
			var data = transport.responseText.evalJSON();
			if (data.results != null) {
				for (var i = 0; i<data.results.length; i++) {
					imagesarray[i] = data.results[i].url_570xN;
				}
			}
			this.controller.get("listingImage").mojo.centerUrlProvided(this.getUrlForThe('center'));
			this.controller.get("listingImage").mojo.leftUrlProvided(this.getUrlForThe('left'));
			this.controller.get("listingImage").mojo.rightUrlProvided(this.getUrlForThe('right'));
		}.bind(this),
		onFailure: function(){ 
			Mojo.Log.error('Failed to get response from Etsy API');
		}
	});
};

