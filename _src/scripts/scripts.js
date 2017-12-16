"use strict";

// import * as foo from './moment.min.js';

//
// Gigs
// Get gigs from facebook JS api
// Required the moment.js library
function gigs(options) {
    const defaults = {
        element: document.getElementById('gigs-list'),
        limit: 10
    }
    
    // check the element for a data-limit attr
    if (defaults.element.dataset.limit) {
        defaults.limit = defaults.element.dataset.limit;
    }
    return gigs = {

        // merge the given options with the defaults
        options: Object.assign({}, defaults, options),

        init: function() {
            this.fetch();
        },

        // Get the events from facebook, render the output
        fetch: function(){
            var self = this;

            if(FB){
                // get facebook events (gigs)
                FB.api(
                    "/549605348398438/events?access_token=666554986807078|MBmEzYNqIvN0xRm5xW5VKAQMl2U",
                    {
                        time_filter: "upcoming"
                    },
                    function (response) {
                    //   console.log(response);
                      if (response && !response.error) {
                        self.render(response.data, self.options.element);
                      }
                    }
                );
            }
        },

        // Loop through the events, build the markup and put it on the page
        render: function(_data, _element){
            var self = this,
                markup = "",
                limit = Math.min(self.options.limit, _data.length);
                
                // reverse and limit the gigs list to show the upcoming gigs first
                _data = _data.reverse().slice(0, limit);

            for(let gig of _data){
                // console.log(gig);
                markup += this.template(gig.id, gig.name.toLowerCase(), gig.description, gig.place, gig.start_time);
            }

            _element.innerHTML = markup;
        },

        // return string
        // Markup for each gig
        template: function(id, name, description, place, date){
            var self = this,
                formatedDate = self.formatDate(date),
                placeMarkup = name;

            if (place) {
                placeMarkup = `<div>
                                    <div>${name}</div>
                                    <div itemprop="name" class="gig__venue">${place.name}</div>
                                </div>
                                <div itemprop="address" itemscope itemtype="http://schema.org/PostalAddress" class="gig__town">
                                    <span itemprop="addressLocality">${place.location.city}</span>
                                </div>`
            }

            return `<li itemscope itemtype="http://schema.org/Event" class="gig">
                <div itemprop="startDate" content="2013-09-14T21:30" class="gig__date">
                    <span>${formatedDate.time}</span>
                    <span>${formatedDate.day}</span>
                </div>
                <div itemprop="location" itemscope itemtype="http://schema.org/Place" class="gig__location">
                    ${placeMarkup}
                </div>
            </li>`;
        },

        // Return object
        // convert time to a human readable format
        formatDate: function(date){
            var day = moment(date).format("ddd Do MMM YYYY"),
                time = moment(date).format("ha");
            return {day, time};
        }

    }

};



// home page
$('#image-gallery').slick({
  arrows: true,
  infinite: true,
  speed: 300,
  slidesToShow: 4,
  variableWidth: true
});


// home page
$('#quote-slider').slick({
  arrows: true,
  infinite: true,
  speed: 300,
  slidesToShow: 1,
});

// Lightbox / Gallery
if ( $('.baguette-gallery').length ) {
    baguetteBox.run('.baguette-gallery');
}
