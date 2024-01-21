const API = "https://api.github.com/users/";
let currentPage = 1;
const perPage = 10;
let repoArr = [];
let count = 0;
let totalPages = null;
let repoContainer = $(".repos");

const getUserData = async (current) => {
  const user = $("#search-box").val();
  const fetchData = await fetch(API + user);
  const userData = await fetchData.json();
  // console.log(userData);

  if (!fetchData.ok) {
    $(".home-page").html("<p>User not Found</p>");
    $(".home-page").css("text-align", "center");
    return;
  }
  const totalRepos = userData.public_repos;
  totalPages = Math.ceil(totalRepos / 10);
  // console.log(totalPages);

  $(".url").html(
    `<p><img src="Assets/link.png" height="13px"/> <a href="${userData.html_url}" target="_blank" style="text-decoration: none; color: inherit; cursor: pointer;">${userData.html_url}</a></p>`
  );
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
};

function displayRepos(repos) {
  repoContainer.html("");

  repos.forEach((param) => {
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

    const languageButton = $("<button></button>");
    languageButton.text(param.language || "Not specified");
    repoElement.append(languageButton);

    repoContainer.append(repoElement);
    repoArr.push(repoElement);
  });
}

function createRequiredPage(totalPage) {
  const pageShiftContainer = $(".page-shift-container");
  let num = parseInt(totalPage);
  // console.log(num);
  if (count === 0) {
    for (let i = 1; i <= num; ++i) {
      const listItem = $("<li></li>");
      listItem.addClass("list").text(i);
      pageShiftContainer.append(listItem);
      listItem.on("click", handleListItemClick);
    }
  }
  count++;
}

function handleListItemClick(event){
  const innerText = $(event.target).text();
  getUserData(innerText);
  currentPage = innerText;

  $(".list").css("background-color", ""); // Reset background color for all list items
  $(event.target).css("background-color", "#7f8ff4");
}
