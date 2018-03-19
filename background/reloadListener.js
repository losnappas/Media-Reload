const ACTIVE_TITLE = "Now click on a media element to reload it";
const INACTIVE_TITLE = "Activate Reload for current tab";
const ICON_ON = "icons/icon-on.svg";
const ICON_OFF = "icons/icon-off.svg";

var useWay = null;
var reload=false;

function onError(error)
  {
    console.error(`Audio Reload Error: ${error}`);
  }

function updateIcon() {
  browser.browserAction.setIcon({
    path: reload ? ICON_ON : ICON_OFF,
  });
  browser.browserAction.setTitle({
    title: useWay!=='click' ? 'Open Media Reload options page' : reload ? ACTIVE_TITLE : INACTIVE_TITLE,
  });
}

//click method does this
function inject  (){
	if (useWay === 'click'){
		reload = !reload;
		updateIcon();
		browser.tabs.executeScript({
			file: "/content_scripts/reloadClick.js",
			allFrames: true
		});
	}
	else {
		browser.runtime.openOptionsPage();
		//console.error("reloadListener inject something went wrong");
	}
}

// contextMenu method does this
function doThings(info, tab){
	// console.log("hi?", info, tab)
	// it doesn't matter how many times the script is injected into the page. The script doesn't leave anything behind after executing.
  	browser.tabs.executeScript({
		file: "/content_scripts/reloadContextMenu.js",
		frameId: info.frameId
	})
	.then( () => browser.tabs.sendMessage(tab.id, {url: info.srcUrl, mediaType: info.mediaType}) )
	.catch( (err)=> console.error("reloadListener error:", err)	);	
	
}


function reloadUseWay (result)  {
	// console.log("RELOADUSEWAY", result.reloadUseWay);
	useWay = result.reloadUseWay || 'context';	

	//if it doesn't exist or already exists then it pops an error message but who cares rly.
	//console.log(reload);
	if(useWay === 'context')
	{	
		let contexts = result.contexts || ["audio", "video", "image"];
		browser.contextMenus.remove("reload").then(() => {
			browser.contextMenus.create({
				id: "reload",
				title: "Reload",
				contexts: contexts,
				onclick: doThings
			});
		}).catch(e => console.log("Media reload: 'reloadUseWay' error.",e));
		reload=true;
	}
	else
	{
		reload = false;
		//trying to remove a non-existing context menu item is ok
		browser.contextMenus.remove("reload");
	}

	updateIcon();
}

function afterReloadRepaint  (request) {
	if(request.message && request.message === 'reloadClicked'){
		reload = !reload;
		updateIcon();
	}
}


function optionsChanged (request, sender, sendResponse)  {
	// console.log("optionschanged");
	if(request === 'first' || (request.command != null && request.command === 'optionsChanged')){
		var gettingUseWay = browser.storage.local.get();
		gettingUseWay.then(reloadUseWay, onError);
	}

}

optionsChanged('first', null, null);

if(!browser.runtime.onMessage.hasListener(optionsChanged))
	browser.runtime.onMessage.addListener(optionsChanged);


//listener for browser action reloadClick method -message
if(!browser.runtime.onMessage.hasListener(afterReloadRepaint))
	browser.runtime.onMessage.addListener(afterReloadRepaint);


browser.browserAction.onClicked.addListener(inject); //worked with button

