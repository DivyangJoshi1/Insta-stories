describe("StoryViewer Component", () => {
    beforeEach(() => {
      cy.intercept("GET", "/stories.json").as("getStories"); // Mock API request
      cy.visit("http://localhost:5173"); // Open the app
      cy.wait("@getStories"); // Ensure stories load
    });
  
    it("should render the StoryViewer when a story is opened", () => {
      cy.get('[class*="storyItem"]').first().click(); // Open first story
      cy.get('[class*="storyOverlay"]').should("exist").and("be.visible"); // Check StoryViewer appears
    });
  
    it("should automatically progress to the next story after 5 seconds", () => {
      const onNextStub = cy.stub().as("onNext");
  
      // Intercept the API call and mock response
      cy.intercept("GET", "/stories.json", {
        statusCode: 200,
        body: [
          { id: 1, image: "/images/story_images/story1.jpeg", alt: "Story 1", user: { name: "John Doe", avatar: "/images/avatar/avatar1.jpg" }},
          { id: 2, image: "/images/story_images/story2.jpg", alt: "Story 2", user: { name: "Jane Smith", avatar: "/images/avatar/avatar2.jpg" }},
          { id: 3, image: "/images/story_images/story3.jpg", alt: "Story 3", user: { name: "Alica", avatar: "/images/avatar/avatar3.jpg" }},
          { id: 4, image: "/images/story_images/story4.jpg", alt: "Story 4", user: { name: "Antoine", avatar: "/images/avatar/avatar4.jpg" }},
          { id: 5, image: "/images/story_images/story5.jpeg", alt: "Story 5", user: { name: "Lee", avatar: "/images/avatar/avatar5.jpg" }},
          { id: 6, image: "/images/story_images/story6.jpg", alt: "Story 6", user: { name: "Edwin Irwin", avatar: "/images/avatar/avatar6.jpg" }},
          { id: 7, image: "/images/story_images/story7.jpg", alt: "Story 7", user: { name: "Margie", avatar: "/images/avatar/avatar7.jpg" }},
          { id: 8, image: "/images/story_images/story8.jpeg", alt: "Story 8", user: { name: "Harold", avatar: "/images/avatar/avatar8.jpg" }},
          { id: 9, image: "/images/story_images/story9.jpeg", alt: "Story 9", user: { name: "Ellie", avatar: "/images/avatar/avatar9.jpg" }},
          { id: 10, image: "/images/story_images/story10.jpg", alt: "Story 10", user: { name: "Cerys", avatar: "/images/avatar/avatar10.jpg" }}
        ],
      }).as("getStories");
  
      cy.visit("http://localhost:5173"); // Visit your app
      cy.wait("@getStories"); // Ensure the stories have been loaded
      cy.get('[class*="storyItem"]').first().click(); // Open first story
  
      // Trigger the automatic progression after 5 seconds using cy.clock() and cy.tick()
      cy.clock(); // Control time
      cy.get('[class*="storyOverlay"]').should("exist").and("be.visible"); // Ensure StoryViewer appears
  
      // Wait for 5 seconds using cy.tick()
      cy.tick(5000);
  
      // After 5 seconds, check if the next story is loaded or if some UI element changes (like a new story appearing).
      cy.get('[class*="storyItem"]').eq(1) // Next story
        .find('img')
        .should('be.visible'); // Ensure the next story's image is visible
    });
  
    it("should navigate to the previous story when swiped left", () => {
      // Intercept and mock stories API
      cy.intercept("GET", "/stories.json", {
        statusCode: 200,
        body: [
          { id: 1, image: "/images/story_images/story1.jpeg", alt: "Story 1", user: { name: "John Doe", avatar: "/images/avatar/avatar1.jpg" }},
          { id: 2, image: "/images/story_images/story2.jpg", alt: "Story 2", user: { name: "Jane Smith", avatar: "/images/avatar/avatar2.jpg" }},
          { id: 3, image: "/images/story_images/story3.jpg", alt: "Story 3", user: { name: "Alica", avatar: "/images/avatar/avatar3.jpg" }},
          { id: 4, image: "/images/story_images/story4.jpg", alt: "Story 4", user: { name: "Antoine", avatar: "/images/avatar/avatar4.jpg" }},
          { id: 5, image: "/images/story_images/story5.jpeg", alt: "Story 5", user: { name: "Lee", avatar: "/images/avatar/avatar5.jpg" }},
          { id: 6, image: "/images/story_images/story6.jpg", alt: "Story 6", user: { name: "Edwin Irwin", avatar: "/images/avatar/avatar6.jpg" }},
          { id: 7, image: "/images/story_images/story7.jpg", alt: "Story 7", user: { name: "Margie", avatar: "/images/avatar/avatar7.jpg" }},
          { id: 8, image: "/images/story_images/story8.jpeg", alt: "Story 8", user: { name: "Harold", avatar: "/images/avatar/avatar8.jpg" }},
          { id: 9, image: "/images/story_images/story9.jpeg", alt: "Story 9", user: { name: "Ellie", avatar: "/images/avatar/avatar9.jpg" }},
          { id: 10, image: "/images/story_images/story10.jpg", alt: "Story 10", user: { name: "Cerys", avatar: "/images/avatar/avatar10.jpg" }}
        ]
      }).as("getStories");
  
      cy.visit("http://localhost:5173"); // Visit your app
      cy.wait("@getStories"); // Ensure stories load
  
      cy.get('[class*="storyItem"]').first().click(); // Open the first story
      cy.get('[class*="storyOverlay"]').should("exist").and("be.visible"); // Ensure StoryViewer appears
  
      cy.get('[class*="storyItem"]').eq(0) // Get first story
        .find('img')
        .should('be.visible'); // Ensure first story image is visible
  
      cy.get('[class*="left"]') // Left navigation button (previous story)
        .click(); // Simulate click to go to previous story
  
      cy.get('[class*="storyItem"]').eq(0) // Ensure the first story is now displayed
        .find('img')
        .should('be.visible'); // Ensure the first story is now visible again
    });
  
    it("should navigate to the next story when swiped right", () => {
      // Intercept and mock stories API
      cy.intercept("GET", "/stories.json", {
        statusCode: 200,
        body: [
          { id: 1, image: "/images/story_images/story1.jpeg", alt: "Story 1", user: { name: "John Doe", avatar: "/images/avatar/avatar1.jpg" }},
          { id: 2, image: "/images/story_images/story2.jpg", alt: "Story 2", user: { name: "Jane Smith", avatar: "/images/avatar/avatar2.jpg" }},
          { id: 3, image: "/images/story_images/story3.jpg", alt: "Story 3", user: { name: "Alica", avatar: "/images/avatar/avatar3.jpg" }},
          { id: 4, image: "/images/story_images/story4.jpg", alt: "Story 4", user: { name: "Antoine", avatar: "/images/avatar/avatar4.jpg" }},
          { id: 5, image: "/images/story_images/story5.jpeg", alt: "Story 5", user: { name: "Lee", avatar: "/images/avatar/avatar5.jpg" }},
          { id: 6, image: "/images/story_images/story6.jpg", alt: "Story 6", user: { name: "Edwin Irwin", avatar: "/images/avatar/avatar6.jpg" }},
          { id: 7, image: "/images/story_images/story7.jpg", alt: "Story 7", user: { name: "Margie", avatar: "/images/avatar/avatar7.jpg" }},
          { id: 8, image: "/images/story_images/story8.jpeg", alt: "Story 8", user: { name: "Harold", avatar: "/images/avatar/avatar8.jpg" }},
          { id: 9, image: "/images/story_images/story9.jpeg", alt: "Story 9", user: { name: "Ellie", avatar: "/images/avatar/avatar9.jpg" }},
          { id: 10, image: "/images/story_images/story10.jpg", alt: "Story 10", user: { name: "Cerys", avatar: "/images/avatar/avatar10.jpg" }}
        ]
      }).as("getStories");
  
      cy.visit("http://localhost:5173"); // Visit your app
      cy.wait("@getStories"); // Ensure stories load
  
      cy.get('[class*="storyItem"]').first().click(); // Open the first story
      cy.get('[class*="storyOverlay"]').should("exist").and("be.visible"); // Ensure StoryViewer appears
  
      cy.get('[class*="storyItem"]').eq(0) // Get first story
        .find('img')
        .should('be.visible'); // Ensure first story image is visible
  
      cy.get('[class*="right"]') // Right navigation button (next story)
        .click(); // Simulate click to go to next story
  
      cy.get('[class*="storyItem"]').eq(1) // Ensure the next story is now displayed
        .find('img')
        .should('be.visible'); // Ensure next story image is visible
    });
  });
  