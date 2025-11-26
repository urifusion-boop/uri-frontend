import CustomButton from '@/components/atoms/CustomButton';
import Text from '@/components/atoms/CustomText';
import SelectField from '@/components/atoms/SelectField';
import { cityOptions, countries, stateOptions } from '@/data/profileSetup';
import { ISelectData } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Grid } from '@mui/material';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ClientProfileDtoFormDetails } from '../../hooks/profile/client/clientProfileSetup.hook';
import { LocationFormValues, useLocation } from '../../hooks/profile/client/location.hook';
import { CreativeProfileFormDetails } from '../../hooks/profile/creative/creativeProfileSetup.hook';
import InputField from '../atoms/Input';

interface IProps {
  active: boolean;
  formDetails: CreativeProfileFormDetails | ClientProfileDtoFormDetails;
  setFormDetails: (data: any) => void;
  setStage: (index: number) => void;
  showHeader?: boolean;
  onSubmit: () => void;
  userType?: string;
}

const LocationProfileSetup: React.FC<IProps> = ({ active, formDetails, setFormDetails, setStage, showHeader, onSubmit, userType }) => {
  const { LocationSchema } = useLocation();

  const [state, setState] = useState('Lagos');
  const [, setCity] = useState('');

  const {
    control,
    setValue,
    formState: { errors },
  } = useForm<LocationFormValues>({
    mode: 'onBlur',
    resolver: zodResolver(LocationSchema),
  });

  const [countrySelect, setCountrySelect] = useState<ISelectData>({} as ISelectData);
  const [stateSelect, setStateSelect] = useState<ISelectData>({} as ISelectData);
  const [citySelect, setCitySelect] = useState<ISelectData>({} as ISelectData);

  return active ? (
    <>
      {showHeader && (
        <Box sx={{ mt: 2 }}>
          <Text size={20} weight={700}>
            Location
          </Text>
          <Text size={16} mode="secondary" weight={400}>
            Please enter your current location
          </Text>
        </Box>
      )}
      <Box
        sx={{
          mt: 2,
          mb: 7,
        }}
      >
        <Controller
          control={control}
          name="businessAddress"
          render={({ field: { onChange, value, onBlur } }) => (
            <InputField
              label="Address*"
              placeholder="Address"
              type="text"
              value={value}
              onChange={(e) => {
                setFormDetails({
                  ...formDetails,
                  location: {
                    ...formDetails.location,
                    address: e?.target.value,
                  },
                });
                onChange(e);
              }}
              onBlur={onBlur}
              errorText={errors?.businessAddress?.message}
            />
          )}
        />

        <SelectField
          label="Country"
          options={countries}
          value={countrySelect}
          onChange={(e) => {
            if (Array.isArray(e)) return;
            setValue('country', typeof e?.value === 'string' ? e.value : '');
            setCountrySelect(e ? e : { label: '', value: '' });
            setFormDetails({
              ...formDetails,
              location: { ...formDetails.location, country: e?.value },
            });
          }}
          placeholder="Select a Country"
          errorText={errors?.country?.message}
          mt={3}
        />
        <SelectField
          mt={3}
          label="State"
          value={stateSelect}
          options={stateOptions()}
          onChange={(e) => {
            if (Array.isArray(e)) return;
            setState(typeof e?.value === 'string' ? e.value : '');
            setCity('');
            setValue('state', typeof e?.value === 'string' ? e.value : '');
            setStateSelect(e ? e : { label: '', value: '' });
            setFormDetails({
              ...formDetails,
              location: { ...formDetails.location, state: e?.value },
            });
          }}
          placeholder="Select a State"
          defaultValue={{ label: 'Lagos', value: 'Lagos' }}
          errorText={errors?.state?.message}
        />
        <SelectField
          mt={3}
          label="City"
          options={cityOptions(state)}
          value={citySelect}
          onChange={(e) => {
            if (Array.isArray(e)) return;
            setValue('city', typeof e?.value === 'string' ? e.value : '');
            setCitySelect(e ? e : { label: '', value: '' });
            setFormDetails({
              ...formDetails,
              location: { ...formDetails.location, city: e?.value },
            });
          }}
          placeholder="Select a City"
          errorText={errors?.city?.message}
        />

        <Box sx={{ mt: 5 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <CustomButton mode="inverse" onClick={() => setStage(0)}>
                Back
              </CustomButton>
            </Grid>
            <Grid item xs={6}>
              <CustomButton mode="primary" onClick={() => (userType === 'creative' ? setStage(1) : onSubmit())}>
                {userType === 'creative' ? 'Continue' : 'Complete'}
              </CustomButton>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  ) : null;
};

export default LocationProfileSetup;
