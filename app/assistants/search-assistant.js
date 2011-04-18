var global_searchterm = "";

function SearchAssistant(searchterm) {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
	global_searchterm = searchterm;
}

SearchAssistant.prototype.setup = function() {
	/* this function is for setup tasks that have to happen when the scene is first created */
		
	/* use Mojo.View.render to render view templates and add them to the scene, if needed */
	
	/* setup widgets here */
	this.controller.setupWidget("searchResultList",
		this.storyAttr = {
			itemTemplate: "search/itemTemplate",
			listTemplate: "search/listTemplate",
			swipeToDelete: false,
			renderLimit: 40,
			reorderable: false,
			itemsCallback: this.getSearchResults.bind(this)
		},
		this.listModel = { 
			listTitle: $L('Results'),
			items: [ ]
		}
	);

	/* add event handlers to listen to events from widgets */
	this.viewListingHandler = this.viewListing.bindAsEventListener(this);
	this.controller.listen("searchResultList", Mojo.Event.listTap, this.viewListingHandler);
};

SearchAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

SearchAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

SearchAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};



SearchAssistant.prototype.getSearchResults = function(listWidget, offset, limit) {
	var url = apibase + 'public/listings/active/?api_key=' + apikey + '&limit=20&keywords=' + global_searchterm;
		if(!global_searchterm) {
			throw('No search term entered');
		}
		var request = new Ajax.Request(url, {
			method: 'get',
			onSuccess: function(transport){
				var data = transport.responseText.evalJSON();
				if (data.results != null) {
				var listings = data.results;
				var items = [];
				for (var i = 0; i<listings.length; i++) {
					mylisting = listings[i];
					item = {};
					item.listingTitle = mylisting.title;
					item.listingPrice = mylisting.currency_code + ' ' + mylisting.price;
					item.listing_id = mylisting.listing_id;
					item.description = mylisting.description;
					item.state = mylisting.state
					item.views = mylisting.views
					item.favouriters = mylisting.num_favourers
					items[i] = item;
				}
				listWidget.mojo.noticeUpdatedItems(offset, items);
				}
				this.controller.get("searchDescText").update("Showing " + this.controller.get("searchResultList").mojo.getLength() + " results for " + global_searchterm);
			}.bind(this), 
			onFailure: function(){ 
				Mojo.Log.error('Failed to get response from Etsy API');
				this.controller.get("searchDescText").update("Search failed, please try again later");
			}
		});
}

SearchAssistant.prototype.viewListing = function(event) {
	Mojo.Controller.stageController.pushScene("listingView", event.item);
}

