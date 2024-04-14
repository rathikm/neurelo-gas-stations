const axios = require('axios');
const cheerio = require('cheerio');

const db_url =  "https://us-east-2.aws.neurelo.com/rest/gas_stations/__one"

// URL of the webpage you want to scrape
const get_up_url = 'https://www.getupside.com/locations/ca/santa-clara/';

// Function to scrape the webpage
async function scrapeGetUpsideWebpage() {
    try {
        // Fetch the webpage content using axios
        let stations = [];
        const response = await axios.get(get_up_url);
        const html = response.data;
        // Load the HTML into Cheerio
        const $ = cheerio.load(html);

        // Array to store the scraped data
        

        // Use Cheerio selectors to extract the data you need
        $('div.site.row').each((index, element) => {
            console.log("hello")
            // Extract the data from the element and push it to the array
            const n_el = $(element).find('h2.site__name');
            const s_name = $(n_el).find('a').text();
            const addr_one = $(element).find('div.site__address-line1').text()
            const addr_two = $(element).find('div.site__address-line2').text()
            const s_addr = addr_one + ", " + addr_two
            const s_price = $(element).find('div.site__gas-original').eq(0).text()
            //console.log(s_price)

            let currentDate = new Date()
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');

            currentDate = `${year}-${month}-${day}`;
            let station = {
                name: s_name,
                address: s_addr,
                s_p: s_price,
                date: currentDate,
                trend: "+0.00",
            }

            stations.push(station);
        });
        // Return the scraped data
        return stations;
    } catch (error) {
        console.error('Error scraping webpage:', error);
        return null;
    }
}

const postData = async (dataArray) => {
    for (let i = 0; i < dataArray.length; i++) {
        const data = dataArray[i];
        fetch(db_url, {
            method: 'POST',
            headers: {
                'X-API-KEY': 'neurelo_9wKFBp874Z5xFw6ZCfvhXVQU9pnHmbAv5edlaig3qdSUOCop0N+d/NGLk0aV5YoRvKeEE3pM7af9o+caIvBNGAolbShZq3WIn3ZeWUDDpqN0TbUp7WCXi5o+zbsTsWgsHdS65hGxoQ3LMqgj8ZXTQ1a0kTSxy9YdEVjfqATY66V2vvEdoVHM1WXM6I90Gndp_bDQ2YgRW3zz6brbRd0yhZiIYad//wiBYPruXg+BRYCs=',
                // Add any other headers here
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
    //data = dataArray[0]
    
};



// Call the function with the URL
scrapeGetUpsideWebpage().then((data) => {
    postData(data)
    
});