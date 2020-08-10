const puppeteer = require('puppeteer');
const fastcsv = require('fast-csv');
const fs = require('fs');
// when searching one way - looks for best price for outboundDate + next month
const outboundDate = '2021-05-01'
const currency = 'NZD'
const limit = 4000
const isReturn = false
const returnDate = '2021-06-01'
const from = ['AKL','CHC','DUD','NPE','TRG','WLG','ZQN', 'NSN','WRE',
    'ADL','APW','BNE','CNS','MEL','NAN','IUE','NOU','PPT','RAR','TBU','OOL'
];
const to = ['TIA',
    'EVN',
    'GRZ',
    'INN',
    'KLU',
    'LNZ',
    'SZG',
    'VIE',
    'GYD',
    'MSQ',
    'ANR',
    'BRU',
    'CRL',
    'LGG',
    'OST',
    'SJJ',
    'TZL',
    'BOJ',
    'SOF',
    'VAR',
    'DBV',
    'PUY',
    'SPU',
    'ZAD',
    'ZAG',
    'LCA',
    'PFO',
    'BRQ',
    'PRG',
    'AAL',
    'AAR',
    'BLL',
    'CPH',
    'TLL',
    'HEL',
    'OUL',
    'RVN',
    'TMP',
    'TKU',
    'VAA',
    'AJA',
    'BSL',
    'MLH',
    'EAP',
    'BIA',
    'EGC',
    'BIQ',
    'BOD',
    'BES',
    'FSC',
    'LIL',
    'LYS',
    'MRS',
    'MPL',
    'NTE',
    'NCE',
    'BVA',
    'CDG',
    'ORY',
    'SXB',
    'TLN',
    'TLS',
    'TBS',
    'FMM',
    'BER',
    'SXF',
    'TXL',
    'BRE',
    'CGN',
    'DTM',
    'DRS',
    'DUS',
    'FRA',
    'FDH',
    'HHN',
    'HAM',
    'HAJ',
    'FKB',
    'LEJ',
    'MUC',
    'FMO',
    'NUE',
    'PAD',
    'STR',
    'NRN',
    'ATH',
    'CHQ',
    'CFU',
    'HER',
    'KGS',
    'JMK',
    'RHO',
    'JTR',
    'SKG',
    'ZTH',
    'BUD',
    'DEB',
    'KEF',
    'ORK',
    'DUB',
    'NOC',
    'KIR',
    'SNN',
    'AHO',
    'AOI',
    'BRI',
    'BGY',
    'BLQ',
    'BDS',
    'CAG',
    'CTA',
    'CIY',
    'FLR',
    'GOA',
    'SUF',
    'LIN',
    'MXP',
    'NAP',
    'OLB',
    'PMO',
    'PEG',
    'PSR',
    'PSA',
    'CIA',
    'FCO',
    'TPS',
    'TSF',
    'TRN',
    'VCE',
    'VRN',
    'ALA',
    'TSE',
    'RIX',
    'KUN',
    'VNO',
    'LUX',
    'SKP',
    'MLA',
    'KIV',
    'TGD',
    'TIV',
    'AMS',
    'EIN',
    'GRQ',
    'MST',
    'RTM',
    'AES',
    'BGO',
    'BOO',
    'HAU',
    'KRS',
    'OSL',
    'TRF',
    'SVG',
    'TOS',
    'TRD',
    'GDN',
    'KTW',
    'KRK',
    'WMI',
    'POZ',
    'WAW',
    'WRO',
    'FAO',
    'LIS',
    'FNC',
    'PDL',
    'OPO',
    'OTP',
    'CLJ',
    'IAS',
    'TSR',
    'SVX',
    'DME',
    'SVO',
    'VKO',
    'LED',
    'AER',
    'BEG',
    'INI',
    'PRN',
    'BTS',
    'LJU',
    'ALC',
    'LEI',
    'BCN',
    'BIO',
    'FUE',
    'GRO',
    'LPA',
    'IBZ',
    'XRY',
    'ACE',
    'MAD',
    'AGP',
    'PMI',
    'MAH',
    'MJV',
    'REU',
    'SDR',
    'SCQ',
    'SVQ',
    'TFN',
    'TFS',
    'VLC',
    'ZAZ',
    'GOT',
    'MMX',
    'ARN',
    'BMA',
    'NYO',
    'VST',
    'BRN',
    'GVA',
    'LUG',
    'ZRH',
    'ADA',
    'ESB',
    'AYT',
    'DLM',
    'IST',
    'ISL',
    'SAW',
    'ADB',
    'BJV',
    'TZX',
    'KBP',
    'IEV',
    'ODS',
    'ABZ',
    'BHD',
    'BFS',
    'BHX',
    'BRS',
    'CWL',
    'EMA',
    'EDI',
    'GLA',
    'PIK',
    'HUY',
    'JER',
    'LBA',
    'LPL',
    'LCY',
    'LGW',
    'LHR',
    'LTN',
    'SEN',
    'STN',
    'MAN',
    'SOU',
    'NCL'];
