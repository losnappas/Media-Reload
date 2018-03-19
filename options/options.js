
function saveOptions(e){
	var choice = document.querySelector('input[name=choice]:checked');
	var targets = document.querySelectorAll('input[name=target]:checked');
	var contexts = [];
	targets.forEach(val => contexts.push(val.value));
	e.preventDefault();
	//console.log("FROM OPTIONS: ", choice.value);
	var storingSettings = browser.storage.local.set({
		reloadUseWay: choice.value,
		contexts: contexts
	});
	storingSettings.then(() => {
		//console.log("sending message from OPTIONS");
		browser.runtime.sendMessage({command: "optionsChanged"});
	}, (err)=>{console.error(err)});
}

function restoreOptions(){
		
	var gettingChoice = browser.storage.local.get("reloadUseWay");
	gettingChoice.then((res) => {
		if (res.reloadUseWay === 'click')
			document.getElementById('click').checked = true;
	});

}


document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
