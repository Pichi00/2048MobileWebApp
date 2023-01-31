function POSTData(data) {
  const request = new XMLHttpRequest();

  request.open("POST", "server.php", true);
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify(data));
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
