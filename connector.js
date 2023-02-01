function POSTData(data) {
  let jsonData = topScoresToJson(data);
  const request = new XMLHttpRequest();
  request.open("POST", "server.php", true);

  request.setRequestHeader("Content-Type", "application/json");
  request.send(jsonData);
  console.log(request.responseText);
}

function GETData(callback) {
  const request = new XMLHttpRequest();
  let data = [];

  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      data = request.responseText;
      callback(JSON.parse(data));
    }
  };

  request.open("GET", "server.php", true);
  request.send();
}

function topScoresToJson(topScores) {
  let jsonData = "[";
  for (let i = 0; i < topScores.length; i++) {
    jsonData += JSON.stringify({
      nickname: topScores[i][0],
      score: topScores[i][1],
      date: topScores[i][2],
    });
    if (i != topScores.length - 1) {
      jsonData += ",";
    }
  }
  jsonData += "]";
  return jsonData;
}
