'use strict';

window.loader = {
	overlay: null,
	styles: null,
	loader: null,
	modules: null,
	load: function(file){
		return new Promise(function(resolve, reject){
			this.startLoader('Getting Dependency Graph...');
			var req = new XMLHttpRequest();
			req.open('GET', file, true);
			req.onload = function(resolve, reject, e){
				var req = e.target;
				this.modules = JSON.parse(req.responseText);
				new Promise(this.recursiveLoad.bind(this)).then(function(){
					this.cleanup();
					resolve();
				}.bind(this, resolve));
			}.bind(this, resolve, reject);
			req.send();
		}.bind(this));
	},
	startLoader: function(message){
		this.styles = document.createElement('style');
		this.styles.innerHTML = "@import url(https://fonts.googleapis.com/css?family=Open+Sans);html{font-family:\"Open Sans\",sans-serif}@keyframes bounce{0%,100%{bottom:0}50%{bottom:40px}}#overlay{background-color:#1e1e24;position:fixed;width:100%;height:100%;left:0;top:0;z-index:100}#loader{z-index:101;color:#2978a0;text-align:center;position:fixed;left:50%;top:50%;transform:translate(-50%,-50%)}.ball{animation:bounce 1s infinite linear;position:relative;display:inline-block;margin:5px;background-color:#2978a0;border-radius:50%;width:30px;height:30px}.ball:nth-child(1){animation-delay:0}.ball:nth-child(2){animation-delay:.2s}.ball:nth-child(3){animation-delay:.4s}";
		document.body.appendChild(this.styles);
		this.overlay = document.createElement('div');
		this.overlay.id = "overlay";
		document.body.appendChild(this.overlay);
		this.loader = document.createElement('div');
		this.loader.id = "loader";
		this.loader.innerHTML = '<span class="ball"></span><span class="ball"></span><span class="ball"></span>';
		this.message = document.createElement('p');
		this.message.innerHTML = message;
		this.loader.appendChild(this.message);
		document.body.appendChild(this.loader);
	},
	updateMessage: function(message){
		this.message.innerHTML = message;
	},
	recursiveLoad: function(resolve, reject){
		var loaded = true;
		for (var handle in this.modules){
			var module = this.modules[handle];
			if(!module.loaded){
				loaded = false;
				break;
			}
		}
		if(loaded){
			resolve();
		} else {
			var handleToLoad = "";
			var modToLoad = false;
			for (var handle in this.modules){
				var module = this.modules[handle];
				if(module.dependencies.length == 0 && !this.modules[handle].loaded){
					modToLoad = module;
					handleToLoad = handle;
					break;
				}
			}
			if(modToLoad){
				this.loadModule(modToLoad).then(function(resolve, reject, module, loadedHandle){
					module.loaded = true;
					for(var handle in this.modules){
						var curMod = this.modules[handle];
						var index = -1;
						if( (index = curMod.dependencies.indexOf(loadedHandle)) != -1){
							curMod.dependencies.splice(curMod.dependencies.indexOf(loadedHandle), 1);
						}
					}
					new Promise(this.recursiveLoad.bind(this)).then(function(resolve){
						resolve();
					}.bind(this, resolve));
				}.bind(this, resolve, reject, modToLoad, handleToLoad));
			} else {
				var er = new Error('Loader: Recursive dependencies.');
				console.log(er);
				reject(er);
			}
		}
	},
	loadModule: function(module){
		return new Promise(function(module, resolve, reject){
			if(module.dependencies.length > 0){
				reject("Module still has unloaded dependencies");
			} else {
				this.updateMessage(module.loadingMessage);
				var script = document.createElement('script');
				document.body.appendChild(script);
				script.onload = function(){
					resolve();
				}.bind(this, resolve);
				script.src = module.src;
			}
		}.bind(this, module));
	},
	cleanup: function(){
		this.overlay.parentElement.removeChild(this.overlay);
		this.styles.parentElement.removeChild(this.styles);
		this.loader.parentElement.removeChild(this.loader);
	},
};
