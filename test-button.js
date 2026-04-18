const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Capture console logs
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err));

  await page.goto('http://localhost:3000/clients', { waitUntil: 'networkidle0' });
  
  console.log("Page loaded. Looking for Add Client button.");
  
  // Find Add Client button
  const addBtn = await page.$('button');
  const buttons = await page.$$('button');
  for (let btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Add Client')) {
      console.log("Clicking Add Client Button!");
      await btn.click();
      break;
    }
  }

  // Wait 1s
  await new Promise(r => setTimeout(r, 1000));

  // See if Modal appeared
  const isModalOpen = await page.evaluate(() => {
    return document.body.style.overflow === 'hidden';
  });
  console.log("Modal Open (overflow hidden)?", isModalOpen);

  if (isModalOpen) {
     console.log("Submitting modal form...");
     // Fill out name
     const inputs = await page.$$('input');
     if (inputs.length > 0) {
       await inputs[1].type('Test Name');
     }
     
     const saveBtns = await page.$$('button');
     for (let btn of saveBtns) {
       const text = await page.evaluate(el => el.textContent, btn);
       if (text && text.includes('Save Client')) {
         console.log("Clicking Save Client!");
         await btn.click();
       }
     }
  }

  await new Promise(r => setTimeout(r, 3000));
  
  await browser.close();
})();
