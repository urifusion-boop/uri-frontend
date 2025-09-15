import CustomButton from '@/components/atoms/CustomButton';
import CustomRadio from '@/components/atoms/CustomRadio';
import Text from '@/components/atoms/CustomText';
import DragAndDrop from '@/components/atoms/DragAndDrop';
import InputField from '@/components/atoms/Input';
import { Box, Grid } from '@mui/material';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { DocumentService } from '../../api/DocumentService';
import { bodySizes, creativeGenders, eyeColors, skinColors } from '../../data/creatives';
import { IFile } from '../../hooks/profile/client/clientProfileSetup.hook';
import { CreativeProfileFormDetails } from '../../hooks/profile/creative/creativeProfileSetup.hook';
import useCustomTheme from '../../hooks/theme.hook';
import { ISelectData } from '../../types';
import SelectField from '../atoms/SelectField';

interface IProps {
  active: boolean;
  formDetails: CreativeProfileFormDetails;
  setFormDetails: (data: CreativeProfileFormDetails) => void;
  setStage: (index: number) => void;
  setSubStage: (index: number) => void;
}

const ModelProfileDetails: React.FC<IProps> = ({ active, formDetails, setFormDetails, setStage, setSubStage }) => {
  const [fileSelected] = useState<IFile>({} as IFile);
  const [fileLoading, setFileLoading] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const { themeColors } = useCustomTheme();

  const handleFile = async (file: any) => {
    if (fileSelected?.publicId) {
      await DocumentService.deleteFile(fileSelected.publicId);
    }

    const formData = new FormData();
    formData.append('file', file[0]);
    setFileLoading(true);
    const response = await DocumentService.uploadFile(formData, 'Headshots');
    setFileLoading(false);
    if (response?.status) {
      setFormDetails({
        ...formDetails,
        headshot: {
          docName: 'Headshot',
          docType: file.type ?? 'png',
          url: response?.responseData?.url ?? '',
          publicId: response?.responseData?.publicId ?? '',
        },
      });
    } else {
      toast(response?.responseMessage);
    }
    return;
  };

  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [height, setHeight] = useState('');

  const [bodySizeSelect, setBodySizeSelect] = useState<ISelectData>({} as ISelectData);
  const [skinColorSelect, setSkinColorSelect] = useState<ISelectData>({} as ISelectData);
  const [eyeColorSelect, setEyeColorSelect] = useState<ISelectData>({} as ISelectData);

  return active ? (
    <Box sx={{ mb: 10 }}>
      <Box sx={{ mt: 4 }}>
        <Text size={14} weight={500}>
          What is your gender
        </Text>
        <Box sx={{ mt: 3 }} className="d-flex items-center wrap">
          {creativeGenders.map((item, index) => (
            <Box key={index}>
              <CustomRadio
                label={item?.label}
                checked={gender === item.value}
                onChange={(e) => {
                  e.target.value ? setGender(String(item.value)) : null;
                  setFormDetails({
                    ...formDetails,
                    gender: String(item.value),
                  });
                }}
                value={item.value}
              />
            </Box>
          ))}
        </Box>
      </Box>
      <Grid container sx={{ mt: 3 }} spacing={3}>
        <Grid item xs={12} md={6}>
          <InputField
            label="Height *"
            placeholder="Enter your height."
            type="text"
            value={height}
            onChange={(e) => {
              setHeight(e ? e.target.value : '');
              setFormDetails({
                ...formDetails,
                bodyFeature: {
                  ...formDetails.bodyFeature,
                  height: e.target.value,
                },
              });
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <SelectField
            label="Body Size"
            options={bodySizes}
            value={bodySizeSelect}
            onChange={(e) => {
              setBodySizeSelect(e ? e : { label: '', value: 1 });
              setFormDetails({
                ...formDetails,
                bodyFeature: {
                  ...formDetails.bodyFeature,
                  bodySize: String(e?.value),
                },
              });
            }}
            placeholder="Body Size"
          />
          <Box className="d-flex justify-end" onClick={() => setShowSizeGuide(true)}>
            <IoMdInformationCircleOutline style={{ color: themeColors.primary }} />
            <Text size={14} weight={400} color={themeColors.primary}>
              Check SIze Guide
            </Text>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <SelectField
            label="Eye Color"
            options={eyeColors}
            value={eyeColorSelect}
            onChange={(e) => {
              setEyeColorSelect(e ? e : { label: '', value: 1 });
              setFormDetails({
                ...formDetails,
                bodyFeature: {
                  ...formDetails.bodyFeature,
                  eyeColor: String(e?.value),
                },
              });
            }}
            placeholder="Eye Color"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <SelectField
            label="Skin Color"
            options={skinColors}
            value={skinColorSelect}
            onChange={(e) => {
              setSkinColorSelect(e ? e : { label: '', value: 1 });
              setFormDetails({
                ...formDetails,
                bodyFeature: {
                  ...formDetails.bodyFeature,
                  skinColor: String(e?.value),
                },
              });
            }}
            placeholder="Skin Color"
          />
        </Grid>
      </Grid>
      <Box sx={{ mt: 4 }}>
        <InputField
          label="Date of Birth"
          type="date"
          value={dateOfBirth}
          onChange={(e) => {
            setDateOfBirth(e.target.value);
            setFormDetails({ ...formDetails, dateOfBirth: e.target.value });
          }}
        />
      </Box>
      <Box sx={{ mt: 3 }}>
        <Text size={14} weight={400}>
          Upload Headshot
        </Text>
        <Box sx={{ mt: 2 }}>
          <DragAndDrop handleDragDrop={(file) => handleFile(file)} fileName="Headshot" isLoading={fileLoading} />
        </Box>
      </Box>
      <Box sx={{ mt: 5 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <CustomButton mode="inverse" onClick={() => setStage(1)}>
              Back
            </CustomButton>
          </Grid>
          <Grid item xs={6}>
            <CustomButton mode="primary" onClick={() => setSubStage(2)}>
              Continue
            </CustomButton>
          </Grid>
        </Grid>
      </Box>

      {showSizeGuide && (
        <>
          <div
            style={{
              backgroundColor: 'rgba(214, 221, 235, 0.30)',
              backdropFilter: 'blur(18.751157760620117px)',
              width: '100%',
              height: '100vh',
              position: 'fixed',
              top: '0px',
              left: '0px',
              cursor: 'pointer',
            }}
            onClick={() => setShowSizeGuide(false)}
          ></div>{' '}
          <img
            src="/assets/images/size-guide.png"
            alt="image not found"
            style={{
              minHeight: '70%',
              maxWidth: '90%',
              maxHeight: '90%',
              position: 'fixed',
              top: '50%',
              left: '50%',
              translate: '-50% -50%',
            }}
          />
        </>
      )}
    </Box>
  ) : null;
};

export default ModelProfileDetails;
