import { useEffect, useState, useRef } from "react";
import styles from "./StoryList.module.css";
import StoryViewer from "../StoryViewer/StoryViewer";

interface Story {
  id: number;
  image: string;
  alt: string;
  user: {
    name: string;
    avatar: string;
  };
}

const StoryList = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number | null>(null);
  const storyListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch("/stories.json")
      .then((res) => res.json())
      .then((data) => setStories(data))
      .catch((err) => console.error("Error loading stories:", err));
  }, []);

  const openStory = (index: number) => {
    setCurrentStoryIndex(index);
  };

  const closeStory = () => {
    setCurrentStoryIndex(null);
  };

  const nextStory = () => {
    if (currentStoryIndex !== null && currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      closeStory();
    }
  };

  const prevStory = () => {
    if (currentStoryIndex !== null && currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  return (
    <>
      <div id="storyList" className={styles.storyList} ref={storyListRef}>
        {stories.map((story, index) => (
          <div
            key={story.id}
            data-id={story.id}
            className={styles.storyItem}
            onClick={() => openStory(index)}
          >
            {/* ✅ Show User Avatar with Fallback & Instagram-style Border */}
            <img
              src={story.user.avatar || "/default-avatar.png"} // Fallback Image
              alt={story.user.name}
              className={`${styles.storyAvatar} ${
                currentStoryIndex === index ? styles.activeStory : ""
              }`}
            />
          </div>
        ))}
      </div>

      {/* ✅ StoryViewer Component (With Prevent Story Exit Fix) */}
      {currentStoryIndex !== null && (
        <div className={styles.storyOverlay} onClick={(e) => e.stopPropagation()}>
          <StoryViewer
            story={stories[currentStoryIndex]}
            onClose={closeStory}
            onNext={nextStory}
            onPrev={prevStory}
          />
        </div>
      )}
    </>
  );
};

export default StoryList;
