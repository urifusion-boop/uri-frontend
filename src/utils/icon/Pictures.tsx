const Pictures = ({ color, size }: { color: string; size: number }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={String(size)} height={String(size)} viewBox="0 0 49 48" fill="none">
      <path
        d="M18.4219 43.998H30.4219C40.4219 43.998 44.4219 39.998 44.4219 29.998V17.998C44.4219 7.99805 40.4219 3.99805 30.4219 3.99805H18.4219C8.42187 3.99805 4.42188 7.99805 4.42188 17.998V29.998C4.42188 39.998 8.42187 43.998 18.4219 43.998Z"
        stroke={color}
        stroke-width="4.01926"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M18.4238 19.998C20.633 19.998 22.4238 18.2072 22.4238 15.998C22.4238 13.7889 20.633 11.998 18.4238 11.998C16.2147 11.998 14.4238 13.7889 14.4238 15.998C14.4238 18.2072 16.2147 19.998 18.4238 19.998Z"
        stroke={color}
        stroke-width="4.01926"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M5.76172 37.8962L15.6217 31.2762C17.2017 30.2162 19.4817 30.3362 20.9017 31.5562L21.5617 32.1362C23.1217 33.4762 25.6417 33.4762 27.2017 32.1362L35.5217 24.9962C37.0817 23.6562 39.6017 23.6562 41.1617 24.9962L44.4217 27.7962"
        stroke={color}
        stroke-width="4.01926"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default Pictures;
