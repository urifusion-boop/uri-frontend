import { LeadBusinessInfoDto } from '@/models/dtos/LeadsDto';
import { Box, Button, IconButton, Input, Modal, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { BiX } from 'react-icons/bi';
import { FiInfo } from 'react-icons/fi';
import CustomButton from '../atoms/CustomButton';
import { ErrorText } from '../atoms/CustomText';
import MultiSelectInput from '../atoms/MultiSelectInput';
import SingleFieldInput from '../input/SingleFieldInput';

interface GenerateNewLeadModalProps {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  onClick?: (data: LeadBusinessInfoDto, successFunction: () => void) => void;
  loading?: boolean;
  leadBusinessInfo?: LeadBusinessInfoDto | null;
  onSuccessPrimaryAction?: () => void;
}

const GenerateNewLeadModal = ({ openModal, setOpenModal, onClick, loading, leadBusinessInfo, onSuccessPrimaryAction }: GenerateNewLeadModalProps) => {
  const [successModal, setSuccessModal] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [businessWebsite, setBusinessWebsite] = useState('');
  const [reason, setReason] = useState('');
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [aiResponseGuide, setAiResponseGuide] = useState('');

  useEffect(() => {
    if (leadBusinessInfo) {
      setBusinessName(leadBusinessInfo?.business_name ?? '');
      setBusinessWebsite(leadBusinessInfo?.business_website ?? '');
      setReason(leadBusinessInfo?.business_summary ?? '');
      setCompetitors(leadBusinessInfo?.competitors ?? []);
      setKeywords(leadBusinessInfo?.keywords ?? []);
      setAiResponseGuide(leadBusinessInfo?.ai_response_guide ?? '');
    }
  }, [leadBusinessInfo, openModal]);

  const handleCompetitorsChange = (event: React.SyntheticEvent | null, newCompetitors: string[]) => {
    setCompetitors(newCompetitors);
  };

  const handleKeywordsChange = (event: React.SyntheticEvent | null, newKeywords: string[]) => {
    setKeywords(newKeywords);
  };

  return (
    <>
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        slotProps={{
          backdrop: {
            sx: { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
          },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: 24,
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 2,
            backgroundColor: '#fff',
            maxWidth: '900px',
            width: '90%', // Adjusted for smaller screens
            maxHeight: '90vh', // Adjusted for smaller screens
            overflowY: 'auto', // Allows scrolling when content exceeds container height
          }}
          className="scroll"
        >
          {/* Modal Header */}
          <Typography
            variant="body1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '24px', sm: '28px', md: '36px' },
              color: '#333333',
              textAlign: 'center',
            }}
          >
            {leadBusinessInfo?.lead_business_info_id ? 'Manage your' : 'Generate'}{' '}
            <span
              style={{
                color: '#CD1B78',
              }}
            >
              {leadBusinessInfo?.lead_business_info_id ? 'Lead Tracking' : 'New Leads'}
            </span>{' '}
            {leadBusinessInfo?.lead_business_info_id ? ' Information' : ' with AI'}
          </Typography>
          <Box
            sx={{
              width: { xs: '120px', md: '200px' },
              height: 'auto', // Maintains aspect ratio
              display: 'block',
              margin: 'auto',
              marginTop: '20px', // Reduced spacing for smaller screens
            }}
          >
            <img
              src="/assets/images/generate-leads.svg"
              alt="Generate Leads"
              style={{
                width: '100%',
                height: 'auto', // Maintains aspect ratio
                display: 'block',
                margin: 'auto',
                marginTop: '20px', // Reduced spacing for smaller screens
              }}
            />
          </Box>
          <Box
            mt={3}
            sx={{
              maxWidth: '600px',
              width: '100%',
              mx: 'auto',
            }}
          >
            <Input
              id="input-with-icon-adornment"
              placeholder="Business Name"
              value={businessName}
              fullWidth
              onChange={(e) => {
                const trimmedValue = e.target.value.replace(/\s+/g, '');
                setBusinessName(trimmedValue);
              }}
              sx={{
                borderBottom: '0.83px solid #CCCCCC',
                '&::placeholder': {
                  color: 'red',
                  fontStyle: 'italic',
                },
              }}
              endAdornment={
                <IconButton
                  onClick={() => {
                    setBusinessName('');
                  }}
                >
                  <BiX size={20} />
                </IconButton>
              }
            />
            {businessName.length < 1 && <ErrorText>Required</ErrorText>}
          </Box>
          <Box
            mt={3}
            sx={{
              maxWidth: '600px',
              width: '100%',
              mx: 'auto',
            }}
          >
            <Input
              id="input-with-icon-adornment"
              placeholder="Business Info"
              value={reason}
              fullWidth
              onChange={(e) => {
                setReason(e.target.value);
              }}
              sx={{
                borderBottom: '0.83px solid #CCCCCC',
                '&::placeholder': {
                  color: 'red',
                  fontStyle: 'italic',
                },
              }}
              endAdornment={
                <IconButton
                  onClick={() => {
                    setReason('');
                  }}
                >
                  <BiX size={20} />
                </IconButton>
              }
            />
            {reason.length < 1 && <ErrorText>Required</ErrorText>}
          </Box>
          <Box
            mt={3}
            sx={{
              maxWidth: '600px',
              width: '100%',
              mx: 'auto',
            }}
          >
            <SingleFieldInput placeholder="Business Website Link" value={businessWebsite} setValue={(value: string) => setBusinessWebsite(value)} required={false} />
            <Typography
              variant="body2"
              sx={{
                color: '#ccc',
                mt: 1,
              }}
            >
              Optional
            </Typography>
          </Box>

          <Box
            sx={{
              maxWidth: '600px',
              width: '100%',
              mt: 3,
              mx: 'auto',
            }}
          >
            <MultiSelectInput values={competitors} setValues={setCompetitors} handleValuesChange={handleCompetitorsChange} label="Type a Competitor" />
            <MultiSelectInput values={keywords} setValues={setKeywords} handleValuesChange={handleKeywordsChange} label="Type a Keyword" />
          </Box>

          {/* add a text field for ai prompt */}
          <Box
            mt={3}
            sx={{
              maxWidth: '600px',
              width: '100%',
              mx: 'auto',
            }}
          >
            <Input
              id="input-with-icon-adornment"
              placeholder="How should Dera AI compose your leads follow up messages?"
              value={aiResponseGuide}
              fullWidth
              onChange={(e) => {
                setAiResponseGuide(e.target.value);
              }}
            />
          </Box>

          {leadBusinessInfo?.lead_business_info_id && (
            <Box
              mt={3}
              sx={{
                maxWidth: '600px',
                width: '100%',
                mx: 'auto',
                backgroundColor: '#EEEEEE',
                border: '1px solid #B5B5B5',
                px: 2,
                py: 2,
                display: 'flex',
                gap: '12px',
                borderRadius: '10px',
              }}
            >
              <FiInfo color="#616161" size={35} />
              <Typography
                sx={{
                  color: '#373737',
                  fontSize: { xs: '12px', md: '14px' },
                  fontWeight: 600,
                }}
              >
                Please note: Updating your business information will stop tracking old leads. New leads will be generated based on the updated details.
              </Typography>
            </Box>
          )}
          {/* Save Button */}
          <Box
            mt={3}
            sx={{
              display: 'flex',
              maxWidth: '250px',
              justifyContent: 'center',
              mx: 'auto',
              alignItems: 'center',
            }}
          >
            <CustomButton
              mode="primary"
              disabled={!businessName || !reason}
              onClick={() => {
                if (!onClick) return;

                onClick(
                  {
                    business_name: businessName,
                    business_summary: reason,
                    business_website: businessWebsite,
                    lead_business_info_id: leadBusinessInfo?.lead_business_info_id,
                    created_date: leadBusinessInfo?.created_date,
                    last_updated: leadBusinessInfo?.last_updated,
                    user_id: leadBusinessInfo?.user_id,
                    competitors,
                    keywords,
                  },
                  () => {
                    setSuccessModal(true);
                    setOpenModal(false);
                  }
                );
              }}
              loading={loading}
            >
              {leadBusinessInfo?.lead_business_info_id ? 'Update Business Information' : 'Generate Business Information'}
            </CustomButton>
          </Box>
        </Box>
      </Modal>

      {/* Success Modal */}
      <Modal
        open={successModal}
        onClose={() => {
          setSuccessModal(false);
        }}
        slotProps={{
          backdrop: {
            sx: { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
          },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: 24,
            px: { xs: 2, sm: 3, md: 4 },
            borderRadius: 2,
            backgroundColor: '#fff',
            maxWidth: '900px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            py: { xs: 3, md: 6 },
          }}
          className="scroll"
        >
          <img
            src="/assets/images/success.png"
            alt="lead success"
            style={{
              width: '100%', // Adjusts image size based on container width
              maxWidth: '150px',
              height: 'auto', // Maintains aspect ratio
              display: 'block',
              margin: 'auto',
              marginTop: '20px', // Reduced spacing for smaller screens
            }}
          />
          <Typography
            sx={{
              color: '#333333',
              fontSize: { xs: '20px', md: '28px' },
              textAlign: 'center',
              fontWeight: 700,
            }}
          >
            Your Lead is Being Tracked
          </Typography>
          <Typography
            sx={{
              color: '#535252',
              fontSize: { xs: '14px', md: '16px' },
              textAlign: 'center',
              fontWeight: 600,
              maxWidth: '500px',
              mx: 'auto',
              mt: 2,
            }}
          >
            We’ve added this lead to your inbox, we’re tracking the latest updates ensuring you never miss any opportunity.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: { xs: '20px', md: '64px' },
              gap: '20px',
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setSuccessModal(false);
                onSuccessPrimaryAction && onSuccessPrimaryAction();
              }}
            >
              View Leads
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                setSuccessModal(false);
                setOpenModal(true);
              }}
            >
              Generate New Leads
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default GenerateNewLeadModal;
