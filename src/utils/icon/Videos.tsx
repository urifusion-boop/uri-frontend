const Videos = ({ color, size }: { color: string; size: number }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={String(size)} height={String(size)} viewBox="0 0 48 48" fill="none">
      <path d="M18 44H30C40 44 44 40 44 30V18C44 8 40 4 30 4H18C8 4 4 8 4 18V30C4 40 8 44 18 44Z" stroke={color} stroke-width="4.01926" stroke-linecap="round" stroke-linejoin="round" />
      <path
        d="M18.1992 23.998V21.038C18.1992 17.218 20.8992 15.678 24.1992 17.578L26.7592 19.058L29.3192 20.538C32.6192 22.438 32.6192 25.558 29.3192 27.458L26.7592 28.938L24.1992 30.418C20.8992 32.318 18.1992 30.758 18.1992 26.958V23.998Z"
        stroke={color}
        stroke-width="4.01926"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default Videos;
