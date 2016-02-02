app.history={

	list:{},
	tv:{},
	order: [],

	init:function(){

		try{

			var
			history_data 	= localStorage.getItem('history-data'),
			history_tv 		= localStorage.getItem('history-tv'),
			history_order 	= localStorage.getItem('history-order');

			app.history.list = history_data ? JSON.parse(history_data) : {};
			app.history.tv = history_tv ? JSON.parse(history_tv) : {};
			app.history.order = history_order ? JSON.parse(history_order) : [];
		}
		catch(e){console.log(e.message);}

	},
	add: function( data ){


		if(data instanceof Array){
			data.forEach(function(dat){

				if(!dat.id)
					return;

				//clone the obj - maybe there is a better way to do so..
				var item = {};
				for(var i in dat)
					item[i] = dat[i];


				app.history.order.unshift([item.id, (item.info || item.year), item.image]);

				delete item.image;
				delete item.info;
				delete item.subtitles;

				if(item.section=='tv')
					delete item.torrent;

				app.history.list[ item.id ] = item;
			})
		}

		this.save();
	},

	remove:function(){

	},

	tv_episode:function(id){

		if(this.tv[id])
			delete this.tv[id]
		else
			this.tv[id]=1;

		this.save();

	},

	save:function(){

		if(this.order.length>50){
			var
			data	= {},
			order	=[];

			for(var i=0; i<50; i++){
				order.push(this.order[i]);
				data[this.order[i]] = this.list[this.order[i]]
			}

			this.order = order;
			this.list = data;
		}

		try{
			localStorage.setItem('history-data', JSON.stringify(app.history.list));
			localStorage.setItem('history-tv', JSON.stringify(app.history.tv));
			localStorage.setItem('history-order', JSON.stringify(app.history.order));
		}
		catch(e){}
	},





	show:function(cont){

		$('#history_panel .scroller').html('');
		app.history.order.forEach(function(item){

			if(!ui.home.catalog.items[item[0]])
				ui.home.catalog.items[item[0]] = app.history.list[item[0]];

			$('<div class="item" data-id="' + item[0] + '" data-section="' + app.history.list[item[0]].section + '"><div class="image" style="background-image:url(' + item[2] + ')"></div><div class="title">' + app.history.list[item[0]].title + '</div><div class="info">' + item[1] + '</div></div>').appendTo('#history_panel .scroller')
			.click(function(){
				ui[$(this).data('section')].show($(this).data('id'))
			})

		})

		$('#history_panel').show();
		$('#history_panel .scroller').width($('#history_panel .item').length * 140)

		if(app.history.scroller)
			app.history.scroller.refresh();
		else{
			app.history.scroller = new IScroll('#history_cont .incont',{
				mouseWheel: 	true,
				mouseWheelSpeed: 30,
				scrollbars:		true,
				scrollX:		true,
				scrollY:		false,
				click:			true,
				fadeScrollbars:	true,
				interactiveScrollbars:	true,
				resizeScrollbars:		true,
				shrinkScrollbars:		'scale'

			});
		}

	}

}
