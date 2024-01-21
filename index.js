const API = "https://api.github.com/users/";
let currentPage = 1;
var perPage = 10;
let repoArr = [];
let count = 0;
let totalPages = null;
let repoContainer = $(".repos");

let activeTab = 1;
const prevButton = $("#prev");
const nextButton = $("#next");

prevButton.on("click", () => {
  $(".load").append(`<div id="loader"></div>`);
  currentPage = currentPage > 1 ? currentPage - 1 : 1;
  getUserData(currentPage);

  if (activeTab === 1) {
    return;
  }

  const prevTab = $("#list-" + activeTab);
  prevTab.css("background-color", "white");

  activeTab--;

  const nextTab = $("#list-" + activeTab);
  nextTab.css("background-color", "#7f8ff4");
});

nextButton.on("click", () => {
  $(".load").append(`<div id="loader"></div>`);
  currentPage = currentPage < totalPages ? currentPage + 1 : totalPages;
  getUserData(currentPage);

  if (activeTab === totalPages) {
    return;
  }

  var prevTab = $("#list-" + activeTab);
  prevTab.css("background-color", "white");

  activeTab++;

  var nextTab = $("#list-" + activeTab);
  nextTab.css("background-color", "#7f8ff4");
});

function clearDefault() {
  $(".page-shift-container").empty();
  $(".load").append(`<div id="loader"></div>`);
  // $(".home-page").empty();
  // console.log("Hey");
  count = 0;
  currentPage = 1;
  activeTab = 1;
  // console.log(perPage);
  getUserData();
}

const getUserData = async (current) => {
  const user = $("#search-box").val();
  const fetchData = await fetch(API + user);
  const userData = await fetchData.json();
  // console.log(userData);

  if (!fetchData.ok) {
    $(".home-page").html("<p>User not Found</p>");
    $(".home-page").css("text-align", "center");
    $(".page-containers").css("visibility","hidden");
    $(".load #loader").remove();
    return;
  }
  const totalRepos = userData.public_repos;
  totalPages = Math.ceil(totalRepos / perPage);
  // console.log(totalPages);

  $(".url").html(
    `<p><img src="Assets/link.png" height="13px"/> <a href="${userData.html_url}" target="_blank" style="text-decoration: none; color: inherit; cursor: pointer;">${userData.html_url}</a></p>`
  );

  $(".profile").css("visibility","visible");
  $("#image").html(`<img src=${userData.avatar_url} />`);
  $("#details").html(`<h1>${userData.name}</h1>
    <p>${userData.bio}</p>
    <p><img src="Assets/location-pin.png" height="13px"/> ${userData.location}</p>
    <p>Followers: ${userData.followers}</p>`);

  const Repo = await fetch(
    API + user + "/repos" + `?per_page=${perPage}&page=${current}`
  );

  var pageContainer = $(".page-containers");
  if (!pageContainer.hasClass("show-children")) {
    pageContainer.addClass("show-children");
  }

  const data = await Repo.json();
  // console.log(data);

  if (data.message === "Not Found") {
    repoContainer.html("No repositories found for the user");
    return;
  }
  
  displayRepos(data);
  createRequiredPage(totalPages);
  $(".load #loader").remove();
};

async function displayRepos(repos) {
  repoContainer.html("");
  // console.log(repos.length);
  for (let i = 0; i < repos.length; i++) {
    let param = repos[i];
    const repoElement = $("<div></div>");
    repoElement.addClass("repository");

    const repoLink = $("<a></a>");
    repoLink.attr("href", param.html_url);
    repoLink.attr("target", "_blank");
    repoLink.html(`<h3>${param.name}</h3>`);
    repoElement.append(repoLink);

    const description = $("<p></p>");
    description.text(param.description || "No description available.");
    repoElement.append(description);

    //Language url- "https://api.github.com/repos/Arnab-batsy/Fun-Assembly/languages",

    const apiCall = await fetch(
      "https://api.github.com/repos/" +
        param.owner.login +
        "/" +
        param.name +
        "/languages"
    );
    var langURL = await apiCall.json();
    var langs = Object.keys(langURL);

    if (langs.length === 0) {
      const languageButton = $("<button></button>");
      languageButton.text("Not specified");
      repoElement.append(languageButton);
    } else {
      langs.forEach((language) => {
        const languageButton = $("<button></button>");
        languageButton.text(language);
        repoElement.append(languageButton);
      });
    }

    repoContainer.append(repoElement);
    repoArr.push(repoElement);
  }
  // });
};

function createRequiredPage(totalPage) {
  const pageShiftContainer = $(".page-shift-container");
  let num = parseInt(totalPage);
  // console.log(num);
  if (count === 0) {
    for (let i = 1; i <= num; ++i) {
      const listItem = $("<li></li>");
      listItem.addClass("list").text(i);
      listItem.attr("id", "list-" + i);
      pageShiftContainer.append(listItem);
      listItem.on("click", handleListItemClick);
    }
  }
  count++;
}

function handleListItemClick(event) {
  activeTab = parseInt($(event.target).attr("id").slice(5));
  // console.log(activeTab);
  const innerText = $(event.target).text();
  getUserData(innerText);
  currentPage = innerText;

  $(".list").css("background-color", ""); // Reset background color for all list items
  $(event.target).css("background-color", "#7f8ff4");
  $(event.target).css("color", "white");
}

$("#repo-count-change").on("change",(event)=>{
    perPage=$(event.target).val();
    if(perPage>100){
      perPage=100;
      $(event.target).val("100");
    }
    clearDefault();
});
