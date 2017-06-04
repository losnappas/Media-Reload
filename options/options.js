var reload = document.querySelector("#reloader");

function saveOptions(e){
	var choice = document.querySelector('input[name=choice]:checked');
	e.preventDefault();
	//console.log("FROM OPTIONS: ", choice.value);
	var storingSettings = browser.storage.local.set({
		reloadButton: reload.value
		,
		reloadUseWay: choice.value
	});
	storingSettings.then(() => {
		//console.log("sending message from OPTIONS");
		browser.runtime.sendMessage({command: "optionsChanged"});
	}, (err)=>{console.error(err)});
}

function restoreOptions(){
	var gettingItem = browser.storage.local.get("reloadButton");
	gettingItem.then((res)=> {
		reload.value = res.reloadButton || 'Control';
	});

	
	var gettingChoice = browser.storage.local.get("reloadUseWay");
	gettingChoice.then((res) => {
		if (res.reloadUseWay === 'holding')
			document.getElementById('holding').checked = true;
	});

}


reload.onkeydown = (e) => {reload.value=e.key;}
document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
