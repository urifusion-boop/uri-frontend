const Portfolio = ({ color, size }: { color: string; size: number }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={String(size)} height={String(size)} viewBox="0 0 49 48" fill="none">
      <path
        d="M16.7848 43.998H32.7848C40.8248 43.998 42.2648 40.778 42.6848 36.858L44.1848 20.858C44.7248 15.978 43.3248 11.998 34.7848 11.998H14.7848C6.24481 11.998 4.84481 15.978 5.38481 20.858L6.88481 36.858C7.30481 40.778 8.74481 43.998 16.7848 43.998Z"
        stroke={color}
        stroke-width="4.01926"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M16.7832 11.998V10.398C16.7832 6.85805 16.7832 3.99805 23.1832 3.99805H26.3832C32.7832 3.99805 32.7832 6.85805 32.7832 10.398V11.998"
        stroke={color}
        stroke-width="4.01926"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M28.7832 25.998V27.998C28.7832 28.018 28.7832 28.018 28.7832 28.038C28.7832 30.218 28.7632 31.998 24.7832 31.998C20.8232 31.998 20.7832 30.238 20.7832 28.058V25.998C20.7832 23.998 20.7832 23.998 22.7832 23.998H26.7832C28.7832 23.998 28.7832 23.998 28.7832 25.998Z"
        stroke={color}
        stroke-width="4.01926"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path d="M44.0832 21.998C39.4632 25.358 34.1832 27.358 28.7832 28.038" stroke={color} stroke-width="4.01926" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M6.02148 22.5381C10.5215 25.6181 15.6015 27.4781 20.7815 28.0581" stroke={color} stroke-width="4.01926" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
};

export default Portfolio;
