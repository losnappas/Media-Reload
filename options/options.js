var reload = document.querySelector("#reloader");

function saveOptions(e){
	e.preventDefault();
	browser.storage.local.set({
		reloadButton: reload.value
	});
}

function restoreOptions(){
	var gettingItem = browser.storage.local.get("reloadButton");
	gettingItem.then((res)=> {
		reload.value = res.reloadButton || 'Control';
	});
}


reload.onkeydown = (e) => {reload.value=e.key;}
document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
