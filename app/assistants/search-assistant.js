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
};

SearchAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
	this.controller.get("searchDescText").update("Search results for " + global_searchterm);
//	SearchAssistant.prototype.getSearchResults(this.searchterm);	
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
	try { 
		if(!global_searchterm) {
			throw('No search term entered');
		}
		var request = new Ajax.Request(url, {
			method: 'get',
			onSuccess: function(transport){
				var data = transport.responseText.evalJSON();
				var listings = data.results;
				var items = [];
				for (var i = 0; i<listings.length; i++) {
					mylisting = listings[i];
					item = {};
					item.listingTitle = mylisting.title;
					item.listingPrice = mylisting.currency_code + ' ' + mylisting.price;
					items[i] = item;
				}
				listWidget.mojo.noticeUpdatedItems(offset, items);
			},
			onFailure: function(){ 
				Mojo.Log.error('Failed to get response from Etsy API');
			}
		});
	}
	catch(e) {
		Mojo.Log.error(e);
	}
}

//SearchAssistant.prototype.processSearchResults = function(response) {
//	Mojo.Log.error('entered process results');
//	var datajson = response.responseJSON;
//	if(datajson.results.length=0) { 
//		this.controller.get("searchDescText").update("No results for " + global_searchterm);
//		Mojo.Log.error('No search results');
//	}
//	Mojo.Log.error('test is ' + datajson.results[1].listing_id);	
//	var listings = datajson.results;
//	Mojo.Log.error('listings is ' + listings[1].listing_id);
//	var items;
//	try {
//		for(i=0; i<listings.length; i++) {
//			Mojo.Log.error('Listing:' + thislisting.listing_id);
//			thislisting = listings[i];
//			item = {};
//			item.title = thislisting.title;
//			item.description = thislisting.description;
//			item.price = thislisting.price;
//			item.currency = thislisting.currency_code;
//			items[i] = item;
//		}
//	}
//	catch(e) {
//		Mojo.Log.error(e);
//	}
//	searchResultList.mojo.noticeUpdatedItems(0, items);
//}



