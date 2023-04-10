const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config()

async function eventsFromKM(outputFilename) {

    console.log("process env", process.env)
    const baseUrl = process.env.BASEURL;
    const res = await axios.get(baseUrl);
    const data = res.data;
  
    const $ = cheerio.load(data);
    const imageData = [];
  
    // Get the total number of pages
    const lastPageUrl = $('.pager__item--last a').attr('href');
    const lastPageNumber = parseInt(lastPageUrl.match(/page=(\d+)/)[1]);
  
    // Loop through each page and scrape data
    for (let page = 0; page <= lastPageNumber; page++) {
      const pageUrl = `${baseUrl}?page=${page}`;
      const pageRes = await axios.get(pageUrl);
      const pageData = pageRes.data;
  
      const $page = cheerio.load(pageData);
  
      $page('div > ul > li').each((index, el) => {
        const $anchor = $page(el);
        const date = $anchor.find('.events-date').text();
        const posterTUrl = process.env.URL + $anchor.find('.events-poster > a').attr('href');
  
        const posterThumb = process.env.URL + $anchor.find('.events-poster > a > img').attr('src');
  
        const dateString = date
          .replace(/[\n\t\r]/g, ' ')
          .replace(/\s{2,}/g, ' ')
          .trim();
  
        const eventTitle = $anchor.find('.event-title > a').text();
        const eventHost = $anchor.find('.event-host').text().trim();
        const eventLocation = $anchor.find('.event-location').text().trim();
        const eventDateTime = $anchor
          .find('.event-datetime > time')
          .map((_, el) => $(el).text().trim())
          .get()
          .join(' - ');
        const eventCounty = $anchor.find('.event-county > a').text().trim();
  
        const eventDetails = {
          dateString,
          eventTitle,
          eventHost,
          eventLocation,
          eventDateTime,
          eventCounty,
          posterThumb,
          posterTUrl
        };
  
        if (eventTitle !== '') {
          imageData.push(eventDetails);
        }
      });
    }
  
    fs.writeFileSync(outputFilename, JSON.stringify(imageData));
  }
  
  eventsFromKM('kmEvents.json');