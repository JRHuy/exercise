const fs = require('fs');
const moment = require('moment');

// get check-in date argument from the command line
const checkinDate = '2019-12-25';

// load data from input.json
const data = JSON.parse(fs.readFileSync('input.json', 'utf8'));

const categoryID = {
    'Restaurant': 1,
    'Retail': 2,
    'Activity': 4
};

let eligibleOffers = data.offers.filter(offer => {
    // check if offer's category is in categoryID
    if (Object.values(categoryID).includes(offer.category)) {
        const validDate = moment(offer.valid_to, 'YYYY-MM-DD');
        // check if offer is valid till check-in date + 5 days
        if (validDate.isSameOrAfter(moment(checkinDate, 'YYYY-MM-DD').add(5, 'days'))) {
            // if offer has multiple merchants, select the closest one
            offer.merchants.sort((a, b) => a.distance - b.distance);
            offer.merchants = [offer.merchants[0]];
            return true;
        }
    }
    return false;
});
console.log(eligibleOffers)