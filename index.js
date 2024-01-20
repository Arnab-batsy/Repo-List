const API= "https://api.github.com/users/";

const getUserData= async()=>{
    const user= $("#search-box").val();
    const fetchData= await fetch(API+user);
    const userData= await fetchData.json();

    $(".url").html(`<p>${userData.url}</p>`);
    $("#image").html(`<img src=${userData.avatar_url} />`);
    $("#details").html(`<h1>${userData.name}</h1>
    <p>${userData.bio}</p>
    <p>Location: ${userData.location}</p>
    <p>Followers: ${userData.followers}</p>`);

}