function chunkArray(myArray, chunk_size){
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];
    for (index = 0; index < arrayLength; index += chunk_size) {
        myChunk = myArray.slice(index, index+chunk_size);
        tempArray.push(myChunk);
    }
    return tempArray;
}

(async () => {
    let prices = [];
    var first = chunkArray(from, 6);
    var second = chunkArray(to, 6);
    let urls = [];
    for (let _from of first) {
        for (let _to of second) {
            urls.push({
                origins: _from.join(','),
                destinations: _to.join(',')
            })
        }
    }
    const urlChunks = chunkArray(urls, 1);
    const browser = await puppeteer.launch({
        // headless: false,
        // devtools: true,
        // slowMo: 50
    });
    const page = await browser.newPage();
    await page.setDefaultTimeout(60 * 1000)
    for(let chunk of urlChunks){
        const promises = chunk.map(async (tuple) => {
            const url = isReturn
                ? `https://www.google.com/flights#flt=${tuple.origins}.${tuple.destinations}.${outboundDate}*${tuple.destinations}.${tuple.origins}.${returnDate};c:${currency};e:1;p:${limit*100}.2.${currency};sc:b;sd:1;t:f`
                : `https://www.google.com/flights?flt=${tuple.origins}.${tuple.destinations}.${outboundDate};c:${currency};e:1;p:${limit*100}.2.${currency};sc:b;sd:1;t:f;tt:o`
            try {
                await page.goto(url, {
                    waitUntil: "networkidle2"
                });
                // await page.bringToFront();
                await page.waitFor(300);
                const selector = isReturn
                    ? `div.flt-input.gws-flights__flex-box.gws-flights__flex-filler.gws-flights-form__return-input`
                    : `div.flt-input.gws-flights__flex-box.gws-flights__flex-filler.gws-flights-form__departure-input`
                await page.waitFor(selector);
                // await page.bringToFront();
                await page.waitFor(300);
                await page.click(selector);
                await page.evaluate(selector => {
                    document.querySelector(selector).click();
                }, selector);
                await page.waitFor(2000);
                await page.waitForSelector('span.gws-travel-calendar__loading', {hidden: true, timeout: 120000});
                const days = await page.$$('calendar-day');
                for (let day of days) {
                    const price = await day.$('div span.gws-travel-calendar__annotation');
                    if(price){
                        const p = await price.evaluate(node => node.innerText);
                        if(p){
                            const _d = await day.evaluate(d => d.dataset.day);
                            prices.push({
                                date: _d,
                                price: p,
                                from: tuple.origins,
                                to: tuple.destinations,
                                url: url
                            })
                        }
                    }
                }
            } catch(e){
                console.log(e)
                console.log(tuple)
                console.log(url)
            }
        });
        await Promise.all(promises);
    }
    await browser.close();
    prices = prices.sort((x, y) => (x.price == y.price) ? 0 : ((x.price > y.price) ? 1 : -1))
    if(prices.length){
        const now = new Date().getTime();
        const file1 = `flights-${now}.csv`
        const file2 = `flights-${now}.json`
        const ws = fs.createWriteStream(file1);
        fastcsv
            .write(prices, { headers: true, quote: true, quoteColumns: true })
            .pipe(ws);
        fs.writeFileSync(file2, JSON.stringify(prices));
        console.log(`Done, see file ${file1} and ${file2}`)
    } else {
        console.log(`Found nothing...`)
    }

})();