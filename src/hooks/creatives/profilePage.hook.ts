import { CreativeProfileService } from '@/api/CreativeProfileService';
import { QueryKeyEnum } from '@/models/enum-models/QueryKeyEnum';
import Pictures from '@/utils/icon/Pictures';
import Portfolio from '@/utils/icon/Portfolio';
import Video from '@/utils/icon/Videos';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';

const tabButtons: any = [
  {
    label: 'Pictures',
    value: 'pictures',
    icon: Pictures,
  },
  {
    label: 'Portfolio',
    value: 'portfolio',
    icon: Portfolio,
  },
  {
    label: 'Videos',
    value: 'videos',
    icon: Video,
  },
];

export const useProfileHook = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('pictures');

  const { userDetails } = useAuth();

  const navigate = useCallback(
    (route: string) => {
      router.push(route);
    },
    [router]
  );

  const { data: creativeProfile, isLoading } = useQuery({
    queryKey: [QueryKeyEnum.CREATIVE_PROFILE, userDetails?.userId, router.query.id],
    queryFn: async () => {
      if (!router.query.id || !userDetails?.userId) return null;
      return (await CreativeProfileService.getProfileByUserIdApi(router.query.id as string, userDetails?.userId !== router.query.id)).responseData;
    },
    enabled: !!router.query.id,
  });

  return {
    navigate,
    tabButtons,
    activeTab,
    setActiveTab,
    creativeProfile,
    isLoading,
  };
};
