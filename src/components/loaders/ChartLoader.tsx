import React, { useState, useEffect } from "react";

const quotes = [
  { text: "Data is the new oil.", author: "Clive Humby" },
  {
    text: "In God we trust. All others must bring data.",
    author: "W. Edwards Deming",
  },
  {
    text: "Without data, you’re just another person with an opinion.",
    author: "W. Edwards Deming",
  },
  {
    text: "Big data is at the foundation of all the megatrends that are happening.",
    author: "Chris Lynch",
  },
  {
    text: "You can have data without information, but you cannot have information without data.",
    author: "Daniel Keys Moran",
  },
];

const ChartLoader: React.FC = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Update the quote every 4 seconds
  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 4000); // Change quote every 4 seconds

    return () => clearInterval(quoteTimer); // Cleanup on unmount
  }, []);

  return (
    <>
      <div className="loader-container">
        <div className="loading">
          <div className="loading1"></div>
          <div className="loading2"></div>
          <div className="loading3"></div>
          <div className="loading4"></div>
        </div>

        {/* Rotating Quotes */}
        <div className="quote-container">
          <blockquote>
            &quot;{quotes[quoteIndex].text}&quot;
            <footer>— {quotes[quoteIndex].author}</footer>
          </blockquote>
        </div>
      </div>

      <style jsx>{`
        .loader-container {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          color: #fff;
        }

        .loading {
          position: fixed;
          top: 50%;
          left: 50%;
          height: 120px;
          width: 160px;
          margin-top: -50px;
          margin-left: -70px;
          padding: 10px;
          border-left: 1px solid #fff;
          border-bottom: 1px solid #fff;
          box-sizing: border-box;
        }

        @keyframes loading {
          0% {
            background-color: #cd0a00;
          }
          30% {
            background-color: #fa8a00;
          }
          50% {
            height: 100px;
            margin-top: 0px;
          }
          80% {
            background-color: #91d700;
          }
          100% {
            background-color: #cd0a00;
          }
        }

        .loading1,
        .loading2,
        .loading3,
        .loading4 {
          height: 10px;
          width: 30px;
          background-color: #fff;
          display: inline-block;
          margin-top: 90px;
          animation: loading 2.5s infinite;
          border-top-left-radius: 2px;
          border-top-right-radius: 2px;
        }

        .loading1 {
          animation-delay: 0.25s;
        }
        .loading2 {
          animation-delay: 0.5s;
        }
        .loading3 {
          animation-delay: 0.75s;
        }
        .loading4 {
          animation-delay: 1s;
        }

        .quote-container {
          margin-top: 220px; /* Increased margin to prevent intersection */
          font-size: 1.2rem;
          line-height: 1.4;
          color: #000; /* Changed color to black */
        }

        blockquote {
          font-style: italic;
        }

        footer {
          margin-top: 0.5rem;
          font-size: 0.9rem;
          color: #cd1b78;
        }

        /* Add a fade-in transition for the quotes */
        blockquote {
          opacity: 0;
          animation: fadeIn 1s ease-in-out forwards;
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default ChartLoader;
