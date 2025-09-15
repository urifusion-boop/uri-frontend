import { useCallback, useState } from 'react';

import { ReportGenerationService } from '@/api/ReportGenerationService';
import { isFeatureDisabled } from '@/configs/rules.config';
import { TextHelper } from '@/helpers/TextHelper';
import { AccountTrackingReportDto, HashtagTrackingReportDto } from '@/models/dtos/ReportDto';
import { AccountTrackingReportFieldsEnum } from '@/models/enum-models/AccountTrackingReportFieldsEnum';
import { DateFilterEnum } from '@/models/enum-models/DateFIlterEnum';
import { HashtagTrackingReportFieldsEnum } from '@/models/enum-models/HashtagTrackingReportFieldsEnum';
import { ReportTypeEnum } from '@/models/enum-models/ReportTypeEnum';
import { TrackerTypeEnum } from '@/models/enum-models/TrackerTypeEnum';
import { useAuth } from '@/providers/AuthProvider';
import { useFeatureLimitStore } from '@/store/useFeatureLimitStore';
import { useMutation } from '@tanstack/react-query';

export const useReportGeneration = () => {
  const { userDetails } = useAuth();
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [isErrorModal, setIsErrorModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState('account');
  const featureLimit = useFeatureLimitStore((state) => state.featureLimit);

  // Wrapper function to ensure selectedFeature is properly set
  const handleSetSelectedFeature = useCallback((feature: string) => {
    setSelectedFeature(feature);
  }, []);
  const [reportData, setReportData] = useState<Record<string, any>>({
    recipient: userDetails?.email,
    // calling this period(frequency) to comply with backend field
    period: DateFilterEnum.LAST_24_HOURS,
    // Initialize with empty arrays for each feature type
    account: [],
    hashtag: [],
    keyword: [],
    lead: [],
    alert: [],
    // Initialize influencerData for account tracking
    influencerData: [],
  });

  // util actions
  const handleIncludedData = useCallback(
    (title: string) => {
      const currentData = reportData[selectedFeature] ?? [];

      const updatedData: string[] = currentData.includes(title) ? currentData.filter((item: string) => item !== title) : [...currentData, title];

      console.log('updatedData => ', updatedData);

      setReportData((prevData) => {
        const updatedReportData = {
          ...prevData,
          [selectedFeature]: updatedData,
        };
        if (updatedData.length === 0) {
          delete updatedReportData[selectedFeature];
        }
        return updatedReportData;
      });
    },
    [reportData, selectedFeature]
  );

  const getGenerateReportButtonState = useCallback(() => {
    if (!reportData?.recipient) {
      return { status: true, text: 'Please enter a recipient email' };
    }
    console.log('reportData => ', reportData);

    // Check if selectedFeature requires reportIds (account, hashtag)
    if (
      Object.values(TrackerTypeEnum)
        .map((type) => type.toLowerCase())
        .includes(selectedFeature) &&
      (!reportData.reportIds || reportData.reportIds.length === 0)
    ) {
      return { status: true, text: `Please select a(n) ${selectedFeature}` };
    }

    // Check if any data is included for the selected feature
    if (!reportData[selectedFeature] || !reportData[selectedFeature].length) {
      return { status: true, text: `Please include at least one data` };
    }

    if (isFeatureDisabled(featureLimit, 'reportGeneration')) {
      return {
        status: true,
        text: "You don't have access to this feature, Kindly upgrade your plan",
      };
    }
    return { status: false, text: 'Generate Report' };
  }, [reportData, selectedFeature, featureLimit]);

  const generateReportBtnStatus = getGenerateReportButtonState();

  // Mutations
  const {
    mutate: generateReport,
    error: reportGenerationError,
    isLoading: isGeneratingReport,
  } = useMutation({
    mutationFn: async () => {
      const includedFields = (reportData[selectedFeature] ?? []).map((item: string) => TextHelper.joinText(item).toLowerCase());

      if (!reportData.recipient) throw new Error('Recipient is required');
      if (!reportData.reportIds || reportData.reportIds.length === 0) throw new Error(`Please select a(n) ${selectedFeature}`);
      if (!reportData.period) throw new Error('Frequency is required');
      if (!includedFields.length) throw new Error('Please include at least one data');

      // Structure influencer_ids by platform for account tracking
      const getInfluencerIdsByPlatform = () => {
        if (selectedFeature !== 'account' || !reportData.influencerData) {
          return {
            instagram: '',
            facebook: '',
            linkedin: '',
          };
        }

        const platformGroups = {
          instagram: '',
          facebook: '',
          linkedin: '',
        };

        // Create a mapping for different platform name variations
        const platformMapping: { [key: string]: keyof typeof platformGroups } = {
          instagram: 'instagram',
          ig: 'instagram',
          facebook: 'facebook',
          fb: 'facebook',
          linkedin: 'linkedin',
          li: 'linkedin',
        };

        reportData.influencerData.forEach((influencer: any) => {
          const platform = influencer.social_platform?.toLowerCase();

          // Map the platform to our expected keys
          const mappedPlatform = platformMapping[platform || ''];

          if (mappedPlatform && platformGroups.hasOwnProperty(mappedPlatform)) {
            // If multiple influencers for same platform, join them with comma
            if (platformGroups[mappedPlatform]) {
              platformGroups[mappedPlatform] += `,${influencer.influencer_id}`;
            } else {
              platformGroups[mappedPlatform] = influencer.influencer_id;
            }
          }
        });

        return platformGroups;
      };

      const commonPayload = {
        user_id: userDetails?.userId!,
        recipient: reportData.recipient,
        period: reportData.period,
        report_generation_type: selectedFeature.toUpperCase(),
        report_generation_subtypes: reportData.reportType,
        influencer_ids: getInfluencerIdsByPlatform(),
        tracker_id: ['hashtag'].includes(selectedFeature) ? reportData.reportIds?.[0] : undefined,
      };

      switch (selectedFeature) {
        case 'account': {
          const dto: AccountTrackingReportDto = {
            ...commonPayload,
            report_generation_subtypes: reportData.reportType,
            report_generation_type: ReportTypeEnum.ACCOUNT,
            included_fields: includedFields as AccountTrackingReportFieldsEnum[],
          };
          const response = await ReportGenerationService.generateAccountTrackingReport(dto);
          if (!response.status) throw new Error(response.responseMessage);
          return response.responseData;
        }

        case 'hashtag': {
          const dto: HashtagTrackingReportDto = {
            ...commonPayload,
            report_generation_subtype: reportData.reportType?.[0] ?? undefined,
            report_generation_type: ReportTypeEnum.HASHTAG,
            included_fields: includedFields as HashtagTrackingReportFieldsEnum[],
          };
          const response = await ReportGenerationService.generateHashtagTrackingReport(dto);
          if (!response.status) throw new Error(response.responseMessage);
          return response.responseData;
        }

        default:
          throw new Error('This report type is not supported yet.');
      }
    },
    onSuccess: () => setIsSuccessModal(true),
    onError: () => setIsErrorModal(true),
  });

  return {
    // states
    selectedFeature,
    setSelectedFeature: handleSetSelectedFeature,
    reportData,
    setReportData,
    isSuccessModal,
    setIsSuccessModal,
    isErrorModal,
    setIsErrorModal,

    // api
    generateReport,
    isGeneratingReport,
    reportGenerationError,

    // utils
    handleIncludedData,
    isBtnDisabled: generateReportBtnStatus.status,
    btnTooltipText: generateReportBtnStatus.text,
  };
};
