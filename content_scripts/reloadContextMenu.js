var media=null; //= document.querySelector('video') || document.querySelector('audio');



function reload(request, sender, sendResponse){
	//console.log("reload noif");
	if (request.command==='clickedReload'){
		 console.log('reloadFROMCONTEXTMENU');
		// document.addEventListener('contextmenu', contexted);

		let src = media.currentSrc;
		media.src='';
		media.src=src;
	}
	else if (request.command==='cancel')
	{
		//document.removeEventListener('contextmenu', contexted);
		document.removeEventListener('contextMenu', elementTrack);
	}
	else if (request.command==='reload'){} //let's do nothing here...
	else
	{
		console.error('Media Reload bug. unknown command:', request.command);
	}
	// console.log('start',media.buffered.start(0));
	// console.log('end',media.buffered.end(0));
}

elementTrack = (e) => {
	console.log("tracked");
	let tag = e.target.tagName.toLowerCase() ;
	if(tag === 'video' || tag === 'audio') 
	{
		//set the currently right clicked media element
		media = e.target;
	}
}

document.addEventListener('contextmenu', elementTrack);

/*
Assign reload() as a listener for messages from the extension.
*/
if (!browser.runtime.onMessage.hasListener(reload))
	browser.runtime.onMessage.addListener(reload);


