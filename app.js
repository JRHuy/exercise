const fs = require('fs');
const moment = require('moment');

// const checkinDate = '2019-12-25';
// get check-in date argument from the command line
const checkinDate = process.argv[2];

// load data from input.json
fs.readFile('input.json', 'utf8', (err, data) => {
    if (err) throw err;

    const offers = JSON.parse(data).offers;

    // Only select offers with category that is Restaurant, Retail or Activity
    const categoryID = {
        'Restaurant': 1,
        'Retail': 2,
        'Activity': 4
    };

    let eligibleOffers = offers.filter(offer => {
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

    // Only return 2 offers even though there are several eligible offers.
    // If there are multiple offers in the same category give priority to the closest merchant offer.
    // If there are multiple offers with different categories, select the closest merchant offers when selecting 2 offers.
    // first sort offers by distance of the closest merchants, then select 2 offers in different categories
    eligibleOffers.sort((a, b) => a.merchants[0].distance - b.merchants[0].distance);
    finalOffers = [];
    differentCategories = new Set();
    for (let offer of eligibleOffers) {
        if (!differentCategories.has(offer.category)) {
            finalOffers.push(offer);
            differentCategories.add(offer.category);
        }
        if (finalOffers.length == 2) {
            break;
        }
    }

    // print selected offers to output.json file
    fs.writeFile('output.json', JSON.stringify({ offers: finalOffers }, null, 2), err => {
        if (err) throw err;
    });
});