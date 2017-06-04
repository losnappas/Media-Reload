const ACTIVE_TITLE = "Hold control and seek";
const INACTIVE_TITLE = "Turn on Media Reload";
const ICON_ON = "icons/icon-on.svg";
const ICON_OFF = "icons/icon-off.svg";

var useWay = null;

var reload = null; //the var for addon on/off
function setCurrentChoice(result)
  {
  // //console.log('restoreOptions');
    reload = result.reload || false;

    //only attach the listeners for page changing if the addon is turned on.
	////console.log("outside reload&&holding setCurChoice");
    if(reload){
	////console.log("inside reload&&holding setCurChoice");
      //if page is changing need to inject the content script again
      browser.webNavigation.onBeforeNavigate.addListener(() => {window.injected=false;});
      // inject the at onCompleted or iframes will be missed script and start the listener
      browser.webNavigation.onCompleted.addListener(abortListener);
     }
  }

function onError(error)
  {
    console.error(`Audio Reload Error: ${error}`);
  }

function updateIcon() {
  browser.browserAction.setIcon({
    path: reload ? ICON_ON : ICON_OFF,
  });
  browser.browserAction.setTitle({
    title: reload ? ACTIVE_TITLE : INACTIVE_TITLE,
  });
}
  

function abortListener(){
  if(!window.injected){
	//console.log("injecting from abort");
    inject();
  }

  // window.injected=false;
  // //console.log('abortListener');
  // //console.log(`reload: ${reload}`, reload);
  if (reload){
     //console.log('reloading');
    msg('reload');
  } else {
    // //console.log('cancel');
    msg('cancel');
  }
  if (reload===null) {
    console.error('Media Reload error, reload null: restoreOptions bugged.');
  }
  else{
    this.updateIcon();
  }


  //save preferred setting
  browser.storage.local.set({
      reload: reload
    });
}

function buttonListener(){
  reload = !reload;
	optionsChanged('first', null, null);
 // //console.log(reload);
  abortListener();
}

inject = ()=>{
  // //console.log("injected", window.injected);

	//console.log("useWay:", useWay);
  // if(!window.injected){
	//if the use has opted to use a key+button
	if(useWay === 'holding'){
		//console.log("INSIDE HOLDING");
	    browser.tabs.executeScript(null, { 
	        file: "/content_scripts/reload.js",
	        allFrames: true,
	        runAt: "document_idle"
	      });
	}
	//if the user opted to use context menu item
	else if(useWay === 'context'){
		//console.log("INSIDE CONTEXT");
		browser.tabs.executeScript(null, {
			file: "/content_scripts/reloadContextMenu.js",
			allFrames: true,
			runAt: "document_idle"
		});
	}
	else {
		console.error("reloadListener inject something went wrong");
	}
    window.injected=true;
};

function msg(msg){
  // //console.log('msg');

    var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});

    gettingActiveTab.then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {command: msg});
      });
}

reloadUseWay = (result) => {
	//console.log("RELOADUSEWAY", result.reloadUseWay);
	useWay = result.reloadUseWay || 'context';	
	//get preferences
	var getting = browser.storage.local.get("reload");
	getting.then(setCurrentChoice, onError);

	//if it doesn't exist or already exists then it pops an error message but who cares rly.
	//console.log(reload);
	if(useWay === 'context' && reload)
	{	
		//console.log("inside 'context' in reloadUseWay");
		if(!window.injected)
			inject();
		browser.contextMenus.create({
			id: "reload",
			title: "Reload",
			contexts: ["audio", "video"],
			onclick: () => {
				msg('clickedReload');
			}
		});
	}
	else
	{
		browser.contextMenus.remove("reload");
	}

}



(optionsChanged = (request, sender, sendResponse) => {
	//console.log("optionschanged");
	if(request === 'first' || request.command === 'optionsChanged'){
		var gettingUseWay = browser.storage.local.get("reloadUseWay");
		gettingUseWay.then(reloadUseWay, onError);
	}

})('first', null, null);

if(!browser.runtime.onMessage.hasListener(optionsChanged))
	browser.runtime.onMessage.addListener(optionsChanged);
// turn the addon on/off
browser.browserAction.onClicked.addListener(buttonListener); //worked with button

// if the user turns the addon on and changes tab need to reinject
// -- 2nd thought: not worth my time to implement --
// browser.tabs.onActivated.addListener(()=>{//console.log("hi"); inject();});
