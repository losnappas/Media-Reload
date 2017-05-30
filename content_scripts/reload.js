var media = document.querySelector('video') || document.querySelector('audio');
var key;


// variables to enable holding control infinitely
//otherwise it keeps refreshing as long as you hold ctrl
var wait = false;
var waitToTimeout = false;
var interval;




function reload(request, sender, sendResponse){
	if (request.command==='reload'){
		// console.log('reload');

		document.addEventListener('keydown', controlDown);
		document.addEventListener('keyup', keyUpListener);
	}
	else if (request.command==='cancel')
	{
		document.removeEventListener('keydown', controlDown);
		document.removeEventListener('keyup', keyUpListener);
		// console.log('cancel');
	}
	else
	{
		console.error('Media Reload bug. unknown command:', request.command);
	}
	// console.log('start',media.buffered.start(0));
	// console.log('end',media.buffered.end(0));
} 

function keyUpListener (event)  {
	// console.log('keyuptest');
			if (event.key==='Control' || event.key==='command') {
				// console.log('keyupped');
				media.removeEventListener('seeking', seeking);
				wait = false;
				waitToTimeout = false;
				// console.log('waitToTimeout', waitToTimeout);
				clearTimeout(interval); //does this do anything .? //bugs?
			}
		};

function seeking(e){
	media.removeEventListener('seeking', seeking);
	var src = media.currentSrc;
	media.src = '';
	media.src = src;
	// console.log('seeking')	;
	// wait=true;
}



function controlDown(e){
	// console.log('controlDown');
	if (e.key===key/*'Control' || e.key==='Command'*/){

		document.onclick = (event) => {
			// console.log("onclick");
			if(event.target.tagName.toLowerCase()==='video' || event.target.tagName.toLowerCase()==='audio'){
				media = event.target;
				// console.log("inside onclick if");
			}
		}


		if (!wait){
			wait=true;
			// media.seeking = seeking('1');
			// console.log("seeking inside wait");
			media.addEventListener('seeking', seeking);
		}

		//so user can hold control and reload once a second
		if (media.readyState===3 || media.readyState===4) { // have some future content loaded (3) OR if it's small/near end have everything loaded (4)
			if (!waitToTimeout) //is it okay to set another timeout? essentially this is a manually made interval
				interval = setTimeout(()=>{
						wait=false;
						waitToTimeout=false;
						// console.log("go");
					}, 2000);
			waitToTimeout=true;
		}
	}
}



/*
Assign reload() as a listener for messages from the extension.
*/
if (!browser.runtime.onMessage.hasListener(reload))
	browser.runtime.onMessage.addListener(reload);


//get the button-to-hold preference
var getting = browser.storage.local.get("reloadButton");
getting.then((result)=>{key=result.reloadButton;} /*, no error catch? a la moz tutorials. */);
