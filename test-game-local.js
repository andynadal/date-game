const { chromium } = require('./node_modules/playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Step 1: Navigate to the application
    console.log('1. Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    // Step 2: Take screenshot of initial setup
    console.log('2. Taking screenshot of initial setup screen...');
    await page.screenshot({ path: '/tmp/01-initial-setup.png', fullPage: true });
    
    // Wait for page to load
    await page.waitForTimeout(1000);
    
    // Get all input fields
    const inputs = await page.$$('input');
    console.log(`Found ${inputs.length} input fields`);
    
    // Step 3: Fill in game code
    if (inputs.length > 0) {
      console.log('3. Filling in game code "TEST123"...');
      await inputs[0].click();
      await inputs[0].fill('TEST123');
      await page.waitForTimeout(500);
    }
    
    // Step 4: Fill in player 1
    if (inputs.length > 1) {
      console.log('4. Filling in player 1 "Alice"...');
      await inputs[1].click();
      await inputs[1].fill('Alice');
    }
    
    // Step 5: Fill in player 2
    if (inputs.length > 2) {
      console.log('5. Filling in player 2 "Bob"...');
      await inputs[2].click();
      await inputs[2].fill('Bob');
    }
    
    // Step 6: Take screenshot of filled form
    console.log('6. Taking screenshot of filled form...');
    await page.screenshot({ path: '/tmp/02-filled-form.png', fullPage: true });
    
    // Step 7: Click Start Game
    console.log('7. Clicking Start Game button...');
    const buttons = await page.$$('button');
    console.log(`Found ${buttons.length} buttons`);
    if (buttons.length > 0) {
      await buttons[0].click();
      await page.waitForTimeout(2000);
    }
    
    // Step 8: Take screenshot of game screen
    console.log('8. Taking screenshot of game screen with progress bar...');
    await page.screenshot({ path: '/tmp/03-game-screen.png', fullPage: true });
    
    // Step 9: Click through the game (10 times)
    console.log('9. Clicking through the game...');
    for (let i = 0; i < 10; i++) {
      const buttons = await page.$$('button');
      if (buttons.length > 0) {
        console.log(`  Click ${i + 1}/10...`);
        await buttons[0].click();
        await page.waitForTimeout(600);
      } else {
        console.log('  No more buttons found');
        break;
      }
    }
    
    // Step 10: Take screenshot of end screen
    console.log('10. Taking screenshot of end screen...');
    await page.screenshot({ path: '/tmp/04-end-screen.png', fullPage: true });
    
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();
