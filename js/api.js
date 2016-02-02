var api = {


    url_response: function (data) {

        if (typeof utils.url_response[data[0]] == 'function') {
            utils.url_response[data[0]](data[1]);
            delete utils.url_response[data[0]];
        }

    },

    focus: function () {
        window.focus();
    },


    progress: function (d) {

        if (!d)
            return;


        if (d[1] < 1)
            var msg = locale.translate('startingDownload');
        else
            var msg = locale.translate('downloading');


        ui.loading_wrapper.change_stats(Math.round(d[0]), 0, 0, 0, msg);
    }

}
