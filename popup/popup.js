$(document).ready(function () {
  // ============================================
  // Check if JWT token is present
  var jwtToken = localStorage.getItem("jwtToken");

  // Send message containing the token to content_script
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { jwtToken: jwtToken });
  });

  if (jwtToken !== null) {
    $("#successMessage").show();
    $("#errorMessage").hide();
    $("successMessage").text("I am awesome");
    setTimeout(() => {
      $("#successMessage").hide();
    }, 10000);
  } else {
    $("#successMessage").hide();
    $("#errorMessage").show();
    setTimeout(() => {
      $("#errorMessage").hide();
    }, 10000);
  }

  // Function to handle form submission
  $("form").submit(function (event) {
    event.preventDefault(); // Prevent default form submission

    // Get email and password
    var email = $("#email").val();
    var password = $("#password").val();

    // Send POST request to authenticate endpoint
    $.ajax({
      url: "http://job-tracker-2-version-env.eba-rimccpcb.eu-north-1.elasticbeanstalk.com/authenticate",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        username: email,
        password: password,
      }),
      success: function (response) {
        // Check if jwtToken is present in the response
        if (response.jwtToken) {
          // Store JWT token to local storage
          localStorage.setItem("jwtToken", response.jwtToken);
          localStorage.setItem("username", response.username);
          console.log(response.jwtToken);
          alert("Hello " + response.username);

          // Show success message
          $("#successMessage").show();
          $("#errorMessage").hide();
          setTimeout(() => {
            $("#successMessage").hide();
          }, 10000);
        }
      },
      error: function (xhr, status, error) {
        // Handle error
        console.log(xhr.responseText);
      },
    });
  });
});
