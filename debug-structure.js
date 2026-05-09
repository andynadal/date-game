const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('Navigating...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    const pageContent = await page.evaluate(() => {
      return {
        allInputs: document.querySelectorAll('input').length,
        textInputs: document.querySelectorAll('input[type="text"]').length,
        allButtons: document.querySelectorAll('button').length,
        allForms: document.querySelectorAll('form').length,
        inputs: Array.from(document.querySelectorAll('input')).map(inp => ({
          type: inp.type,
          placeholder: inp.placeholder,
          value: inp.value,
          disabled: inp.disabled,
          className: inp.className
        })),
        interactiveElements: Array.from(document.querySelectorAll('button, a')).slice(0, 10).map(el => ({
          tag: el.tagName,
          role: el.getAttribute('role'),
          type: el.type,
          text: el.textContent?.substring(0, 30),
          placeholder: el.placeholder
        })),
        editableDivs: Array.from(document.querySelectorAll('[contenteditable]')).map(el => ({
          editable: true,
          text: el.textContent?.substring(0, 30)
        })),
        mainContent: document.querySelector('main')?.innerHTML?.substring(0, 1500)
      };
    });
    
    console.log('Page structure:', JSON.stringify(pageContent, null, 2));
    
    await page.screenshot({ path: '/home/runner/work/date-game/date-game/screenshots/debug-full.png' });
    console.log('Screenshot saved');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
