const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Navigate to the app
    console.log('Navigating...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Get form info
    const formInfo = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
      return {
        inputCount: inputs.length,
        inputs: inputs.map((inp, idx) => ({
          idx,
          placeholder: inp.placeholder,
          value: inp.value,
          required: inp.required,
          disabled: inp.disabled,
          pattern: inp.pattern,
          minLength: inp.minLength,
          maxLength: inp.maxLength,
          id: inp.id,
          name: inp.name
        })),
        button: {
          text: document.querySelector('button')?.textContent,
          disabled: document.querySelector('button')?.disabled,
          type: document.querySelector('button')?.type
        }
      };
    });
    
    console.log('Form info:', JSON.stringify(formInfo, null, 2));
    
    // Try filling with different methods
    console.log('\nTrying to fill inputs...');
    const inputs = await page.locator('input[type="text"]').all();
    
    for (let i = 0; i < inputs.length; i++) {
      console.log(`Input ${i}:`);
      
      // Clear and fill
      await inputs[i].fill('');
      await page.waitForTimeout(300);
      
      let value = '';
      switch(i) {
        case 0: value = 'TESTGAME'; break;
        case 1: value = 'Alice'; break;
        case 2: value = 'Bob'; break;
      }
      
      await inputs[i].fill(value);
      const filledValue = await inputs[i].inputValue();
      console.log(`  Filled with "${value}", actual value: "${filledValue}"`);
    }
    
    // Wait and check button state
    await page.waitForTimeout(500);
    
    const buttonState = await page.evaluate(() => {
      const btn = document.querySelector('button');
      return {
        disabled: btn?.disabled,
        text: btn?.textContent,
        html: btn?.outerHTML.substring(0, 200)
      };
    });
    
    console.log('\nButton state after filling:');
    console.log(JSON.stringify(buttonState, null, 2));
    
    // Try to trigger any change events
    console.log('\nTrying to trigger validation...');
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('input[type="text"]');
      inputs.forEach(inp => {
        inp.dispatchEvent(new Event('change', { bubbles: true }));
        inp.dispatchEvent(new Event('input', { bubbles: true }));
        inp.dispatchEvent(new Event('blur', { bubbles: true }));
      });
    });
    
    await page.waitForTimeout(500);
    
    const finalButtonState = await page.evaluate(() => {
      const btn = document.querySelector('button');
      return {
        disabled: btn?.disabled,
        text: btn?.textContent
      };
    });
    
    console.log('Button state after triggering events:');
    console.log(JSON.stringify(finalButtonState, null, 2));
    
    // Take screenshot
    await page.screenshot({ path: '/home/runner/work/date-game/date-game/screenshots/debug-form.png' });
    console.log('\n✓ Debug screenshot saved');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
