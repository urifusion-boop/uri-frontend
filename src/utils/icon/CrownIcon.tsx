const CrownIcon = ({ color, size }: { color?: string; size?: number }) => {
  return (
    <svg width={String(size) || '16'} height={String(size) || '16'} viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d_15015_13021)">
        <path
          d="M9.625 0.341797C9.92842 0.341918 10.2171 0.472841 10.417 0.701172L13.416 4.12891L16.3096 1.64844C16.6218 1.38091 17.0611 1.31955 17.4346 1.49121C17.808 1.663 18.0477 2.03623 18.0479 2.44727V8.76562C18.0477 9.88243 17.6042 10.9534 16.8145 11.7432C16.0245 12.533 14.9529 12.9766 13.8359 12.9766H5.41309C4.29608 12.9766 3.22441 12.533 2.43457 11.7432C1.64491 10.9534 1.20128 9.8824 1.20117 8.76562V2.44727C1.20132 2.03623 1.44099 1.663 1.81445 1.49121C2.18799 1.31951 2.6273 1.3809 2.93945 1.64844L5.83301 4.12891L8.83203 0.701172C9.03198 0.472693 9.3214 0.341797 9.625 0.341797Z"
          fill={color ?? '#FFD700'}
        />
      </g>
      <defs>
        <filter id="filter0_d_15015_13021" x="0.0562561" y="0.341797" width="19.1365" height="14.9246" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="1.14492" />
          <feGaussianBlur stdDeviation="0.572458" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_15015_13021" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_15015_13021" result="shape" />
        </filter>
      </defs>
    </svg>
  );
};

export default CrownIcon;
