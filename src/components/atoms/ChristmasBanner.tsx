import React, { useEffect, useRef, useState } from "react";

const images = [
  "https://res.cloudinary.com/df8ckaeam/image/upload/v1703501636/christmas-image-2_g4g4tb.png",
  "https://res.cloudinary.com/df8ckaeam/image/upload/v1703501633/christmas-image-4_eqa35n.png",
  "https://res.cloudinary.com/df8ckaeam/image/upload/v1703501618/christmas-image-1_b1xk8w.png",
];

const ChristmasBanner = () => {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to reset the timeout
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Effect for managing automatic slide changes
  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    // Cleanup on unmount or before re-running the effect
    return () => resetTimeout();
  }, [index]);

  return (
    <>
      {/* Background GIF */}
      <div
        style={{
          backgroundImage:
            "url(https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZHNzeXFpNTU5Nm8zMDNqZmp0NDF0dG5vMmg0cXJncW5xeDUxYmo2MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/Kfrq2V2A7wODGMdEXQ/giphy.gif)",
          backgroundSize: "cover",
          pointerEvents: "none",
          width: "100%",
          height: "100%",
          position: "fixed",
          top: "0px",
          left: "0px",
        }}
      ></div>

      {/* Slideshow */}
      <div className="slideshow">
        <div
          className="slideshowSlider"
          style={{
            transform: `translate3d(0, ${-index * (100 / images.length)}%, 0)`,
          }}
        >
          {images.map((image, idx) => (
            <div
              className="slide"
              key={idx}
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
          ))}
        </div>

        {/* Slideshow CSS */}
        <style jsx>{`
          .slideshow {
            margin: 0 auto;
            overflow: hidden;
            width: 100%;
            height: 300px;
            border-radius: 20px;
          }

          .slideshowSlider {
            white-space: nowrap;
            transition: ease 1000ms;
          }

          .slide {
            display: block;
            height: 300px;
            width: 100%;
          }
        `}</style>
      </div>
    </>
  );
};

export default ChristmasBanner;
