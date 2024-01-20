const API = "https://api.github.com/users/";
const perPage = 10;
let repoArr = [];
let repoContainer = $(".repos");

const getUserData = async () => {
  const user = $("#search-box").val();
  const fetchData = await fetch(API + user);
  const userData = await fetchData.json();
  // console.log(userData);

  if (userData.message === "Not Found") {
    $(".home-page").html("<p>User not Found</p>");
    return;
  }
  const totalRepos = userData.public_repos;
  const totalPages = Math.ceil(totalRepos / 10);

  $(".url").html(
    `<p><img src="Assets/link.png" height="13px"/> <a href="${userData.html_url}" target="_blank" style="text-decoration: none; color: inherit; cursor: pointer;">${userData.html_url}</a></p>`
  );
  $("#image").html(`<img src=${userData.avatar_url} />`);
  $("#details").html(`<h1>${userData.name}</h1>
    <p>${userData.bio}</p>
    <p><img src="Assets/location-pin.png" height="13px"/> ${userData.location}</p>
    <p>Followers: ${userData.followers}</p>`);

  const Repo = await fetch(API + user + "/repos" + `?per_page=${perPage}`);
  const data = await Repo.json();
  console.log(data);
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
