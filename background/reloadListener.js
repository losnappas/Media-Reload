const ACTIVE_TITLE = "Hold control and seek";
const INACTIVE_TITLE = "Turn on Media Reload";
const ICON_ON = "icons/icon-on.svg";
const ICON_OFF = "icons/icon-off.svg";


var reload = null;
// function restoreOptions(){
  // setCurrentChoice = result => 
function setCurrentChoice(result)
  {
  // console.log('restoreOptions');
    // browser.storage.local.set({reload: result});
    reload = result.reload || false;
    // reload = result.reload === null ? result.reload :;
    console.log(result, 'res');
    console.log(reload, 'reload..');
   // abortListener();
    // console.log('result', result);
  }

function onError(error)
  // onError = (error) => 
  {
    console.log(`Error: ${error}`);
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
  console.log('abortListener');
  console.log(`reload: ${reload}`, reload);
  if (reload){
    console.log('reloading');
    msg('reload');
  } else {
    console.log('cancel');
    msg('cancel');
  }
  if (reload===null) {
    console.error('reload null: restoreOptions bugged.');
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
  abortListener();
}

function msg(msg){
  console.log('msg');
    browser.tabs.executeScript(null, { 
        file: "/content_scripts/reload.js" 
      });
    var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});

    gettingActiveTab.then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {command: msg});
      });
}

// console.log('1');
//get preferences
// setTimeout( () => {
// function getOptions(){ 
//   console.log('getting opts..');
  var getting = browser.storage.local.get("reload");
  getting.then(setCurrentChoice, onError);
// }
// console.log('2');

browser.tabs.onUpdated.addListener(abortListener);

browser.browserAction.onClicked.addListener(buttonListener); //worked with button
// }, 100);

  /*(command) => {
  console.log("onCommand event received for message: ", command);
});*/
//browser.webNavigation.onDOMContentLoaded./*.browserAction.onClicked.*/addListener(beastListener);

// browser.webNavigation.onDOMContentLoaded.addListener(videol)

// NEW START END --------------------------------------------------------------------------------------------------------------------

// console.log(document.HTMLMediaElement.volume);

