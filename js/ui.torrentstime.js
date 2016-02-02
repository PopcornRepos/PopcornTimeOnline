ui.torrentsTime = {

	isVisible: false,
	isInstallingHide : false,
	show:function(){
		ui.torrentsTime.isVisible = true;
		$('.torrentsTime, #ttbar').addClass('visible');
		ui.loading_wrapper.hide(1);
	},

	hide:function(){
		ui.torrentsTime.isVisible = false;
		$('.torrentsTime, #ttbar').removeClass('visible');
		torrentsTime.init({id:"pt", source:null});
		Mousetrap.unpause();
	},
	downloadHandler : function() {
		var arrowimg = (new Image);
		switch(torrentsTime.setup.browser) {
			case 'firefox':
				arrowimg.src='css/images/arrow.png';
				document.body.appendChild(arrowimg);
				arrowimg.setAttribute('style', 'position:fixed;right:130px;top:10px;z-index:99999;animation:fadeInOut 1s linear infinite');
				arrowimg.setAttribute('id','_tt_arrowimg');
				break;
			case 'chrome':
				arrowimg.src='css/images/arrow.png';
				document.body.appendChild(arrowimg);
				arrowimg.setAttribute('style', 'position:fixed;left:40px;bottom:10px;transform:rotate(180deg);z-index:99999;animation:fadeInOut 1s linear infinite');
				arrowimg.setAttribute('id','_tt_arrowimg');
				break;
			case 'trident':
				arrowimg.src='css/images/arrow.png';
				document.body.appendChild(arrowimg);
				arrowimg.setAttribute('style', 'position:fixed;right:50%;bottom:90px;z-index:99999;transform:rotate(180deg);animation:fadeInOut 1s linear infinite');
				arrowimg.setAttribute('id','_tt_arrowimg');
				break;
			default:
				break;
		}

	},
	checkPluginSupportFF : function() {
		setTimeout(function(){
			if(torrentsTime.pt.setup.poster && !torrentsTime.pt.wrapper.firstChild.style.background){
				torrentsTime.pt.wrapper.firstChild.style.background='#000 url('+torrentsTime.pt.setup.poster[0]+') no-repeat center center';
				torrentsTime.pt.wrapper.firstChild.style.backgroundSize='cover';
			}

			setTimeout(function(){
				if(window.top==window.self && torrentsTime.setup.browser=='firefox' && torrentsTime.setup.isInstalled && torrentsTime.pt.plugin && !torrentsTime.pt.plugin.isInitialized){
					var arrowimg = (new Image);
					arrowimg.src='css/images/arrow.png';
					document.body.appendChild(arrowimg);
					arrowimg.setAttribute('style', 'position:fixed;right:40px;top:10px;z-index:99999;animation:fadeInOut 1s linear infinite');
					arrowimg.setAttribute('id','_tt_arrowimg_ff_unblock');

					torrentsTime.functions.initialized = function(){
						var arrowimg = document.getElementById('_tt_arrowimg_ff_unblock');
						arrowimg.parentNode.removeChild(arrowimg);
					}
				}
			},1000)

		},1300)
	},
	installHandler : function() {
		$('#_tt_arrowimg').remove();
		$('#downloadTorrentsTime').hide();
		if(!$('#loading_wrapper').hasClass('activated'))
			ui.loading_wrapper.show(1);
		var percent = 0;
		var interval = setInterval(function() {
			if(ui.torrentsTime.isInstallingHide){
				clearInterval(interval);
				return;
			}
			ui.loading_wrapper.change_stats(percent,0,0,0, "Installing... Please wait.");
			percent = percent + (Math.floor(Math.random() * 3) + 1  );
		},3000);
	},
	hideInstallingWrapper : function() {
		//ui.loading_wrapper.hide(1);
		ui.torrentsTime.checkPluginSupportFF();
	}
}
