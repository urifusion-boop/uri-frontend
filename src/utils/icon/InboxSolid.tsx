import React from 'react';

const InboxSolid = ({ style }: { style?: React.CSSProperties | undefined }) => {
  return (
    <svg style={style} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.5 6.129V0H10.5V6.129L8.25 3.879L6.129 6L12 11.871L17.871 6L15.75 3.879L13.5 6.129ZM0 12H9V15H15V12H24V24H0V12Z" fill={style?.color || '#CD1B78'} />
    </svg>
  );
};

export default InboxSolid;
