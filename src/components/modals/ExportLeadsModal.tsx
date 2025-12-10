import { LightThemeColors } from '@/configs/colors.config';
import { ExportLeadDto } from '@/models/dtos/LeadsDto';
import { FileTypeEnum } from '@/models/enum-models/FileTypeEnum';
import { LeadSourceEnum } from '@/models/enum-models/LeadSourceEnum';
import { LeadTypeEnum } from '@/models/enum-models/LeadTypeEnum';
import { useAuth } from '@/providers/AuthProvider';
import DocumentErrorIcon from '@/utils/icon/DocumentErrorIcon';
import { Box, Typography } from '@mui/material';
import { UseMutateFunction } from '@tanstack/react-query';
import React, { useState } from 'react';
import { triggerToast } from '../atoms/CustomToast';
import SingleFieldInput from '../input/SingleFieldInput';
import SingleSelectDropdown from '../input/SingleSelectDropdown';
import LeadSelectFilters from '../lead-tracking/LeadSelectFilters';
import BaseExportModal from './BaseExportModal';

interface ExportLeadsModalProps {
  open: boolean;
  toggleModal: () => void;
  feature: string;
  generateLeadReport?: UseMutateFunction<
    | {
        text: string;
      }
    | null
    | undefined,
    unknown,
    ExportLeadDto,
    unknown
  >;
  isGeneratingReport?: boolean;
  extraParams?: {
    leadType?: LeadTypeEnum;
    leadSnapshotId?: string;
    fileType?: FileTypeEnum | FileTypeEnum.CSV;
    leadSource?: LeadSourceEnum;
    skip?: number | 0;
    limit?: number | 100;
  };
}

