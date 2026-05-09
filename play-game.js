const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Navigate to the app
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    // Wait for page to load
    await page.waitForTimeout(2000);
    console.log('Page loaded - initial state');
    
    // Take initial screenshot
    await page.screenshot({ path: '/home/runner/work/date-game/date-game/screenshots/01-initial.png' });
    console.log('✓ Screenshot: Initial screen');
    
    // Fill in game code, player 1, player 2
    console.log('\nFilling in form...');
    const inputs = await page.locator('input').all();
    
    if (inputs.length >= 3) {
      await inputs[0].fill('TESTGAME');
      console.log('✓ Game code: TESTGAME');
      
      await inputs[1].fill('Alice');
      console.log('✓ Player 1: Alice');
      
      await inputs[2].fill('Bob');
      console.log('✓ Player 2: Bob');
      
      // Trigger change/blur events to validate form
      await page.evaluate(() => {
        const inputs = document.querySelectorAll('input');
        inputs.forEach(inp => {
          inp.dispatchEvent(new Event('change', { bubbles: true }));
          inp.dispatchEvent(new Event('input', { bubbles: true }));
          inp.dispatchEvent(new Event('blur', { bubbles: true }));
        });
      });
      
      await page.waitForTimeout(500);
    }
    
    // Take screenshot after filling form
    await page.screenshot({ path: '/home/runner/work/date-game/date-game/screenshots/02-form-filled.png' });
    console.log('✓ Screenshot: Form filled');
    
    // Click Start Game button
    console.log('\nStarting game...');
    const startButton = await page.locator('button').first();
    await startButton.click();
    console.log('✓ Clicked Start Game');
    
    // Wait for game to load
    await page.waitForTimeout(2000);
    
    // Take screenshot after starting game
    await page.screenshot({ path: '/home/runner/work/date-game/date-game/screenshots/03-game-started.png' });
    console.log('✓ Screenshot: Game started');
    
    // Play 7 challenges
    for (let i = 1; i <= 7; i++) {
      console.log(`\n--- Challenge ${i} ---`);
      
      // Wait for challenge to appear
      await page.waitForTimeout(800);
      
      // Get all buttons
      const allButtons = await page.locator('button').all();
      console.log(`Found ${allButtons.length} buttons`);
      
      // Find and click reveal/show button if exists
      for (const btn of allButtons) {
        const text = await btn.textContent();
        if (text.toLowerCase().includes('reveal') || text.toLowerCase().includes('show')) {
          console.log(`✓ Found reveal button, clicking...`);
          await btn.click();
          await page.waitForTimeout(800);
          break;
        }
      }
      
      // Take screenshot of revealed challenge
      await page.screenshot({ path: `/home/runner/work/date-game/date-game/screenshots/04-challenge-${i}-revealed.png` });
      console.log(`✓ Screenshot: Challenge ${i} revealed`);
      
      // Find and click "Alice wins point" button
      console.log(`Looking for Alice wins button...`);
      const buttonsAfterReveal = await page.locator('button').all();
      let aliceClicked = false;
      
      for (const btn of buttonsAfterReveal) {
        const text = await btn.textContent();
        if (text.includes('Alice') && text.includes('wins')) {
          console.log(`✓ Found "${text.trim()}" button, clicking...`);
          await btn.click();
          aliceClicked = true;
          break;
        }
      }
      
      if (!aliceClicked) {
        console.log('⚠ Could not find Alice wins button');
      }
      
      await page.waitForTimeout(800);
      
      // Take screenshot after Alice wins
      await page.screenshot({ path: `/home/runner/work/date-game/date-game/screenshots/04b-challenge-${i}-alice-wins.png` });
      console.log(`✓ Screenshot: Alice wins registered`);
      
      // Find and click "Next challenge" button (except on last challenge)
      if (i < 7) {
        console.log(`Looking for Next challenge button...`);
        const buttonsAfterPoint = await page.locator('button').all();
        let nextClicked = false;
        
        for (const btn of buttonsAfterPoint) {
          const text = await btn.textContent();
          if (text.toLowerCase().includes('next')) {
            console.log(`✓ Found "${text.trim()}" button, clicking...`);
            await btn.click();
            nextClicked = true;
            break;
          }
        }
        
        if (!nextClicked) {
          console.log('⚠ Could not find Next challenge button');
        }
        
        await page.waitForTimeout(1000);
        console.log(`✓ Challenge ${i} complete`);
      }
    }
    
    // After 7 challenges, wait for end screen
    console.log('\n--- Waiting for end screen ---');
    await page.waitForTimeout(2000);
    
    // Take final screenshot - end screen (full page)
    await page.screenshot({ path: '/home/runner/work/date-game/date-game/screenshots/05-end-screen.png', fullPage: true });
    console.log('✓ Screenshot: End screen (full page)');
    
    // Take another viewport screenshot
    await page.screenshot({ path: '/home/runner/work/date-game/date-game/screenshots/06-end-screen-viewport.png' });
    console.log('✓ Screenshot: End screen (viewport)');
    
    // Get end screen content
    const endScreenContent = await page.evaluate(() => {
      return {
        title: document.querySelector('h1, h2, h3')?.textContent,
        allText: document.body.innerText.substring(0, 800),
        buttons: Array.from(document.querySelectorAll('button')).map(b => b.textContent.trim()),
        winner: document.body.innerText.includes('Alice') ? 'Alice' : (document.body.innerText.includes('Bob') ? 'Bob' : 'Unknown')
      };
    });
    
    console.log('\nEnd screen content:');
    console.log(JSON.stringify(endScreenContent, null, 2));
    
    console.log('\n✅ Game completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    
    // Take error screenshot
    try {
      await page.screenshot({ path: '/home/runner/work/date-game/date-game/screenshots/error.png' });
      console.log('Error screenshot saved');
    } catch (e) {
      console.error('Could not save error screenshot');
    }
  } finally {
    await browser.close();
  }
})();
