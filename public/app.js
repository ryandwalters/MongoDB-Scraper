// We'll be rewriting the table's data frequently, so let's make our code more DRY
// by writing a function that takes in 'scrapedData' (JSON) and creates a table body
function displayResults(scrapedData) {
    // First, empty the table
    $("tbody").empty();

    // Then, for each entry of that json...
    scrapedData.forEach(function (row) {

        var tr = $("<tr>"); //<tr></tr>

            var firstTd = $("<td>");
                var img = $('<img>');
                img.attr('src', row.photo);
                    firstTd.append(img);

            var secondTd = $("<td>");
                var divReview = $('<div>'); //<div></div>
                    var pTitle = $('<p>'); //<p></p>
                    pTitle.text(row.title); //<p>the title goes in here now</p>
                    var pDetails = $('<p>');
                    pDetails.text(row.details);

                    var pLink = $('<p>');
                    pLink.text(row.link)

                        divReview.append(pTitle);
                        divReview.append(pLink);
                        divReview.append(pDetails);

                            secondTd.append(divReview);

            var thirdTd = $("<td>");
                
                if (row.saved){
                    var pAlreadySaved = $('<p>');
                    pAlreadySaved.text('this has been saved');
                    thirdTd.append(pAlreadySaved);
                }else {
                    var button = $('<button>');
                    button.text('save');
                    button.attr('class', 'save')
                    button.attr('data-scrapeid', row._id);
                    thirdTd.append(button);
                }

                thirdTd.append(row.notes);

        tr.append(firstTd);
        tr.append(secondTd);
        tr.append(thirdTd);

        // Append each of the animal's properties to the table
        $("tbody").append(tr);


        //    "<td>" + animal.whatIWouldReallyCallIt + "</td></tr>");

    });
}

// Bonus function to change "active" header
//   function setActive(selector) {
//     // remove and apply 'active' class to distinguish which column we sorted by
//     $("th").removeClass("active");
//     $(selector).addClass("active");
//   }


// 1: On Load
// ==========

// First thing: ask the back end for json with all animals
$.getJSON("/all", function (data) {
    // Call our function to generate a table body
    displayResults(data);

});

// 2: Button Interactions
// ======================

$("#scrape").on("click", function () {
    // Set new column as currently-sorted (active)


    $.getJSON("/scrape", function (scrapedData) {
        //make function that clears table in the dom and then fills it by querying the database



        // Call our function to generate a table body
        displayResults(scrapedData);
    });
});

$(document).on('click', '.save', function(){
    var id = $(this).attr('data-scrapeid');
    var that = $(this);

    //in your server.js make a route that would take an id and save that id

    //then here make an ajax call that hits thatroute
    $.getJSON("/save-note/" + id, function (data) {
        debugger;
        var td = that.parent()
        that.remove();
        td.append('<p>this has been saved</p>')
    });

});




//   // When user clicks the name sort button, display the table sorted by name
//   $("#name-sort").on("click", function() {
//     // Set new column as currently-sorted (active)
//     setActive("#animal-name");

//     // Do an api call to the back end for json with all animals sorted by name
//     $.getJSON("/name", function(data) {
//       // Call our function to generate a table body
//       displayResults(data);
//     });
//   });
