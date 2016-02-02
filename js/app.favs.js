app.favs={

	list:{},
	order: [],

	init:function(){

		try{

			var
			favs_data 	= localStorage.getItem('favs-data'),
			favs_order 	= localStorage.getItem('favs-order');

			app.favs.list = favs_data ? JSON.parse(favs_data) : {};
			app.favs.order = favs_order ? favs_order.split(',') : [];
		}
		catch(e){}

	},
	toggle: function( id ){

		if(!id)
			return;


		if( this.list[id] ){
			delete this.list[id];
			$('#movie-' + id + ' .fav-btn').removeClass('infavs');
			$('#slider_movie.movie_' + id + ' .fav-btn').removeClass('infavs');
		}
		else{
			this.list[id] = ui.home.catalog.items[id];
			this.list[id].infavs = 'infavs';
			this.list[id].section = $('#movie-' + id).data('section');
			this.order.push(id);
			$('#movie-' + id + ' .fav-btn').addClass('infavs');
			$('#slider_movie.movie_' + id + ' .fav-btn').addClass('infavs');
		}

		try{
			localStorage.setItem('favs-data', JSON.stringify(app.favs.list));
			localStorage.setItem('favs-order', app.favs.order.join(','));
		}
		catch(e){}
	},
	show:function(){

		$('#header .activated').removeClass('activated');
		$('#menu_panel .favs').addClass('activated');

		ui.sliders.close_all();
		ui.home.catalog.clear();
		ui.home.catalog.section = 'favs';

		var favs_count = 0;


		this.order.forEach(function(item_id, i){
			if(item_id && app.favs.list[item_id] && !document.getElementById('movie-' + item_id)){

				if(!ui.home.catalog.items[item_id])
					ui.home.catalog.items[item_id] = app.favs.list[item_id];

				ui.home.catalog.appendItem(app.favs.list[item_id], app.favs.list[item_id].section, i);
				favs_count++;
			}

		})


		ui.home.catalog.scroller.refresh();

		if(!favs_count){
			$('#catalog_scroller').html('<div class="noResults">No bookmarks found...</div>')
		}
		else{
/*
			$('#movies_catalog .movie')
			.mousedown(function(e){
					app.favs.mousedownTime=(new Date).getTime();
			})
			.mouseup(function(e){

				if(app.favs.mousedownTime && (new Date).getTime()-app.favs.mousedownTime<300)
					if(e.target.className.indexOf('-btn')>-1)
						$(e.target).click();
					else
						$(this).click();
			});
*/
			$( "#catalog_scroller" ).sortable({ disabled: true, tolerance: "pointer", containment: "parent", scroll: false, update:function(){

				app.favs.order = [];
				$('#movies_catalog .movie').each(function(){
					var id = $(this).data('movie_id');
					if(id)
						app.favs.order.push( id )
				})

			}});
		}

		app.history.show();

	}

}
