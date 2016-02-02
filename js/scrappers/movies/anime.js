fetcher.scrappers.anime_movies = function(genre, keywords, page, callback, fallback){

		if(genre=='all')
			genre = !1;
		var domain =  'http://butter.vodo.net/popcorn';
		if(fallback) {
			domain = 'http://butter.vodo.net/popcorn';
		}

		var url = domain+'?sort=' + app.config.fetcher.sortBy + '&cb='+Math.random()+'&quality=720p,1080p,3d&page=' + ui.home.catalog.page;


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
			timeout:9000,
			error:function(){
				if(!fallback) {
					fetcher.scrappers.anime_movies(genre, keywords, page, callback, true);
				} else {
					callback(false)
				}
			},
			success:function(data){

				var movies = [],
					memory = {};

				delete data.downloads;
				if (data.error || typeof data.downloads === 'undefined') {
					if(!fallback) {
						fetcher.scrappers.anime_movies(genre, keywords, page, callback, true);
					} else {
						callback(false)
					}
					return;
				}

				data.downloads.forEach(function(movie){
					if( typeof movie.ImdbCode != 'string' || movie.ImdbCode.replace('tt', '') == '' ){ return;}

					try{

							var movieModel = {
								id:       	movie.ImdbCode,
								imdb:       movie.ImdbCode,
								title:      movie.MovieTitleClean,
								year:       movie.MovieYear ? movie.MovieYear : '&nbsp;',
								runtime:    movie.Runtime,
								synopsis:   movie.Synopsis,
								voteAverage:parseFloat(movie.MovieRating),

								poster_small:	movie.CoverImage,
								poster_big:   	movie.CoverImage,

								quality:    movie.Quality,
								torrent:    movie.TorrentUrl,
								magnet :    movie.TorrentUrl,
								torrents:   [],
								videos:     {},
								seeders:    movie.TorrentSeeds,
								leechers:   movie.TorrentPeers,
								trailer:	movie.trailer ? 'http://www.youtube.com/embed/' + movie.trailer + '?autoplay=1': false,
								stars:		utils.movie.rateToStars(parseFloat(movie.MovieRating)),

								hasMetadata:false,
								hasSubtitle:false
							};



							var stored = memory[movie.ImdbCode];

							// Create it on memory map if it doesn't exist.
							if (typeof stored === 'undefined') {
								stored = memory[movie.ImdbCode] = movieModel;
							}

							if (stored.quality !== movieModel.quality && movieModel.quality === '720p') {
								stored.torrent = movieModel.torrent;
								stored.quality = '720p';
							}

							// Set it's correspondent quality torrent URL.
							stored.torrents[movie.Quality] = movie.TorrentUrl;

							// Push it if not currently on array.
							if (movies.indexOf(stored) === -1 && !ui.home.catalog.items[movie.ImdbCode.toString()]) {
								movies.push(stored);
							}
					}catch(e){}

				});

				if(keywords && !movies.length){
					console.log(movies.length)
					fetcher.scrappers.yts(genre, encodeURIComponent($('#search_input').val()), page, callback);
				}
				else{
					callback(movies)
				}
			}
		});

}
