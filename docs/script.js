var apiKey = '254f86a3398d6cfe8f3d03a2de246cb0'
var basicApi = 'https://api.openweathermap.org/data/2.5/forecast?units=imperial&q='
var currentApi = 'https://api.openweathermap.org/data/2.5/weather?units=imperial&q='



var search = document.querySelector('.input');

var current = document.querySelector('.ulCr');
var future = document.querySelector('.ulFt');

var hs = [];


// console.log(date)

var container = document.querySelector('.add')

// function to create a row in the container
function makeCard(city, id, temp, humid, wind, date, uv) {
  // make row div with row class
  var row = document.createElement('div');
  row.classList.add('row');
  // make 1 column add 
  var col1 = document.createElement('div');
  col1.setAttribute("class", 'col');
  // second column add
  // var col2 = document.createElement('div');
  // col2.classList.add('col');

  // make the cards
  var card = document.createElement('div');
  card.setAttribute("class", 'card w-33 my-4');
  // card.setAttribute("style",'height: auto');
  // card.classList.add('w-33')

  // img tag
  var img = document.createElement('img');
  img.setAttribute('src', id)
  img.setAttribute("class", 'card-img-top')

  // body
  var body = document.createElement('div');
  body.classList.add('card-body');

  // title
  var title = document.createElement('h5');
  title.setAttribute("class", 'card-title text-center')
  title.textContent = 'Weather for ' + city + " on " + date;

  // ul
  var ul = document.createElement('ul');
  ul.setAttribute("class", 'list-group ulCr list-group-flush');

  // Temp
  var tLi = document.createElement('li');
  tLi.setAttribute("class", "list-group-item text-center");
  tLi.textContent = "Temperature: " + temp + '°F'
  // humidity
  var hLi = document.createElement('li');
  hLi.setAttribute("class", "list-group-item text-center");
  hLi.textContent = "Humidity: " + humid + '%';
  // wind speed
  var wLi = document.createElement('li');
  wLi.setAttribute("class", "list-group-item text-center");
  wLi.textContent = "Wind Speed: " + wind + 'mph';


  // add them all up
  body.append(title);
  ul.append(tLi);
  ul.append(hLi);
  ul.append(wLi);

  // uv index
  if (uv != undefined) {
    var uLi = document.createElement('li');
    // checking uv index to set color
    if(uv <= 2){
      uLi.setAttribute("class", 'list-group-item text-center favorable');
    }else if(uv > 2 && uv <= 5){
      uLi.setAttribute("class", 'list-group-item text-center moderate');
    }else if(uv > 5){
      uLi.setAttribute("class", 'list-group-item text-center severe');
    }
    
    uLi.textContent = "UV Index: " + uv;
    ul.append(uLi);
  }


  card.append(img);
  card.append(body);
  card.append(ul);
  col1.append(card);
  // row.append(col1);
  // container.append(row);
  // col1.setAttribute("class", "mb-3")
  return col1;
}

function makeRow(day1, day2, day3, day4, day5) {
  // make row div with row class
  var row = document.createElement('div');
  row.setAttribute("class", "row display second");
  if (day1 != undefined) {
    day1.setAttribute("class", "col")
    row.setAttribute("class", "row display first");
    row.append(day1)
  }
  if (day2 != undefined) {
    row.append(day2)
  }
  if (day3 != undefined) {
    row.append(day3)
  }
  if (day4 != undefined) {
    row.append(day4)
  }
  if (day5 != undefined) {
    row.append(day5)
  }
  container.append(row)
}


