import { useEffect, useState, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import { CSSTransition } from "react-transition-group";
import styles from "./StoryViewer.module.css";

interface Story {
  id: number;
  image: string;
  alt: string;
  user: {
    name: string;
    avatar: string;
  };
}

interface StoryViewerProps {
  story: Story | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const StoryViewer = ({ story, onClose, onNext, onPrev }: StoryViewerProps) => {
  const [progress, setProgress] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [holdTimeout, setHoldTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [likedStories, setLikedStories] = useState<Record<number, boolean>>({});
  const [messages, setMessages] = useState<Record<number, string>>({});

  const storyNodeRef = useRef(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const isHoldingRef = useRef(false);

  // Load likes from localStorage when the component mounts
  useEffect(() => {
    const savedLikes = localStorage.getItem("likedStories");
    if (savedLikes) {
      setLikedStories(JSON.parse(savedLikes));
    }
  }, []);

  useEffect(() => {
    if (!story || isClosing) return;

    if (!isPaused) {
      setProgress((elapsedTime / 5000) * 100);
    }

    startTimeRef.current = Date.now();

    let interval = setInterval(() => {
      if (!isPaused) {
        setProgress((prev) => Math.min(prev + (100 / 5000) * 100, 100));
      }
    }, 100);

    timerRef.current = setTimeout(() => {
      if (!isPaused) {
        onNext();
        // Check if it's the last story and then call onClose
        if (story.id === 10) {
          onClose(); // Close the viewer
        }
      }
    }, 5000 - elapsedTime);

    return () => {
      clearInterval(interval);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [story, onNext, isPaused, elapsedTime]);

  if (!story) return null;

  const handlers = useSwipeable({
    onSwipedLeft: () => resetAndNext(),
    onSwipedRight: () => resetAndPrev(),
    trackTouch: true,
    trackMouse: false,
    preventScrollOnSwipe: true,
  });

  const resetAndNext = () => {
    setIsPaused(false);
    setElapsedTime(0);
    setProgress(0);
    onNext();
  };

  const resetAndPrev = () => {
    setIsPaused(false);
    setElapsedTime(0);
    setProgress(0);
    onPrev();
  };

  const handleHoldStart = () => {
    if (holdTimeout) clearTimeout(holdTimeout);
    isHoldingRef.current = true;

    const timeout = setTimeout(() => {
      if (isHoldingRef.current) {
        setIsPaused(true);
        if (timerRef.current) clearTimeout(timerRef.current);

        if (startTimeRef.current) {
          const pausedTime = Date.now() - startTimeRef.current;
          setElapsedTime(pausedTime);
        }
      }
    }, 200);

    setHoldTimeout(timeout);
  };

  const handleHoldEnd = (e: React.MouseEvent | React.TouchEvent) => {
    isHoldingRef.current = false;
  
    if (holdTimeout) {
      clearTimeout(holdTimeout);
      setHoldTimeout(null);
    }
  
    if (isPaused) {
      setTimeout(() => {
        if (!isHoldingRef.current) {
          setIsPaused(false);
          startTimeRef.current = Date.now();
        }
      }, 50);
    } else {
      let clientX: number;
      if ("touches" in e) {
        // Handle touch event
        clientX = e.touches[0]?.clientX ?? 0; // Fallback to 0 if clientX is undefined
      } else {
        // Handle mouse event
        clientX = e.clientX;
      }
  
      const screenWidth = window.innerWidth;
      if (clientX < screenWidth / 2) {
        resetAndPrev();
      } else {
        resetAndNext();
      }
    }
  };
  

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClosing(true);
    setProgress(0);
    onClose();
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (story) {
      setLikedStories((prev) => {
        const updatedLikes = { ...prev, [story.id]: !prev[story.id] };
        localStorage.setItem("likedStories", JSON.stringify(updatedLikes));
        return updatedLikes;
      });
    }
  };

  return (
    <div data-testid="story-viewer" {...handlers} className={styles.overlay} onClick={handleClose}>
      <div className={styles.progressBarContainer}>
        <div
          className={styles.progressBar}
          style={{ width: `${progress}%`, transition: isPaused ? "none" : "width 0.1s linear" }}
        ></div>
      </div>

      <button
        className={styles.closeButton}
        onClick={(e) => {
          e.stopPropagation();
          handleClose(e);
        }}
      >
        ✖
      </button>

      <div className={styles.userInfo}>
        <img src={story.user.avatar} alt={story.user.name} className={styles.avatar} />
        <span className={styles.username}>{story.user.name}</span>
      </div>

      <CSSTransition
        key={story.id}
        in={!!story}
        timeout={400}
        classNames={{
          enter: styles["story-enter"],
          enterActive: styles["story-enter-active"],
          exit: styles["story-exit"],
          exitActive: styles["story-exit-active"],
        }}
        nodeRef={storyNodeRef}
        appear
        unmountOnExit
      >
        <div
          ref={storyNodeRef}
          className={styles.storyContainer}
          onMouseDown={handleHoldStart}
          onMouseUp={handleHoldEnd}
          onTouchStart={handleHoldStart}
          onTouchEnd={handleHoldEnd}
        >
          <img src={story.image} alt={story.alt} className={styles.storyImage} />
          <div className={styles.controls}>
            <div className={styles.left} onClick={(e) => { e.stopPropagation(); resetAndPrev(); }} />
            <div className={styles.right} onClick={(e) => { e.stopPropagation(); resetAndNext(); }} />
          </div>
        </div>
      </CSSTransition>

      <button className={styles.likeButton} onClick={handleLikeClick}>
        {likedStories[story.id] ? "❤️" : "🤍"}
      </button>

      <div className={styles.messageContainer}>
        <input
          type="text"
          className={styles.messageInput}
          placeholder="Send Message..."
          value={messages[story.id] || ""}
          onChange={(e) => {
            setMessages((prev) => ({
              ...prev,
              [story.id]: e.target.value,
            }));
            if (!isPaused) {
              setIsPaused(true); // Pause story when typing
              setElapsedTime((prev) => prev + (Date.now() - (startTimeRef.current || Date.now())));
            }
          }}
          onClick={(e) => e.stopPropagation()} // Prevents story exit when typing
        />
        <button
          className={styles.sendButton}
          onClick={(e) => {
            e.stopPropagation(); // Prevents story exit
            setMessages((prev) => ({
              ...prev,
              [story.id]: "",
            }));

            // Resume story exactly from where it left off
            setIsPaused(false);
            startTimeRef.current = Date.now();
          }}
        >
          📨
        </button>
      </div>
    </div>
  );
};

export default StoryViewer;
