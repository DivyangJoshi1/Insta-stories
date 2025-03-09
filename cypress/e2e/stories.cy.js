describe("Instagram Stories Feature", () => {
    beforeEach(() => {
      cy.intercept("GET", "/stories.json").as("getStories"); // Intercept API request
      cy.visit("http://localhost:5173");
      cy.wait("@getStories"); // Ensure data is fetched before running tests
    });
  
    it("should show an empty state when no stories are available", () => {
      cy.intercept("GET", "/stories.json", []).as("getEmptyStories"); // Mock empty stories
      cy.reload();
      cy.wait("@getEmptyStories");
  
      cy.get("#storyList").should("exist").and("be.visible"); // Ensure story list is still there
      cy.get('[class*="storyItem"]').should("have.length", 0); // Should have no stories
    });
  
    it("should load the stories section", () => {
      cy.get("#storyList").should("exist").and("be.visible"); // Ensure storyList exists
    });
  
    it("should render story items after fetching data", () => {
      cy.get("#storyList")
        .should("exist") // Ensure list is present
        .find('[class*="storyItem"]') // Match the dynamically generated class from CSS Modules
        .should("have.length.greaterThan", 0); // Ensure stories exist
    });
  
    it("should open a story when clicked", () => {
      cy.get('[class*="storyItem"]').first().click(); // Click first story item
  
      cy.get('[class*="storyOverlay"]') // Ensure overlay exists first
        .should("exist")
        .and("be.visible"); // Then check if it's visible
    });
  
    it("should not show duplicate stories", () => {
      const seenStories = new Set(); // Store seen story IDs
  
      cy.get("#storyList")
        .find('[class*="storyItem"]')
        .each(($story) => {
          const storyId = $story.attr("data-id"); // ✅ Ensure `data-id` exists
  
          // ✅ Debugging log (remove this later)
          cy.log("Checking story ID:", storyId);
  
          expect(storyId).to.not.be.undefined; // Ensure ID exists
          expect(seenStories).to.not.include(storyId); // Ensure it's unique
  
          seenStories.add(storyId); // Store ID
        });
    });
  
    it("should ensure each story has a valid image and username", () => {
      cy.get("#storyList") // Ensure story list exists
        .find('[class*="storyItem"]') // Get all stories
        .each(($el) => {
          // Ensure image exists and is not broken
          cy.wrap($el)
            .find("img")
            .should("exist")
            .and("be.visible")
            .and(($img) => {
              expect($img[0].naturalWidth).to.be.greaterThan(0); // Ensure image is loaded
            });
  
          // Ensure username is displayed
          cy.wrap($el)
            .find("img")
            .should("have.attr", "alt")
            .and("not.be.empty"); // Username should not be empty
        });
    });
  
    it("should render correctly in a mobile-sized viewport", () => {
      // Set the viewport to a mobile-sized screen (iPhone 6/7/8 dimensions: 375x667)
      cy.viewport(375, 667);
  
      // Visit the app
      cy.visit("http://localhost:5173");
  
      // Ensure the story list is visible
      cy.get("#storyList").should("be.visible");
  
      // Ensure the stories are horizontally scrollable (for mobile devices)
      cy.get("#storyList").should("have.css", "overflow-x", "auto");
  
      // Ensure that the first story is visible in the list
      cy.get('[class*="storyItem"]').first().should("be.visible");
  
      // Check if the left navigation button is visible (ensure it appears after the first story is clicked)
      cy.get('[class*="storyItem"]').first().click(); // Open the first story
  
      // Wait for the story overlay to appear before checking navigation buttons
      cy.get('[class*="storyOverlay"]').should("exist").and("be.visible");
  
      // Now check for the left navigation button, adding an explicit wait if needed
      cy.get('[class*="left"]', { timeout: 6000 }) // Increase the timeout if the button takes time to appear
        .should("be.visible"); // Ensure the left navigation button is visible
  
      // Similarly, check for the right navigation button
      cy.get('[class*="right"]', { timeout: 6000 }) // Increase the timeout if needed
        .should("be.visible"); // Ensure the right navigation button is visible
    });
  });
  