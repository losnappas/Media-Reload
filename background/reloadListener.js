const ACTIVE_TITLE = "Hold control and seek";
const INACTIVE_TITLE = "Turn on Media Reload";
const ICON_ON = "icons/icon-on.svg";
const ICON_OFF = "icons/icon-off.svg";


var reload = null;
function setCurrentChoice(result)
  {
  // console.log('restoreOptions');
    reload = result.reload || false;
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
  
// }

function abortListener(){
  window.injected=false;
  // console.log('abortListener');
  // console.log(`reload: ${reload}`, reload);
  if (reload){
    // console.log('reloading');
    msg('reload');
  } else {
    // console.log('cancel');
    msg('cancel');
  }
  if (reload===null) {
    console.error('Audio Reload error, reload null: restoreOptions bugged.');
  }
  else{
    this.updateIcon();
    // reload = !reload;
  }


  //save preferred setting
  browser.storage.local.set({
      reload: reload
    });
}

function buttonListener(){
  reload = !reload;
  // console.log(reload);
  injector();
  abortListener();
}

injector = ()=>{
  // console.log("injected", window.injected);
  if(!window.injected){
    browser.tabs.executeScript(null, { 
        file: "/content_scripts/reload.js" 
      });
    window.injected=true; 
  }
};

function msg(msg){
  // console.log('msg');



    var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});

    gettingActiveTab.then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {command: msg});
      });
}



//get preferences
var getting = browser.storage.local.get("reload");
getting.then(setCurrentChoice, onError);

browser.tabs.onUpdated.addListener(abortListener);

browser.browserAction.onClicked.addListener(buttonListener); //worked with button

browser.webNavigation.onCommitted.addListener(injector);
