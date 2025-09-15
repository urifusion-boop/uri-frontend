import { Typography } from '@mui/material';
import React from 'react';
import { VscGraph } from 'react-icons/vsc';
import CustomButton from '../atoms/CustomButton';
import {
  BusinessNetworkIcon,
  CrowdIcon,
  CsvIcon,
  IncreaseIcon,
} from '../atoms/Icons';
import { useRouter } from 'next/navigation';

interface PricingFeatureProps {
  icon: React.ReactNode;
  text: string;
}

const PricingFeature = ({ icon, text }: PricingFeatureProps) => (
  <div className='flex items-center gap-2 mb-4'>
    <Typography className='text-[#CD1B78]'>{icon}</Typography>
    <Typography fontWeight={600} className='text-left text-gray-700'>
      {text}
    </Typography>
  </div>
);

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
  buttonText: string;
  isPrimary?: boolean;
}

export const PricingCard = ({
  title,
  price,
  features,
  buttonText,
  isPrimary,
}: PricingCardProps) => {
  const router = useRouter();
  return (
    <div
      className={`bg-white rounded-[20px] p-8 flex flex-col border border-gray-200`}>
      <Typography
        fontWeight={700}
        fontSize={32}
        className='text-[#CD1B78] text-center mb-4 md:text-[32px] text-[24px]'>
        {title}
      </Typography>
      <div className='mb-8'>
        <Typography className='md:text-[60px] text-[56px] font-bold'>
          {price}
          <Typography className='text-[#3A3A3A] text-[16px] inline'>
            /month
          </Typography>
        </Typography>
      </div>
      <div className='flex-grow'>
        {features.map((feature, index) => (
          <PricingFeature
            key={index}
            icon={
              index === 0 ? (
                <VscGraph size={20} />
              ) : index === 1 ? (
                <BusinessNetworkIcon />
              ) : index === 2 ? (
                <IncreaseIcon />
              ) : index === 3 ? (
                <CrowdIcon />
              ) : index === 4 ? (
                <CsvIcon />
              ) : index === 5 ? (
                <IncreaseIcon />
              ) : index === 6 ? (
                <BusinessNetworkIcon />
              ) : (
                <CsvIcon />
              )
            }
            text={feature}
          />
        ))}
      </div>
      <div className='pt-[42px] border-t-4 border-[#C9D0DE]'>
        <CustomButton
          mode='inverse'
          onClick={() => {
            router.push('/dashboard');
          }}
          style={{}}>
          Get Started
        </CustomButton>
      </div>
    </div>
  );
};
