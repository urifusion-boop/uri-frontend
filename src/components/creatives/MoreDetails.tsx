import React, { useState } from 'react';

import CustomButton from '@/components/atoms/CustomButton';
import Text from '@/components/atoms/CustomText';
import DragAndDrop from '@/components/atoms/DragAndDrop';
import SelectField from '@/components/atoms/SelectField';
import { languages, proficiencies } from '@/data/profileSetup';
import { Box, Grid } from '@mui/material';
import { toast } from 'react-hot-toast';
import { AiOutlineDelete, AiOutlinePlus } from 'react-icons/ai';
import { DocumentService } from '../../api/DocumentService';
import { IFile } from '../../hooks/profile/client/clientProfileSetup.hook';
import { CreativeProfileFormDetails } from '../../hooks/profile/creative/creativeProfileSetup.hook';
import useCustomTheme from '../../hooks/theme.hook';
import { useModal } from '../../hooks/utils.hook';
import { ISelectData } from '../../types';

interface IProps {
  onSubmit: () => void;
  active: boolean;
  formDetails: CreativeProfileFormDetails;
  setFormDetails: (data: CreativeProfileFormDetails) => void;
  setSubStage: (index: number) => void;
}

const MoreDetails: React.FC<IProps> = ({ onSubmit, active, formDetails, setFormDetails, setSubStage }) => {
  const { themeColors } = useCustomTheme();
  const [fileSelected] = useState<IFile[]>([]);
  const [fileLoading, setFileLoading] = useState(false);
  useModal();

  const [languageSelect, setLanguageSelect] = useState<ISelectData[]>([]);
  const [proficiencySelect, setProficiencySelect] = useState<ISelectData[]>([]);

  const handleFile = async (files: any) => {
    if (fileSelected.length) {
      for (let file of fileSelected) {
        await DocumentService.deleteFile(file.publicId);
      }
    }

    for (let file of files) {
      const formData = new FormData();
      formData.append('file', file);
      setFileLoading(true);
      const response = await DocumentService.uploadFile(formData, `PortfolioImages`);
      setFileLoading(false);
      if (response?.status) {
        setFormDetails({
          ...formDetails,
          images: formDetails.images.concat({
            docName: 'Works',
            docType: file.type,
            url: response?.responseData?.url ?? '',
            publicId: response?.responseData?.publicId ?? '',
          }),
        });
      } else {
        toast(response?.responseMessage);
      }
    }
    return;
  };

  const removeElement = (array: any[], index: number) => {
    const arrayData = array;
    array.splice(index, 1);
    return arrayData;
  };

  return active ? (
    <Box>
      <Grid container spacing={2}>
        {languageSelect.map((lang: any, index: number) => (
          <>
            <Grid item xs={12} md={6} key={index}>
              <SelectField
                value={languageSelect[index]}
                options={languages}
                onChange={(e) => {
                  setLanguageSelect(languageSelect.map((item, id) => (id === index && e ? e : item)));
                  setFormDetails({
                    ...formDetails,
                    languages: formDetails.languages.map((item, id) => {
                      if (id === index) return { ...item, language: String(e?.value) };
                      else return item;
                    }),
                  });
                }}
                placeholder="Languages"
                label="Language*"
                key={index}
              />
            </Grid>
            <Grid item xs={12} md={5} key={index}>
              <SelectField
                value={proficiencySelect[index]}
                options={proficiencies}
                onChange={(e) => {
                  setProficiencySelect(proficiencySelect.map((item, id) => (id === index && e ? e : item)));
                  setFormDetails({
                    ...formDetails,
                    languages: formDetails.languages.map((item, id) => {
                      if (id === index) return { ...item, proficiency: String(e?.value) };
                      else return item;
                    }),
                  });
                }}
                placeholder="Proficiency*"
                label="Proficiency*"
                key={index}
              />
            </Grid>
            <Grid item xs={12} md={1} key={index}>
              <Box pt={4}>
                <AiOutlineDelete
                  style={{
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setLanguageSelect(removeElement(languageSelect, index));
                    setProficiencySelect(removeElement(proficiencySelect, index));
                    setFormDetails({
                      ...formDetails,
                      languages: removeElement(formDetails.languages, index),
                    });
                  }}
                />
              </Box>
            </Grid>
          </>
        ))}
      </Grid>
      <CustomButton
        mode="inverse"
        style={{
          height: '38px',
          width: '170px',
          backgroundColor: 'transparent',
          border: `3px solid ${themeColors.primary}`,
          marginTop: '20px',
          color: themeColors.primary,
        }}
        type="submit"
        data-testid="number-select-button"
        onClick={() => {
          setLanguageSelect(languageSelect.concat({ label: '', value: '' }));
          setProficiencySelect(proficiencySelect.concat({ label: '', value: '' }));
          setFormDetails({
            ...formDetails,
            languages: formDetails.languages.concat({
              language: '',
              proficiency: '',
            }),
          });
        }}
        color={themeColors.primary}
      >
        <AiOutlinePlus
          style={{
            color: themeColors.primary,
            width: '20px',
            height: '20px',
            translate: '0px 3px',
          }}
        />
        Add Language
      </CustomButton>

      <Box sx={{ mt: 3 }}>
        <Text size={14} weight={400}>
          Upload your 3 images
        </Text>
        <Box sx={{ mt: 2 }}>
          <DragAndDrop handleDragDrop={(file) => handleFile(file)} fileName="Images" isLoading={fileLoading} />
        </Box>
      </Box>
      <Box sx={{ mt: 5 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <CustomButton mode="inverse" onClick={() => setSubStage(1)}>
              Back
            </CustomButton>
          </Grid>
          <Grid item xs={6}>
            <CustomButton mode="primary" onClick={() => onSubmit()}>
              Complete
            </CustomButton>
          </Grid>
        </Grid>
      </Box>
    </Box>
  ) : null;
};

export default MoreDetails;
