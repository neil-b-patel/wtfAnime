document.addEventListener("DOMContentLoaded", (event) => {
  document.querySelector("#animeBox").addEventListener("keyup", (event) => {
    if (event.key !== "Enter") {
      return;
    }
    getRecs();
    event.preventDefault();
  });
  document.querySelector("#arrow").addEventListener("click", getRecs);
  document.querySelector("#noBtn").addEventListener("click", populateTitle);
});

let myTitles = [],
  myIds = [],
  myOfcTitles = [];

function getRecs() {
  let query = `query ($search: String) { # define which variables will be used in the query (id)
        Media (search: $search, type: ANIME) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
            recommendations {
                edges {
                    node {
                        mediaRecommendation {
                            id
                            title {
                                romaji
                                english
                                userPreferred
                            }
                        }
                    }
                }
            }
        }
    }`;

  let variables = {
    search: document.querySelector("#animeBox").value,
  };

  let url = "https://graphql.anilist.co",
    options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    };

  fetch(url, options)
    .then(handleResponse)
    .then(handleRecData)
    .catch(handleError);
}

function handleResponse(response) {
  return response.json().then(function (json) {
    return response.ok ? json : Promise.reject(json);
  });
}

function handleRecData(data) {
  // create an array of anime ids from response

  data.data.Media.recommendations.edges.forEach((e) => {
    if (e.node.mediaRecommendation.title.english !== null) {
      myTitles.push(e.node.mediaRecommendation.title.english);
    } else {
      myTitles.push(e.node.mediaRecommendation.title.romaji);
    }
    myOfcTitles.push(e.node.mediaRecommendation.title.userPreferred);
    myIds.push(e.node.mediaRecommendation.id);
  });

  document.querySelector("#search").style.display = "none";
  //   document.querySelector("#info").style.display = "none";
  document.querySelector("#result").style.display = "block";
  document.querySelector("#options").style.display = "block";
  populateTitle();
}

function populateTitle() {
  populateMsg();

  let indx = Math.floor(Math.random() * myTitles.length);
  let title = myTitles[indx],
    id = myIds[indx],
    ofcTitle = myOfcTitles[indx];

  document.querySelector("#recLink").innerHTML = title;

  ofcTitle = ofcTitle.replace(/ /g, "-");
  document.querySelector("#recLink").href = "https://anilist.co/anime/" + id + "/" + ofcTitle;
}

function populateMsg() { 
  const msgs = ["Waste your life watching : ", "Ignore your lover for : ", "Don't let your parents see you watching : ", "Name your first-born : ", "Doctors hate : ", "Shelter your kids from : ", "Repent sinner. Thy sin is : ", "Santa skips houses that watch : "]
  
  let indx = Math.floor(Math.random() * msgs.length);
  let msg = msgs[indx];

  document.querySelector("#msg").innerHTML = msg;
}

function handleError(error) {
  alert(`
  Hey fuck off, the robot overlords couldn't find that. Follow this fucking checklist to make sure they don't fucking invade your dreams.
  
  1. Actually pick a fucking anime

  2. Write the title more fucking accurately or completely

  3. I'm SO fucking "sorry" for all this fucking profanity`);
  console.error(error);
}