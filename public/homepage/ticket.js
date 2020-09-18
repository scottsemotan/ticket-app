// Api
const tM = "sZZUMhlb4T1r1DrKfhGuaSEqgaO6G9sC";

//Search Button Event Listener
searchConcert = document.getElementById("searchConcert");

searchConcert.addEventListener('click', function () {
    var zipCode = document.getElementById("zipCode").value;
    var concertType = document.getElementById("concertType").value;
    var concertSearch = document.getElementById("concertSearch").value;

    searchTickets(zipCode, concertType, concertSearch);
});

//Submit search values with return key
concertSearch.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("searchConcert").click();
    }

});


//-------------------FUNCTIONS------------------------//

//Visual Spinner while API loads

function loadingSpinner() {

    let spinners =
        `
            <div class="d-flex justify-content-center">
            <div class="spinner-border text-success mt-5" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        `
    eventsRandom.innerHTML += spinners;
}

loadingSpinner()


///Main page automatic render of random events from TM database

//Turn eventRenderMain on to populate database

//eventRenderMain()

async function eventRenderMain() {
    const allData = await axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?classificationName=rock,rap&size=200&stateCode=GA,TX&apikey=${tM}`)
        .then((data) => {
            
            for (var i = 0; i < 20; i++) {
                var eventNumber = Math.floor(Math.random() * 200 + 1);

                //console.log(allEvents.data.data._embedded.events[eventNumber]);
                if (data.data._embedded.events[eventNumber] != undefined) {
                    var name = data.data._embedded.events[eventNumber].name;
                } else {
                    name = "TBD";
                }
                var eventVenue = data.data._embedded.events[eventNumber]._embedded.venues[0].name;
                var eventDate = data.data._embedded.events[eventNumber].dates.start.localDate;
                var eventTime = data.data._embedded.events[eventNumber].dates.start.localTime;
                var city = data.data._embedded.events[eventNumber]._embedded.venues[0].city.name;
                var state = data.data._embedded.events[eventNumber]._embedded.venues[0].state.stateCode;

                if (data.data._embedded.events[eventNumber].priceRanges) {
                    var price = data.data._embedded.events[eventNumber].priceRanges[0].min;

                } else {
                    var price = Math.floor(Math.random() * 200) + 35;
                };
                var price = Math.round(price);
                for (var j = 0; j < data.data._embedded.events[eventNumber].images.length; j++)
                    if (data.data._embedded.events[eventNumber].images[j].ratio == "16_9") {
                        var eventImage = data.data._embedded.events[eventNumber].images[j].url;
                        break
                    };

                var profileId = Math.floor(Math.random() * 6) + 1;
            
                //insert events into events table in database
                axios.post('/api/addevents', {
                    "event_name": name,
                    "event_date": eventDate,
                    "event_venue": eventVenue,
                    "city": city,
                    "state": state,
                    "event_time": eventTime,
                    "event_image": eventImage,
                    "price": price,
                    "seller_id": profileId
                });
            }
        }) 
};

renderRandomEvents()

//function to render random events from our API
async function renderRandomEvents() {
    const eventsData = await axios.get(`/api/addevents`) .then((eventData) => {
        eventsRandom.innerHTML = "";
        for (var i = 0; i < 30; i++) {
                var rando = Math.floor(Math.random() * eventData.data.length + 1);
                var name = eventData.data[rando].event_name;
                var eventDate = eventData.data[rando].event_date;
                var eventVenue = eventData.data[rando].event_venue;
                var city = eventData.data[rando].city;
                var state = eventData.data[rando].state;
                var eventTime = eventData.data[rando].event_time;
                var eventImage = eventData.data[rando].event_image;
                var price = eventData.data[rando].price;
                var eventId = eventData.data[rando].id;
                var sellerId = eventData.data[rando].seller_id;
               
                let eventDetails =
                
                `
            <div class="card mt-3 ml-2 mr-3 col-9 col-sm-5 col-xl-3 border-dark rounded bg-light" style="width: 20rem;">
               <img class="card-img-top mt-2 border-dark rounded" id="eventImage" src="${eventImage}" alt="Event Image">
                <div class="card-body" id="nameBody">
                <h5 class="card-title" id="eventName">${name}</h5>
            </div>
                <ul class="list-group list-group-flush ">
                   <li class="list-group-item bg-light" id="eventDate">${eventDate}</li>
                   <li class="list-group-item bg-light" id="eventVenue">${eventVenue}</li>
                   <li class="list-group-item bg-light" id="eventLocation">${city}, ${state}</li>
                   <li class="list-group-item bg-light" id="eventTime">${eventTime}</li>
                </ul>
            <div class="card-body ">
                <a  href=# id="${sellerId}" class="card-link">BUY</a>
                <a  href=# id="${eventId}" class="card-link">Save Event</a>
            </div>
            </div>
        </div>  
        `
            eventsRandom.innerHTML += eventDetails; 

        }
    });

};
    

// Function to search for events through form on main page and post to events database (kind of)

async function searchTickets(zipcode, concertType, concertSearch) {
    const allSearchData = await axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?keyword=${concertSearch}&postalCode=${zipcode}&radius=30&unit=miles&&size=100&countryCode=US&classificationName=${concertType}&apikey=${tM}`)
    .then((searchData) => {
        eventsRandom.innerHTML = "";    

        for (var i = 0; i < searchData.data._embedded.events.length; i++) {

            var name = searchData.data._embedded.events[i].name;
            var eventVenue = searchData.data._embedded.events[i]._embedded.venues[0].name;
            var eventDate = searchData.data._embedded.events[i].dates.start.localDate;
            var eventTime = searchData.data._embedded.events[i].dates.start.localTime;
            var city = searchData.data._embedded.events[i]._embedded.venues[0].city.name;
            var state = searchData.data._embedded.events[i]._embedded.venues[0].state.stateCode;
            
            if (searchData.data._embedded.events[i].priceRanges) {
                var price = searchData.data._embedded.events[i].priceRanges[0].min;
                    price = Math.round(price);
            } else {
                var price = Math.floor(Math.random() * 200) + 35;
            };

            for (var j = 0; j < searchData.data._embedded.events[i].images.length; j++)
                if (searchData.data._embedded.events[i].images[j].ratio == "16_9") {
                    var eventImage = searchData.data._embedded.events[i].images[j].url;
                    break
                };
            
            var profileId = Math.floor(Math.random() * 6) + 1;

            axios.post('/api/addevents', {
                "event_name": name,
                "event_date": eventDate,
                "event_venue": eventVenue,
                "city": city,
                "state": state,
                "event_time": eventTime,
                "event_image": eventImage,
                "price": price,
                "seller_id": profileId
            });
        }
    })
};



         //   let eventsRender =
           //     `
         //       <div class="card mt-3 ml-2 mr-3 col-9 col-sm-5 col-xl-3 border-dark rounded bg-light" style="width: 20rem;">
           //        <img class="card-img-top mt-2 border-dark rounded" id="eventImage" src="${eventImage}" alt="Event Image">
           //         <div class="card-body" id="nameBody">
            //      <h5 class="card-title" id="eventName">${name}</h5>
           //     </div>
            //        <ul class="list-group list-group-flush ">
            //           <li class="list-group-item bg-light" id="eventDate">${eventDate}</li>
            //           <li class="list-group-item bg-light" id="eventVenue">${eventVenue}</li>
            //           <li class="list-group-item bg-light" id="eventLocation">${city}, ${state}</li>
            //           <li class="list-group-item bg-light" id="eventTime">${eventTime}</li>
             //       </ul>
             //   <div class="card-body ">
            //        <a id="${profileId}" class="card-link">BUY</a>
             //       <a id="${} class="card-link">Save Event</a>
             //   </div>
       // </div>
          //    `
          //  eventsRandom.innerHTML += eventsRender;

       // }
  //  });