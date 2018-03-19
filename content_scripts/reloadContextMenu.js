// media reload reloadContextMenu.js


function reload(request, sender, sendResponse){
	
	let type = request.mediaType;
	if (type === 'image') {
		type = 'img';
	}
	var media = document.querySelectorAll(type);
	//loop through
	for (let element of media){
		// if the info of the source, given by the contextMenu item click matches
		// media.length check because of YOUTUBE videos not giving off a srcUrl on context menu click.
		if(element.currentSrc == request.url || media.length === 1){ 
			//then reload the media element
			let src = element.currentSrc;
			element.src='';
			element.src=src;
		}
	}

	//remove the listener, because next time there will be a new injection of this script. We don't want to leave things hanging.
	browser.runtime.onMessage.removeListener(reload);
}
//this would all be much simpler if context menu items also gave the element clicked on.


// okay so like youtube and probably other sites, the src that comes with the context menu item click is WORTHLESS. literally ''.
// One day contextmenu click gives off the element it's been clicked on, too.. the dream.
/*
Assign reload() as a listener for messages from the extension.
*/
if (!browser.runtime.onMessage.hasListener(reload))
	browser.runtime.onMessage.addListener(reload);


