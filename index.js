import express from 'express'
import fetch from 'node-fetch'
import "dotenv/config";
import e from 'express';

// const url = "http://developer.simplicate.com/api/v2/crm/person?limit=5";

// Maak een nieuwe express app
const app = express();

// Stel in hoe we express gebruiken
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

// Maak een route voor de index pagina en haalt data uit de api 
app.get('/', (req, res) => {
  const urlPersonen = "https://demofdnd.simplicate.nl/api/v2/crm/person?limit=100";
  const headers = {
    'Authentication-Key': "gS7sibGSth6GQfDkGdLx9AU8T3cj1DoB",
    'Authentication-Secret': "eiZOT04oWOcQUg2XEzkiI42XyvNInifc"
  }

  // Make the API request using fetch and the headers
  fetch(urlPersonen, { headers })
    .then(response => {
      if (!response.ok) {
        throw new Error("Request failed with status " + response.status);
      }
      return response.json();
    })

    .then(data => {
      // Render the EJS view with the fetched data
      const dataArray = data.data;
      let d;
      // als ik een query param heb met 'datum', gebruik die dan, anders de huidige datum (new Date())
      if (req.query.datum) {

        d = new Date(`2023-07-${req.query.datum}`)
      } else {
         d = new Date();
      }

      let currentMonth = d.getMonth() - 3;
      let currentDay = d.getDay();
      console.log(urlPersonen)

      // Laat alleen de verjaardagen van deze maand en de huidige dag zien.
      const birthdaysThisMonth = dataArray.filter(person => {
        if (person.date_of_birth) {
          const month = person.date_of_birth.split('-')[1]
          const day = person.date_of_birth.split('-')[2]
          console.log(data);


          if (Number(month) == currentMonth) {
            return person
          }
        }
      })

      res.render('index', { data: dataArray, currentMonth, birthdaysThisMonth });
    })
    .catch(error => {
      // Handle any errors that occurred during the request
      console.error(error);
      res.status(500).send('Error occurred');
    });
});

// Stel het poortnummer in en start express
app.set("port", process.env.PORT || 8000);
app.listen(app.get("port"), function () {
  console.log(`Application started on http://localhost:${app.get("port")}`);
});

/**
 * Wraps the fetch api and return s the response body parsed through json
 * @param {*} url the api endpoint to address
 * @returns the json response from the api endpoint
 */
async function fetchJson(url) {
  return await fetch(url)
    .then((response) => response.json())
    .catch((error) => error);
}
export async function postJson(url, body) {
  return await fetch(url, {
    method: "post",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json"
    },
  })
    .then((response) => response.json())
    .catch((error) => error);
}
