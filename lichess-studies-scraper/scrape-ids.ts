// Scrape lichess study IDs from the lichess website

import puppeteer from 'puppeteer';

const url = 'https://lichess.org/study/all/popular';

(async () => {
    // Load page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'load', timeout: 0 });
    console.log("Page Loaded");

    // Scroll down to load all studies
    let lastHeight = await page.evaluate('document.body.scrollHeight');

    while (true) {
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        await page.waitForTimeout(2000);
        let newHeight = await page.evaluate('document.body.scrollHeight');
        if (newHeight === lastHeight) {
            break;
        }
        lastHeight = newHeight;
        console.log("Loaded more studies");
    }

    // Get all study IDs
    const studyLinkElements = await page.$$("a.overlay");

    if (studyLinkElements === null) {
        throw new Error("StudyLinks query returned null");
    }

    const studyIds = await Promise.all(studyLinkElements.map(async (link) => {
        const hrefHandle = await link.getProperty("href");
        const url: string = await hrefHandle.jsonValue();
        
        // TODO: assert that the url has the correct form
        console.assert(url.length === 34);

        return url.slice(26, 34);
    }))

    console.log(studyIds);
})();
