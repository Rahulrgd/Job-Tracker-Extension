// ======================Get Current Date Function======================
function retrieveCurrentDate() {
  var currentDate = new Date();

  // Get the year, month, and day components separately
  var year = currentDate.getFullYear();
  var month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based, so add 1
  var day = currentDate.getDate().toString().padStart(2, "0");
  return year + "-" + month + "-" + day;
}

// ======================Function to retrieve job details==========================
function extractJobDetails() {
  var jobTitle = $(".job-details-jobs-unified-top-card__job-title a")
    .text()
    .trim();
  var companyName = $(
    ".job-details-jobs-unified-top-card__primary-description-without-tagline .app-aware-link"
  )
    .text()
    .trim();
  var jobLink = window.location.href;
  var jobDescription = $(".jobs-description-content__text").text().trim();

  return {
    jobTitle: jobTitle,
    companyName: companyName,
    jobLink: jobLink,
    jobDescription: jobDescription,
    status: "APPLIED",
  };
}

// ======================Creating Add to Job-Tracker Button===============================
let job_tracker_button = false;

function createButton() {
  if (job_tracker_button === false) {
    $(".jobs-s-apply.jobs-s-apply--fadein.inline-flex.mr2").append(`
        <button style="margin-left: 5px; background-color:blue; color: white;" class="jobs-save-button artdeco-button artdeco-button--3 artdeco-button--secondary" id="add-to-job-tracker" type="button">
            <span aria-hidden="true">
                Add to Job-Tracker
            </span>
        </button>`);
  }
}
// ===============================Check JWT Token from Popup.js============================
// Listen for messages from popup.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.jwtToken) {
    var jwtToken = message.jwtToken;
    console.log("JWT Token received:", jwtToken);
    localStorage.setItem("jwtToken", jwtToken);
  }
});

// ===============================Post Request for Create Job Post=============================

function sendPostRequest(jobDetails) {
  var jwtToken = localStorage.getItem("jwtToken");

  //   Check if JWT token is present
  if (!jwtToken) {
    alert("You are not logged in. Please Login first");
    return;
  }

  // Prepare the request data
  var requestData = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwtToken,
    },
    body: JSON.stringify(jobDetails),
  };

  // =========================Send the POST request===============================
  fetch("http://localhost:5000/v1/add-job", requestData)
    .then((response) => {
      if (response.status === 401) {
        $("#add-to-job-tracker").css("background-color", "red");
        $("#add-to-job-tracker").text("You are not logged-in!");
        throw new Error("You are not logged-in. Please login-first");
        return; // Stop further execution
      }
      if (!response.ok) {
        $("#add-to-job-tracker").css("background-color", "red");
        $("#add-to-job-tracker").text("Something went wrong!");
        throw new Error("Network response was not ok");
      }
      return response;
    })
    .then((data) => {
      // Handle the response data
      console.log(data);
      console.log("Job post created successfully!");
      $("#add-to-job-tracker").css("background-color", "green");
      $("#add-to-job-tracker").text("Job Post added successfully!");
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() =>
      setTimeout(() => {
        $("#add-to-job-tracker").text("Add to Job-Tracker");
        $("#add-to-job-tracker").css("background-color", "blue");
      }, 3000)
    );
}
// =============================Document Ready Function=============================================

$(document).ready(function () {
  $(".jobs-search__job-details--wrapper").click(function (e) {
    e.preventDefault();
    console.log("You clicked on job details");
    createButton();
    setTimeout(() => {
      job_tracker_button = true;
    }, 10);
  });

  //   ==========================onClick Event on Button Add To Job-Tracker==========================

  $(document).on("click", "#add-to-job-tracker", function () {
    jobDetails = extractJobDetails();
    console.log(jobDetails);
    sendPostRequest(jobDetails);
  });
  //   ==============================End===================================================================
});
