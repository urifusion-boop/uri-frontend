import { DocumentService } from '@/api/DocumentService';
import CustomButton from '@/components/atoms/CustomButton';
import Text, { ErrorText } from '@/components/atoms/CustomText';
import DragAndDrop from '@/components/atoms/DragAndDrop';
import InputField from '@/components/atoms/Input';
import SelectField from '@/components/atoms/SelectField';
import { branchOrHeadOffice, businessTypes } from '@/data/profileSetup';
import { BusinessDetailsValues, ClientProfileDtoFormDetails, useClientProfileSetupHook } from '@/hooks/profile/client/clientProfileSetup.hook';
import { ISelectData } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Grid } from '@mui/material';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

interface IProps {
  active: boolean;
  formDetails: ClientProfileDtoFormDetails;
  setFormDetails: (data: ClientProfileDtoFormDetails) => void;
  setStage: (index: number) => void;
}

const BusinessDetails: React.FC<IProps> = ({ active, formDetails, setFormDetails, setStage }) => {
  const { onSubmit, BusinessDetailsSchema } = useClientProfileSetupHook();

  const [fileSelected, setFileSelected] = useState('');
  const [fileLoading, setFileLoading] = useState(false);

  const handleFile = async (file: any) => {
    if (logo && logo.publicId) {
      await DocumentService.deleteFile(logo.publicId);
    }

    const formData = new FormData();
    formData.append('file', file[0]);
    setFileLoading(true);
    const response = await DocumentService.uploadFile(formData, 'BusinessCovers');
    setFileLoading(false);
    if (response?.status) {
      setFormDetails({
        ...formDetails,
        logo: {
          docName: 'BusinessCover',
          docType: 'png',
          url: response?.responseData?.url ?? '',
          publicId: response?.responseData?.publicId ?? '',
        },
      });
      setFileSelected(file[0]?.name ?? '');
    } else {
      toast(response?.responseMessage);
    }
    return;
  };

  const {
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BusinessDetailsValues>({
    mode: 'onBlur',
    resolver: zodResolver(BusinessDetailsSchema),
  });

  const logo = watch('logo');

  // default state for select fields
  const [businessTypeSelect, setBusinessTypeSelect] = useState<ISelectData>({} as ISelectData);
  const [branchSelect, setBranchSelect] = useState<ISelectData>({} as ISelectData);

  return active ? (
    <>
      <Box sx={{ mt: 2, mb: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ mt: 2 }}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value, onBlur } }) => (
                <InputField
                  label="Business | Client Name*"
                  placeholder="Business | Client Name"
                  type="text"
                  value={value}
                  onChange={(e) => {
                    setFormDetails({ ...formDetails, name: e.target.value });
                    onChange(e);
                  }}
                  onBlur={onBlur}
                  errorText={errors?.name?.message}
                />
              )}
            />

            <SelectField
              label="Business Type*"
              options={businessTypes}
              value={businessTypeSelect}
              onChange={(e) => {
                if (Array.isArray(e)) return;
                setValue('type', typeof e?.value === 'string' ? e.value : '');
                setBusinessTypeSelect(e ? e : { label: '', value: '' });
                setFormDetails({ ...formDetails, type: String(e?.value) });
              }}
              placeholder="Choose your business type."
              mt={3}
              errorText={errors?.type?.message}
            />

            {/* <Controller
              control={control}
              name="businessAddress"
              render={({ field: { onChange, value, onBlur } }) => (
                <InputField
                  label="Business Address*"
                  placeholder="Business Address"
                  type="text"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  errorText={errors?.businessAddress?.message}
                  mt={3}
                />
              )}
            /> */}

            <SelectField
              label="Branch or Head Office*"
              options={branchOrHeadOffice}
              value={branchSelect}
              onChange={(e) => {
                if (Array.isArray(e)) return;
                setValue('category', typeof e?.value === 'string' ? e.value : '');
                setBranchSelect(e ? e : { label: '', value: '' });
                setFormDetails({ ...formDetails, category: String(e?.value) });
              }}
              placeholder="Branch or Head office"
              mt={3}
              errorText={errors?.category?.message}
            />

            <Box sx={{ mt: 3 }}>
              <Text size={14} weight={400}>
                Upload your cover image/business logo
              </Text>
              <Box sx={{ mt: 2 }}>
                <DragAndDrop handleDragDrop={(file) => handleFile(file)} fileName={fileSelected} isLoading={fileLoading} />
                <ErrorText>{errors?.logo?.message ?? ''}</ErrorText>
              </Box>
            </Box>
            <Box sx={{ mt: 5 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <CustomButton mode="inverse">Back</CustomButton>
                </Grid>
                <Grid item xs={6}>
                  <CustomButton mode="primary" type="submit" onClick={() => setStage(1)}>
                    Continue
                  </CustomButton>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </form>
      </Box>
    </>
  ) : null;
};

export default BusinessDetails;