const ExportLeadsModal: React.FC<ExportLeadsModalProps> = ({ open, toggleModal, feature, generateLeadReport, isGeneratingReport, extraParams }) => {
  const { userDetails } = useAuth();
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);

  //  Declare lead filter states.
  const [leadStatus, setLeadStatus] = useState<string | null>(null);
  const [interestLevel, setInterestLevel] = useState<string | null>(null);

  const [leadSnapshotId] = useState<string | null>(extraParams?.leadSnapshotId ?? null);
  const [fileType, setFileType] = useState<FileTypeEnum | null>(extraParams?.fileType ?? null);
  const [leadSource, setLeadSource] = useState<LeadSourceEnum | null>(extraParams?.leadSource ?? null);
  const [leadType, setLeadType] = useState<LeadTypeEnum | null>(extraParams?.leadType ?? null);
  const [skip, setSkip] = useState<number | null>(extraParams?.skip ?? 0);
  const [limit, setLimit] = useState<number | null>(extraParams?.limit ?? 100);

  // State for children form elements:
  // const [hasEmail, setHasEmail] = useState(false);
  // const [hasPhone, setHasPhone] = useState(false);

  return (
    <>
      {/* Main Export Modal */}
      <BaseExportModal
        isPrimaryLoading={isGeneratingReport}
        open={open}
        onClose={toggleModal}
        title={
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: '#212529',
              fontSize: '20px',
              textAlign: 'center',
            }}
          >
            Export <span style={{ color: LightThemeColors.uriColor }}>{feature}</span>
          </Typography>
        }
        imageSrc="/assets/icons/csv-icon.svg"
        imageContainerSx={{
          backgroundColor: '#CD1B78',
          padding: '10px',
          borderRadius: '10px',
          height: '70px',
          width: '70px',
          mx: 'auto',
        }}
        description="You successfully captured your leads! Before exporting, choose your preferred options."
        descriptionSx={{
          fontSize: '15px',
          fontWeight: 600,
          color: '#767676',
        }}
        primaryBtnText="Export"
        secondaryBtnText="Cancel"
        onPrimaryClick={() => {
          if (!userDetails?.userId) {
            triggerToast('error', 'User not found. Please login again.');
            toggleModal();
            return;
          }

          generateLeadReport?.(
            {
              file_type: FileTypeEnum.CSV,
              assigned_to: userDetails?.userId,
              ...(leadStatus && { lead_status: leadStatus }),
              ...(interestLevel && { interest_level: interestLevel }),
              ...(leadSnapshotId && { lead_snapshot_id: leadSnapshotId }),
              ...(fileType && { file_type: fileType }),
              ...(leadType && { lead_type: leadType }),
              ...(leadSource && { lead_source: leadSource }),
              ...(skip && { skip: skip }),
              ...(limit && { limit: limit }),
            },
            {
              onSuccess: () => {
                setSuccessModal(true);
                toggleModal();
              },
              onError: () => {
                setErrorModal(true);
                toggleModal();
              },
            }
          );
        }}
        onSecondaryClick={toggleModal}
      >
        {/* Children: First, the Lead Filters */}
        <Box sx={{ mt: 3 }}>
          <LeadSelectFilters
            leadStatus={leadStatus}
            setLeadStatus={setLeadStatus}
            interestLevel={interestLevel}
            setInterestLevel={setInterestLevel}
            leadSelectWrapperSx={{ width: '100%' }}
            interestSelectWrapperSx={{ width: '100%' }}
            leadStatusLabel="Lead Status"
            interestLevelLabel="Interest Level"
            containerSx={{
              width: '100%',
            }}
          />
          {/* Then, the "Has Contact Detail" toggle and email input */}
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 3 }}>
              {/* We want only CSV to be available */}
              <SingleSelectDropdown
                label="File Type"
                options={Object.values({ [FileTypeEnum.CSV]: FileTypeEnum.CSV }).map((type) => ({ label: type.toString(), value: type }))}
                selectedValue={fileType ? { label: fileType.toString(), value: fileType } : null}
                onChange={(e) => setFileType(e.value as unknown as FileTypeEnum)}
                placeholder="CSV"
                tooltip="The type of file to export"
              />
              {/* this should not be set if not provided and there is no default value */}
              <SingleSelectDropdown
                label="Lead Source"
                options={[{ label: 'All', value: 'All' }, ...Object.values(LeadSourceEnum).map((type) => ({ label: type.toString(), value: type }))]}
                selectedValue={leadSource ? { label: leadSource.toString(), value: leadSource } : { label: 'All', value: 'All' }}
                onChange={(e) => setLeadSource(e.value === 'All' ? null : (e.value as unknown as LeadSourceEnum))}
                placeholder="All"
                tooltip="The source of the leads to export"
              />
            </Box>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 3 }}>
              <SingleFieldInput
                label="Start From"
                value={skip?.toString() ?? '0'}
                setValue={(e) => setSkip(Number(e))}
                placeholder="0"
                required={false}
                tooltip="The number of leads to skip from the start"
              />
              <SingleFieldInput label="To" value={limit?.toString() ?? '10'} setValue={(e) => setLimit(Number(e))} placeholder="10" required={false} tooltip="The number of leads to export" />
            </Box>
          </Box>
        </Box>
      </BaseExportModal>

      {/* Success Modal */}
      <BaseExportModal
        open={successModal}
        onClose={() => setSuccessModal(false)}
        title=""
        imageSrc="/assets/images/success.png"
        imageSx={{ width: '100px', height: '100px' }}
        description="Your leads has been exported successfully!"
        descriptionSx={{ fontWeight: 700, color: '#333' }}
        primaryBtnText="Done"
        onPrimaryClick={() => setSuccessModal(false)}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography
            variant="body2"
            sx={{
              color: '#575757',
              fontWeight: 600,
              fontSize: '14px',
              textAlign: 'center',
            }}
          >
            You would receive an email shortly
          </Typography>
        </Box>
      </BaseExportModal>

      {/* Failure Modal */}
      <BaseExportModal
        open={errorModal}
        onClose={() => setErrorModal(false)}
        title=""
        imageContent={
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
            <DocumentErrorIcon
              style={{
                color: LightThemeColors.uriColor,
                height: '58px',
                width: '55px',
              }}
            />
          </Box>
        }
        description="Something went wrong while generating your CSV file. Please try again. If the issue persists, check your connection or refresh the page."
        descriptionSx={{ fontSize: '14px', fontWeight: 600, color: '#515151' }}
        subDescription="Download Failed"
        primaryBtnText="Retry"
        secondaryBtnText="Cancel"
        onPrimaryClick={() => {
          setErrorModal(false);
          toggleModal();
        }}
        onSecondaryClick={() => setErrorModal(false)}
      />
    </>
  );
};

export default ExportLeadsModal;
