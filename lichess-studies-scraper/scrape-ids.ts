// Scrape lichess study IDs from the lichess website

import puppeteer from "puppeteer";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_API_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

// TODO scrape studies from other pages
const lichessUrl = "https://lichess.org/study/all/popular";

(async () => {
  // Load page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(lichessUrl, { waitUntil: "load", timeout: 0 });
  console.log("Page Loaded");

  // Scroll down to load all studies
  let lastHeight = await page.evaluate("document.body.scrollHeight");

  while (true) {
    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
    await page.waitForTimeout(2000);
    let newHeight = await page.evaluate("document.body.scrollHeight");
    if (newHeight === lastHeight) {
      break;
    }
    lastHeight = newHeight;
    console.log("Scrolled to load more studies");
  }

  // Get all study IDs
  const studyLinkElements = await page.$$("a.overlay");

  if (studyLinkElements === null) {
    throw new Error("StudyLinks query returned null");
  }

  const studyIds = await Promise.all(
    studyLinkElements.map(async (link) => {
      const hrefHandle = await link.getProperty("href");
      const url: string = await hrefHandle.jsonValue();

      // TODO: assert that the url has the correct form
      console.assert(url.length === 34);

      return url.slice(26, 34);
    })
  );

  console.log(`Found ${studyIds.length} studies`);
  console.log(studyIds);

  const studyObjects = studyIds.map((id) => ({ id }));
  const response = await supabase
    .from("lichess_studies")
    .upsert(studyObjects, {
      returning: "minimal",
      ignoreDuplicates: true,
      count: "exact",
    });

  console.log(`Inserted ${response.count} new studies.`);
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
