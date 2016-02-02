fetcher.scrappers.anime_tv = function(genre, keywords, page, callback){



		if(genre=='all')
			genre = !1;


		var url = 'http://butter.vodo.net/popcorn?cb='+Math.random()+'&sort=' + app.config.fetcher.sortBy + '&page=' + ui.home.catalog.page;

        if (keywords) {
            url += '&keywords=' + keywords;
        }

        if (genre) {
            url += '&genre=' + genre;
        }

        if (page && page.toString().match(/\d+/)) {
           url += '&set=' + page;
        }

	url = 'https://json2jsonp.com/?url='+encodeURIComponent(url)+'';
		$.ajax({
			url: url,
			dataType:'jsonp',
			jsonpCallback: 'cbfunc',
			contentType: "application/json",
			error:function(){callback(false)},
			success:function(data){

				var movies = [],
					memory = {};

				delete data.downloads;
				if (data.error || typeof data.downloads === 'undefined') {
					callback(false)
					return;
				}

				data.downloads.forEach(function (movie){
					// No imdb, no movie.

					if( typeof movie.ImdbCode != 'string' || movie.ImdbCode.replace('tt', '') == '' ){ return;}

			try{

					// Temporary object
					var movieModel = {
						id:       movie.ImdbCode,
						imdb:       movie.ImdbCode,
						title:      movie.MovieTitleClean,
						year:       movie.MovieYear ? movie.MovieYear : '&nbsp;',
						runtime:    movie.Runtime,
						synopsis:   movie.Synopsis,
						imdb_rating: parseFloat(movie.MovieRating),

						poster_small:	movie.CoverImage,
						poster_big:		movie.CoverImage,
						seeders:    movie.TorrentSeeds,
						leechers:   movie.TorrentPeers,
						trailer:	movie.trailer ? 'http://www.youtube.com/embed/' + movie.trailer + '?autoplay=1': false,
						stars:		utils.movie.rateToStars(parseFloat(movie.MovieRating))

					};



					var stored = memory[movie.ImdbCode];

					// Create it on memory map if it doesn't exist.
					if (typeof stored === 'undefined') {
						stored = memory[movie.ImdbCode] = movieModel;
					}

					// Push it if not currently on array.
					if (movies.indexOf(stored) === -1 && !ui.home.catalog.items[movie.ImdbCode.toString()]) {
						movies.push(stored);
					}
			}catch(e){ console.log(e.message);}

				});

				callback(movies)
			}
		});

}
