/*!
 * jQuery The City Plugin
 *
 * Simple jQuery plugin for pulling public data from your City's Plaza onto any website.
 * Uses The City's JS API to collect data.
 *
 * Developed by: @jeremyjhamel
 */

;(function ( $, window, document, undefined ) {
    var pluginName = "theCity",
        defaults = {
            requestType: "topic",   // event | topic | prayer | need | album
            maxResults: 15, //js api limited to 15 max results
            monthsLong: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            daysLong: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            templateFormat: '<li><a href="{{short_url}}" target="_blank">{{title}}</a></li>',
            noResults: "<li>There are no results.</li>"
        };

    // The actual plugin constructor
    function theCity( element, options ) {
        this.element = element;

        this.options = $.extend( {}, defaults, options);

        this.options.pluralType = this.options.requestType + 's';

        this._defaults = defaults;
        this._name = pluginName;

        if(!this.options.subdomain){
            console.error("You must set a subdomain for this to work");
            return false;
        }

        if(this.options.maxResults > 15)
            this.options.maxResults = 15

        this.init();
    }

    theCity.prototype = {

        init: function() {
            this.getData(this.options);
        },

        getData: function(options) {
            var obj = this;
            $.ajax({
                type: 'GET',
                url: 'http://'+options.subdomain+'.onthecity.org/plaza/'+options.pluralType+'?format=json',
                async: false,
                jsonpCallback: 'jQuery18306948731462471187_1380242275378',
                contentType: "application/json",
                dataType: 'jsonp',
                success: function(results) {
                    if(results.length === 0){
                        console.log("No results");
                        $(obj.element).append(obj.options.noResults);
                        return false;
                    }
                    var data = [];
                    for(var i=0; i<options.maxResults; i++) {
                        data.push(results[i]['global_'+options.requestType]);
                    }
                    obj.format(data);
                },
                error: function(e) {
                   console.log(e.message);
                }
            });
        },

        format: function(data){
            var obj = this;
            $.each(data, function(i, item){
                $(obj.element).append(Mustache.render(obj.options.templateFormat, item));
            });
        }
    };

    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new theCity( this, options ));
            }
        });
    };

})( jQuery, window, document );
