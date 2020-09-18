$(document).ready(function () {
    console.log("ready!");

    tM = "sZZUMhlb4T1r1DrKfhGuaSEqgaO6G9sC";

    //Post tickets to sell - Button

    var postTickets = document.getElementById("postTickets");

    postTickets.addEventListener('click', function () {
        var eventName = document.getElementById("eventName").value;
        var eventDate = document.getElementById("eventDate").value;
        var eventVenue = document.getElementById("eventVenue").value;
        var eventCity = document.getElementById("eventCity").value;
        var eventState = document.getElementById("eventState").value;
        var ticketQty = document.getElementById("ticketQty").value;
        var seatLocation = document.getElementById("seatLocation").value;
        var ticketPrice = document.getElementById("ticketPrice").value;

        console.log(eventDate, eventName, eventVenue, eventCity, eventState, ticketQty, seatLocation, ticketPrice);

        postTix(eventDate, eventName, eventVenue, eventCity, eventState, ticketQty, seatLocation, ticketPrice)
    });


    function postTix(date, name, venue, city, state, qty, location, price) {
        console.log(name, date, city, venue, state, qty, location, price )

$.get(`https://app.ticketmaster.com/discovery/v2/events.json?keyword=${name}&city=${city}&localStartDateTime=${date}T00:00:00&localEndDateTime=${date}T23:59:59&apikey=${tM}`, function (post) {
            console.log(post);



    })
  };
});