// // components/SkeletonLoader.tsx

import useCustomTheme from "../../hooks/theme.hook";

// import React from 'react';
// import Skeleton from 'react-loading-skeleton';
// import 'react-loading-skeleton/dist/skeleton.css';
// import Spinner from './Spinner';

// const SkeletonLoader = () => {
//   return (
//     <>
//       {/* <Skeleton count={35} /> */}
//       {/* <Spinner color={'black'}/> */}
//       {/* Loading Spinner */}
//       <body className="loader-body">
//     <div id="loading-spinner">
//         <div className="spinner outer">
//             <div className="spinner inner">
//                 <div className="spinner eye">
//                 </div>
//             </div>
//         </div>
//     </div>
// </body>

//     </>
//   );
// };

// export default SkeletonLoader;

//Animated Loading Spinner
// const SkeletonLoader = () => {
//     return (
//       <div className="loader-body">
//         <div id="loading-spinner">
//           <div className="spinner outer">
//             <div className="spinner inner">
//               <div className="spinner eye"></div>
//             </div>
//           </div>
//         </div>

//         <style jsx>{`
//           .loader-body {
//             background: #fff;
//             height: 100vh;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//           }

//           #loading-spinner {
//             position: absolute;
//             top: 50%;
//             left: 50%;
//             transform: translate(-50%, -50%);
//           }

//           .spinner {
//             border-radius: 50%;
//             box-sizing: border-box;
//             position: absolute;
//             top: 50%;
//             left: 50%;
//             transform: translate(-50%, -50%);
//           }

//           .outer {
//             border: 5px solid #fff;
//             width: 90px;
//             height: 90px;
//             margin: -45px;
//             -webkit-animation: outer-spin 3s linear infinite;
//             animation: outer-spin 3s linear infinite;
//           }

//           .inner {
//             border-top: 5px solid #f00;
//             border-bottom: 5px solid #f00;
//             width: 70px;
//             height: 70px;
//             margin: -35px;
//             -webkit-animation: inner-spin 3s linear infinite;
//             animation: inner-spin 3s linear infinite;
//           }

//           .eye {
//             width: 50px;
//             height: 50px;
//             background-color: #f00;
//             animation: eye-flash 3s infinite;
//           }

//           @-webkit-keyframes inner-spin {
//             0% { -webkit-transform: rotate(0deg); }
//             100% { -webkit-transform: rotate(360deg); }
//           }

//           @keyframes inner-spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }

//           @-webkit-keyframes outer-spin {
//             0% { -webkit-transform: rotate(0deg); }
//             100% { -webkit-transform: rotate(-180deg); }
//           }

//           @keyframes outer-spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(-180deg); }
//           }

//           @keyframes eye-flash {
//             0%, 100% { background-color: #f00; }
//             50% { background-color: #fff; }
//           }
//         `}</style>
//       </div>
//     );
//   };

// export default SkeletonLoader;

interface IProps {
  height?: string;
  background?: string;
}

const SkeletonLoader: React.FC<IProps> = ({ height, background }) => {
  const { themeColors } = useCustomTheme();

  return (
    <div className="loader-body">
      <div id="loading-spinner">
        <div className="spinner outer">
          <div className="spinner inner">
            <div className="spinner eye"></div>
          </div>
        </div>
        <div className="uri-text">URI</div>
      </div>

      <style jsx>{`
        .loader-body {
          background: ${background ?? themeColors.background};
          height: ${height ?? "100vh"};
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        #loading-spinner {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .spinner {
          border-radius: 50%;
          box-sizing: border-box;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .outer {
          border: 8px solid ${themeColors.background}; /* Increased border size */
          width: 120px; /* Increased width */
          height: 120px; /* Increased height */
          margin: -60px; /* Adjusted margin */
          animation: outer-spin 3s linear infinite;
        }

        .inner {
          border-top: 8px solid ${themeColors.primary}; /* Increased border size */
          border-bottom: 8px solid ${themeColors.primary}; /* Increased border size */
          width: 100px; /* Increased width */
          height: 100px; /* Increased height */
          margin: -50px; /* Adjusted margin */
          animation: inner-spin 3s linear infinite;
        }

        .eye {
          width: 70px; /* Increased width */
          height: 70px; /* Increased height */
          background-color: #f00;
          animation: eye-flash 3s infinite;
        }

        .uri-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: ${themeColors.primary};
          font-size: 20px;
          z-index: 10;
        }

        @-webkit-keyframes inner-spin {
          0% {
            -webkit-transform: rotate(0deg);
          }
          100% {
            -webkit-transform: rotate(360deg);
          }
        }

        @keyframes inner-spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @-webkit-keyframes outer-spin {
          0% {
            -webkit-transform: rotate(0deg);
          }
          100% {
            -webkit-transform: rotate(-180deg);
          }
        }

        @keyframes outer-spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(-180deg);
          }
        }

        @keyframes eye-flash {
          0%,
          100% {
            background-color: ${themeColors.primary}40;
          }
          50% {
            background-color: ${themeColors.primary};
          }
        }
      `}</style>
    </div>
  );
};

export default SkeletonLoader;
