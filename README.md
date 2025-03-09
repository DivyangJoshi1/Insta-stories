# Stage - Instagram Stories Feature

This project replicates the Instagram Stories feature in a modern web application. It allows users to view a series of stories, swipe between them, like them, and send messages. The project is built with React, TypeScript, and custom CSS Modules to ensure a modular and maintainable codebase.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [End-to-End Testing](#end-to-end-testing)
- [Deployment](#deployment)
- [License](#license)

## Features
- **Story List**: Displays a horizontally scrollable list of stories, each represented by a user's avatar.
- **Story Viewer**: Allows viewing of individual stories with forward and backward navigation.
- **Progress Bar**: Displays a progress bar indicating the elapsed time of the currently viewed story.
- **Like Stories**: Users can like or unlike stories, and the state is persisted in localStorage.
- **Messaging**: Users can send messages while viewing a story, and the viewer automatically pauses during typing.
- **Swipeable Interface**: Supports swipe gestures to navigate between stories.
- **Modular Styling**: Custom CSS Modules for scoped styles, keeping the project maintainable.
- **Story List and Viewer Separation**: Clear separation of the `StoryList` component (for showing all stories) and the `StoryViewer` component (for viewing an individual story).

## Tech Stack
- **React**: JavaScript library for building the user interface.
- **TypeScript**: Superset of JavaScript for adding type safety.
- **CSS Modules**: For scoped and reusable styles.
- **Cypress**: For end-to-end testing of the Instagram Stories feature.
- **LocalStorage**: For persisting the state of liked stories.
- **React Swipeable**: For handling swipe gestures in the StoryViewer component.
- **React Transition Group**: For smooth animations when transitioning between stories.

## Installation
To set up the project locally, follow the steps below:

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/classy-endeavors-stories.git
    ```

2. Navigate to the project directory:

    ```bash
    cd classy-endeavors-stories
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Start the development server:

    ```bash
    npm run dev
    ```

5. Open the application in your browser:
    Navigate to `http://localhost:3000` to view the app.

## Usage
- The **Story List** is displayed as a horizontally scrollable list of story items. Clicking on any story opens the **Story Viewer**.
- The **Story Viewer** automatically progresses through stories with a visible progress bar.
- You can swipe left or right to navigate between stories or use the next/previous buttons.
- Users can like a story, and this state will persist even after a page refresh using **localStorage**.
- While viewing a story, users can send a message. Typing pauses the story until the message is sent.

## End-to-End Testing
The Instagram Stories feature has been tested using **Cypress** to ensure the functionality works as expected. Below are the key test cases covered:

- **Empty State**: Verifies the UI displays an empty state when no stories are available.
- **Story List Rendering**: Ensures the story list is loaded correctly and visible on the page.
- **Story Items Rendering**: Checks that story items are dynamically fetched and displayed.
- **Opening a Story**: Verifies that clicking a story opens the StoryViewer overlay.
- **Unique Story IDs**: Ensures there are no duplicate stories in the list based on their IDs.
- **Story Validation**: Validates that each story has a visible image and username.
- **Mobile Responsiveness**: Confirms the app works well on a mobile screen, including horizontal scrolling and navigation buttons.
- **Auto Story Progression**: Tests that stories automatically progress after 5 seconds.
- **Navigation – Swipe Left (Previous Story)**: Verifies navigation to the previous story using the left button.
- **Navigation – Swipe Right (Next Story)**: Ensures the user can navigate to the next story using the right button.

These test cases help ensure the core functionality of the Instagram Stories feature is working across different scenarios and devices.

## Deployment
Information on deploying the app will be added once the deployment process is defined.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
