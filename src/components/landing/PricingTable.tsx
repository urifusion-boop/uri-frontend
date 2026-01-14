import { Box, Grid, Typography } from '@mui/material';

import { pricingData } from '@/data/pricingComparison';
import useResponsiveness from '@/hooks/useResponsiveness';
import CheckIcon from '@mui/icons-material/Check';
import React from 'react';

const PricingTable = () => {
  const { isTablet } = useResponsiveness();
  return (
    <div className="w-full max-w-[1240px] mx-auto overflow-x-auto bg-white rounded-lg mt-[48px] md:mt-[92px] md:mb-[100px] mb-[80px] pb-[80px] shadow-sm">
      <Grid mb={4} display={'grid'} justifyContent={isTablet ? 'start' : 'center'} marginBottom={10}>
        {/* <h2 className="text-[#CD1B78] text-xl font-semibold mx-auto">PRICING</h2> */}
        <h3 className="text-[#000000] text-[32px] md:text-[48px] font-bold mx-auto py-2 text-center">
          Compare Our<span className="text-[#CD1B78]"> Plans</span> Plan
        </h3>

        <p className="max-w-[959px] mx-auto text-center text-[#080808] text-lg md:text-[24px] mt-1 font-urbanist font-medium leading-snug">
          Discover the differences of each individual plan and learn more about our services
        </p>
      </Grid>

      <table className="w-full min-w-[800px] border-collapse">
        {/* Header Row */}
        <thead>
          <tr className="border-b">
            <th className="m-0 p-0">
              <Box
                sx={{
                  paddingY: '16px',
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  gap: 5,
                }}
              >
                <Typography className="font-bold text-xl mb-2"></Typography>
                <Typography paddingLeft={'24px'} fontWeight="bold" fontSize={'32px'} color="#6B6B6B">
                  Features
                </Typography>
              </Box>
            </th>
            {pricingData.headers.map((header, index) => (
              <th key={index} className="m-0 p-0 w-[200px] max-w-[200px]">
                <Box
                  sx={{
                    // background: index === 0 ? '#FFFCFE' : index === 1 ? '#F9F8FF' : index === 2 ? '#FFF4FA' : '#F4F7FF',
                    borderTopRightRadius: '8px',
                    borderTopLeftRadius: '8px',
                    paddingY: '16px',
                    textAlign: 'center',
                    height: '100%',
                    border: '1px solid #E5E7EB',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  <Typography className="font-bold text-xl mb-2">{header}</Typography>
                  <Typography fontWeight="bold" fontSize={'32px'} color="#6B6B6B">
                    {pricingData.prices[index]}
                  </Typography>
                </Box>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {pricingData.sections.map((section, sectionIndex) => (
            <React.Fragment key={sectionIndex}>
              {/* Section Title */}
              {section.title && (
                <tr className="">
                  <td colSpan={pricingData.headers.length + 1} className="p-4 font-medium text-gray-700">
                    <Typography className="font-bold text-gray-700 text-lg pl-2">{section.title}</Typography>
                  </td>
                </tr>
              )}

              {/* Rows */}
              {section.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t border-b  border-gray-200 text-base">
                  <td className={'p-4 pl-6 text-gray-600 rounded-tl-xl'}>{row.label}</td>
                  {row.values.map((value, valueIndex) => (
                    <td key={valueIndex} className="p-4 text-center border border-gray-200">
                      {typeof value === 'boolean' ? value ? <CheckIcon className="text-green-600" /> : <span className="text-gray-400">-</span> : <span>{value}</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PricingTable;