// fetch current data for today and future and uv index
// it turns out returning values from fetches doesnt work
// nested 3 fetches to handle display of cards with relevant data to input
function getData(input) {
  var dynamicApi = currentApi + input + '&appid=' + apiKey;
  fetch(dynamicApi)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      };
      return response.json();
    })
    .then(function (data) {
      // console.log(data)
      var weatherIcon = 'http://openweathermap.org/img/w/';
      weatherIcon = weatherIcon + data.weather[0].icon + '.png';
      var temp = data.main.temp
      temp = temp.toString()
      temp = temp.split('.')[0]
      var humid = data.main.humidity;
      var wind = data.wind.speed;
      var date = moment().format('dddd, MMMM Do YYYY');
      // return a;
      var name = data.name
      // adding the fetch for uv index
      var lat = data.coord.lat.toString();
      var lon = data.coord.lon.toString();
      // console.log(lat,lon)
      // create fetch url
      var needsLat = 'https://api.openweathermap.org/data/2.5/onecall?lat='
      var needsLon = '&lon='
      var end = '&exclude=hourly,daily,minutely,alerts&units=imperial&appid=' + apiKey
      needsLat = needsLat + lat
      needsLon = needsLat + needsLon + lon + end
      fetch(needsLon)
        .then(function (response) {
          if (!response.ok) {
            throw response.json();
          }
          return response.json();
        })
        .then(function (data) {
          // console.log(data)
          var uv = data.current.uvi;
          // console.log(uv)
          var a = makeCard(name, weatherIcon, temp, humid, wind, date, uv);
          makeRow(a)
          var dynamicApi = basicApi + input + '&appid=' + apiKey;
          // var a = getData(input)
          // console.log(a)
          fetch(dynamicApi)
            .then(function (response) {
              if (!response.ok) {
                throw response.json();
              };
              return response.json();
            })
            .then(function (data) {
              // console.log(data)
              var weatherIcon = 'http://openweathermap.org/img/w/';
              // second day
              weatherIcon = weatherIcon + data.list[4].weather[0].icon + '.png';
              var temp = data.list[4].main.temp
              temp = temp.toString()
              temp = temp.split('.')[0]
              var humid = data.list[4].main.humidity;
              var wind = data.list[4].wind.speed;
              var date = moment(data.list[4].dt_txt).format('dddd, MMMM Do YYYY');
              var b = makeCard(data.city.name, weatherIcon, temp, humid, wind, date);
              // third day
              var weatherIcon = 'http://openweathermap.org/img/w/';
              weatherIcon = weatherIcon + data.list[12].weather[0].icon + '.png';
              var temp = data.list[12].main.temp
              temp = temp.toString()
              temp = temp.split('.')[0]
              var humid = data.list[12].main.humidity;
              var wind = data.list[12].wind.speed;
              var date = moment(data.list[12].dt_txt).format('dddd, MMMM Do YYYY');
              var c = makeCard(data.city.name, weatherIcon, temp, humid, wind, date);
              // fourth day
              var weatherIcon = 'http://openweathermap.org/img/w/';
              weatherIcon = weatherIcon + data.list[20].weather[0].icon + '.png';
              var temp = data.list[20].main.temp
              temp = temp.toString()
              temp = temp.split('.')[0]
              var humid = data.list[20].main.humidity;
              var wind = data.list[20].wind.speed;
              var date = moment(data.list[20].dt_txt).format('dddd, MMMM Do YYYY');
              var d = makeCard(data.city.name, weatherIcon, temp, humid, wind, date);
              // fifth day
              var weatherIcon = 'http://openweathermap.org/img/w/';
              weatherIcon = weatherIcon + data.list[28].weather[0].icon + '.png';
              var temp = data.list[28].main.temp
              temp = temp.toString()
              temp = temp.split('.')[0]
              var humid = data.list[28].main.humidity;
              var wind = data.list[28].wind.speed;
              var date = moment(data.list[28].dt_txt).format('dddd, MMMM Do YYYY');
              var e = makeCard(data.city.name, weatherIcon, temp, humid, wind, date);
              makeRow(a, b, c, d, e)
            });
        })
    });
  // console.log(a)
};

// populate previous searches
function saveSrch() {
  var val = localStorage.getItem("saveSearch")
  // console.log(val)
  var it = val.split(',')
  // console.log(it)
  for (var i = 0; i < it.length; i++) {
    var hold = document.createElement('li');
    var click = document.createElement('button');
    click.setAttribute("class", "dropdown-item")
    click.setAttribute("type", "button")
    click.textContent = it[i]
    hold.append(click)
    document.querySelector('.local').append(hold)
  }
}

// function to delete all li from ul
function deleteChild(target) {
  var child = target.lastElementChild;
  while (child) {
    target.removeChild(child);
    child = target.lastElementChild;
  }
}

// Go btn event listener
document.querySelector('.form1').addEventListener('submit', function (e) {
  e.preventDefault()
  hs.push(search.value)
  // getFutureData(search.value)
  getData(search.value)
  // localStorage.setItem("saveSearch", JSON.stringify(hs))
  localStorage.setItem("saveSearch", hs)
  deleteChild(document.querySelector('.local'))
  saveSrch()
})

// Autocomplete for previous searches 
document.querySelector(".local").addEventListener("click", function (e) {
  if (e.target.tagName === "BUTTON") {
    document.querySelector(".input").value = e.target.textContent;
  }
});

document.querySelector('.clear').addEventListener('click', function(e){
  e.preventDefault()
  $('.display').remove()
})