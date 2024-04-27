const axios = require('axios');
const cheerio = require('cheerio');

const db_url =  "https://us-east-2.aws.neurelo.com/rest/gas_stations/__one"

const gasbuddy_url = 'https://www.gasbuddy.com/gasprices/california/santa-clara';

async function scrapeGasBuddyWebpage() {
    try {
        // Fetch the webpage content using axios
        let stations = [];
        const response = await axios.get(gasbuddy_url);
        const html = response.data;
        // Load the HTML into Cheerio
        const $ = cheerio.load(html);


        $('a[href^="/station/"]').each((index, element) => {
            // Extract the href attribute value
            const href = $(element).attr('href');
            // Extract the station id from the href
            const id = href.split('/').pop();
            // Extract the text of the link
            const text = $(element).text();
            if (!text.includes("Details")) {
                let new_st = {
                    "name": "",
                    "address": "",
                    "date": "",
                    "s_p": "",
                    "trend": "",
                }
                new_st.name = text;
                //new_st.name = text.replace(/\s+/g, '');
                let currentDate = new Date()
                const year = currentDate.getFullYear();
                const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                const day = String(currentDate.getDate()).padStart(2, '0');

                currentDate = `${year}-${month}-${day}`;
                new_st.date = currentDate;
                stations.push(new_st); 
                //console.log(`Station ID: ${id}, Name: ${text}`);
            }
            
        });
        $('.text__xl___2MXGo.text__left___1iOw3.StationDisplayPrice-module__price___3rARL').each((index, element) => {
            // Get the text of each <span> element
            const text = $(element).text();
            stations[index].s_p = text;
            //console.log(text);
        });
        $('div.StationDisplay-module__address___2_c7v').each((index, element) => {
            // Get the text of each <div> element
            // Get the inner HTML of each <div> element
            const innerHtml = $(element).html();
            // Replace <br> tags with ", " and trim whitespace
            const text = innerHtml.replace(/<br\s*[\/]?>/gi, ', ').trim();
            console.log(text);
            stations[index].address = text;
            //console.log(text);
        });
        
        // Array to store the scraped data
        console.log(stations)
        return stations
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
//scrapeGasBuddyWebpage()
scrapeGasBuddyWebpage().then((data) => {
    postData(data)
});