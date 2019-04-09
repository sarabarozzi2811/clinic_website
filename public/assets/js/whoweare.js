var whowearedescription;


$(window).ready(function() {
  whowearedescription = $("#whowearedescription");

  $.ajax({
    method: "GET",
    dataType: "json",
    crossDomain: true,
    url: "/whoweare/",
    data: {
      id: URL.id
    },
    success: function(response) {
      console.log(response);

        whowearedescription.text(response[0].descrizione);
    },
    error: function(request, error) {
      console.log(request + ":" + error);
    }
  });
});
