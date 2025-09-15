import useCustomTheme from '@/hooks/theme.hook';
import React, { useEffect, useRef, useState } from 'react';
import { IoStatsChartOutline } from 'react-icons/io5';
import { IconType } from 'react-icons/lib';

interface IProps {
  data: {
    label: string;
    value: number;
    icon: any;
  }[];
}

const AnalyticsCard: React.FC<IProps> = ({ data }) => {
  const { themeColors } = useCustomTheme();
  const [index, setIndex] = useState(0);
  const [, setIcon] = useState<IconType | null>();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const startTimeout = () => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setIndex((prevIndex) => (prevIndex === data.length - 1 ? 0 : prevIndex + 1));
    }, 4000);
  };

  useEffect(() => {
    startTimeout();

    return () => resetTimeout();
  }, [index, data.length]);

  // Effect to set the current icon
  useEffect(() => {
    setIcon(data[index]?.icon ?? null);
  }, [index, data]);

  return (
    <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-6">
      <div className="expovent__count-item mb-4" style={{ paddingTop: '20px', paddingBottom: '20px' }} onMouseEnter={() => resetTimeout()} onMouseLeave={() => startTimeout()}>
        <div className="expovent__count-thumb include__bg transition-3" style={{ backgroundImage: `url(/assets/images/stat-bg.png)` }}></div>
        <div className="expovent__count-content">
          <h3 className="expovent__count-number">{data[index]?.value ?? 0}</h3>
          <span className="expovent__count-text">{data[index]?.label ?? ''}</span>

          <span style={{ display: 'block', marginTop: '1px' }}>
            {data.map((item, id) => (
              <span
                key={id}
                style={{
                  display: 'inline-block',
                  height: '4px',
                  borderRadius: '10px',
                  background: index === id ? themeColors.primary : 'whitesmoke',
                  width: '15px',
                  margin: '0px 3px',
                }}
                className="pointer"
                onClick={() => setIndex(id)}
              ></span>
            ))}
          </span>
        </div>
        <div className="expovent__count-icon" style={{ overflow: 'visible' }}>
          {data.map((stat, id) => {
            if (id !== index) return null;
            if (stat.icon) {
              return (
                <stat.icon
                  style={{
                    width: '30px',
                    height: '30px',
                    color: themeColors.primary,
                  }}
                  key={id}
                />
              );
            } else {
              return (
                <IoStatsChartOutline
                  style={{
                    width: '30px',
                    height: '30px',
                    color: themeColors.primary,
                  }}
                  key={id}
                />
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCard;
