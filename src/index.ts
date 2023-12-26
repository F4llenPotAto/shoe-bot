/**
 * @file Example of using Puppeteer on a real website.
 */

import Puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

// Add stealth plugin and use defaults (all evasion techniques).
Puppeteer.use(StealthPlugin());

/**
 * A headful example of Puppeteer ran against the little ghost keycap set.
 */
async function osumeExample() {
  // Launch the browser and open a new blank page.
  const browser = await Puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  // Navigate the page to a URL.
  await page.goto("https://osume.com/products/little-ghost-keycaps");

  // Set screen size.
  await page.setViewport({ width: 1080, height: 1080 });

  // Find and click the add to cart button.
  const selector = "button[type='submit']::-p-text(Add to cart)";
  await page.waitForSelector(selector);
  const queriedElement = await page.$(selector);
  await queriedElement!.click();

  // Find and click the review order button.
  //
  // Notes:
  // - Adding to cart is not instant, it takes some time.
  // - Interesting that I can't call .click() on the returned element,
  //   I have to execute it on the browser side via $eval.
  await sleep(500); // Would be better to retry instead of sleep.
  await page.$eval("::-p-text(review order)", (e) =>
    (e as HTMLAnchorElement).click()
  );

  // Wait for redirect and click the checkout button.
  await page.waitForNavigation();
  await page.$eval("button[type='submit']::-p-text(checkout)", (e) =>
    e.click()
  );

  // Start filling out the form.
  await page.waitForNavigation();

  await page.type('input[name="firstName"]', "Taylor");
  await page.type('input[name="lastName"]', "Swift");

  await page.type('input[name="address1"]', "411 Legislative Ave");
  await page.type('input[name="city"]', "Dover");
  await page.select('select[name="zone"]', "DE");
  await page.type('input[name="postalCode"]', "19901");
  await page.type('input[name="phone"]', "3142223333");

  // Fillout checkout info fields that are all nested in iFrames.
  const creditCardNumberInputFrame = page
    .frames()
    .find((frame) => frame.name().includes("card-fields-number"));
  await creditCardNumberInputFrame!.type(
    'input[name="number"]',
    "4444111122223333"
  );

  const expiryInputFrame = page
    .frames()
    .find((frame) => frame.name().includes("card-fields-expiry"));
  await expiryInputFrame!.type('input[name="expiry"]', "0825");

  const securityCodeInputFrame = page
    .frames()
    .find((frame) => frame.name().includes("card-fields-verification_value"));
  await securityCodeInputFrame!.type('input[name="verification_value"]', "123");

  /**
   * Prints out the text content of all elements that match the given selector.
   * Intended to be used for debugging.
   *
   * @param selector The selector to use.
   * @returns The text content of every element that matches the selector.
   */
  async function printTextContentOfSelectorMatches(
    selector: string
  ): Promise<string[]> {
    return await page.$$eval(selector, (elements) => {
      // Note that all code in $$eval is executed browser side, so the print
      // statement can only be seen by opening up the console in the browser's
      // devtools.
      const textContentOfSelectcorMatches = elements.map((e) => e.textContent);
      console.log(textContentOfSelectcorMatches);
      return textContentOfSelectcorMatches;
    });
  }
}

/**
 * Returns a promise that can be awaited to pause the application for a
 * specified number of milliseconds.
 *
 * @param msec The number of milliseconds to sleep for.
 * @returns A promise that can be awaited.
 */
async function sleep(msec: number) {
  return new Promise((resolve) => setTimeout(resolve, msec));
}

osumeExample();
