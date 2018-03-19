//this is injected every time the browser action is clicked so it's important not to leave anything hanging.
var reload = (e) => {
	let tag = e.target.tagName.toLowerCase() ;
	e.preventDefault();
	if (['audio','image','video'].indexOf(tag) !== -1) {
		e.stopPropagation();
	}
	browser.storage.local.get('contexts').then(({contexts}) => {
		let imgidx = contexts.indexOf('image');
		if (imgidx !== -1) {
			contexts[imgidx]="img";
		}
		if (contexts==null) {
			contexts=["audio","img","video"];
		}
		if (contexts.indexOf(tag) !== -1)//tag === 'video' || tag === 'audio') 
		{
			// reset the clicked video tag
			//console.log("resetting via click!");
			let src = e.target.currentSrc;
			e.target.src='';
			e.target.src=src;
		}

		//then remove the listener again.
		document.removeEventListener('click', reload);

		//send a message to repaint the ui
		browser.runtime.sendMessage({message: 'reloadClicked'});
	}).catch(e => console.error("Media-Reload 'reloadClick':", e));
}

document.addEventListener('click', reload);
