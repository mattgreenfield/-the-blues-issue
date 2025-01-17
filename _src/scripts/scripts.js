"use strict";

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
                    "/549605348398438/events?access_token=157237778303044|aYMRmhwnJkbsDYqplTxU4woHs9w",
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
                markup += this.template(gig.id, gig.name, gig.description, gig.place, gig.start_time);
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
                                    <span>${name}</span><span itemprop="name" class="gig__venue">, ${place.name}</span>
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
                <div>
                    <a href="https://www.facebook.com/events/${id}" class="button">More Info</a>
                </div>
            </li>`;
        },

        // Return object
        // convert time to a human readable format
        formatDate: function(date){
            var day = moment(date).format("DD MMM YYYY"),
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
  dots: true,
  arrows: false,
  infinite: true,
  speed: 300,
  slidesToShow: 1,
});

// Lightbox / Gallery
if ( $('.baguette-gallery').length ) {
    baguetteBox.run('.baguette-gallery');
}
