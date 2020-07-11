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

let myRecs = [];

function getRecs() {
  let query = `query ($search: String) { # define which variables will be used in the query (id)
        Media (search: $search, type: ANIME) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
            recommendations {
                edges {
                    node {
                        mediaRecommendation {
                            title {
                                romaji
                                english
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
      myRecs.push(e.node.mediaRecommendation.title.english);
    } else {
      myRecs.push(e.node.mediaRecommendation.title.romaji);
    }
  });

  document.querySelector("#search").style.display = "none";
//   document.querySelector("#info").style.display = "none";
  document.querySelector("#result").style.display = "block";
  document.querySelector("#options").style.display = "block";
  populateTitle();
}

function populateTitle() {
  let title = myRecs[Math.floor(Math.random() * myRecs.length)];
  document.querySelector("#rec").innerHTML = title;
}

function handleError(error) {
  alert("Error, check console");
  console.error(error);
}
