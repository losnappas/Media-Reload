var media = document.querySelector('video') || document.querySelector('audio');
var key;


// variables to enable holding control infinitely
//otherwise it keeps refreshing as long as you hold ctrl
var wait = false;
var waitToTimeout = false;
var interval;

//bind the listener so it can be removed when button is pressed again...
//--i sure hope there's a better solution than this out there . . .
if (!this.controlDownListenerVar) 
	this.controlDownListenerVar = this.controlDown/*.bind(this)*/;
if (!this.keyUpListenerVar)
	this.keyUpListenerVar = this.keyUpListener;
if (!this.reloadVar)
	this.reloadVar = this.reload;


function reload(request, sender, sendResponse){
	if (request.command==='reload'){
		// console.log('reload');

		document.addEventListener('keydown', this.controlDownListenerVar  /*controlDown*/);
		document.addEventListener('keyup', this.keyUpListenerVar);
	}
	else if (request.command==='cancel')
	{
		document.removeEventListener('keydown', this.controlDownListenerVar);
		document.removeEventListener('keyup', this.keyUpListenerVar);
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
	wait=true;
}

function controlDown(e){
	// console.log('controlDown');
	if (e.key===key/*'Control' || e.key==='Command'*/){
		// if (media===null){
		//  media = document.querySelector('video') || document.querySelector('audio'); // how to catch multiple/embed/not-playing players?
		// }

		if (!wait){
			media.addEventListener('seeking', seeking);
		}

		//so user can hold control and reload once a second
		if (media.readyState===3 || media.readyState===4) { // have some future content loaded (3) OR if it's small/near end have everything loaded (4)
			if (!waitToTimeout) //is it okay to set another timeout? essentially this is a manually made interval
				interval = setTimeout(()=>{wait=false; waitToTimeout=false;/* console.log("go")*/}, 1000);
			waitToTimeout=true;
		}
	}
}



/*
Assign reload() as a listener for messages from the extension.
*/
if (!browser.runtime.onMessage.hasListener(this.reloadVar)){
	// console.log('test');
	browser.runtime.onMessage.addListener(this.reloadVar);
}


//get the button-to-hold preference
var getting = browser.storage.local.get("reloadButton");
getting.then((result)=>{key=result.reloadButton;} /*, no error catch? a la moz tutorials. */);
