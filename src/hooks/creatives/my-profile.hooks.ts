import { CreativeProfileService } from '@/api/CreativeProfileService';
import { QueryKeyEnum } from '@/models/enum-models/QueryKeyEnum';
import { useAuth } from '@/providers/AuthProvider';
import Pictures from '@/utils/icon/Pictures';
import Portfolio from '@/utils/icon/Portfolio';
import Video from '@/utils/icon/Videos';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

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

export const useMyProfileHook = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('pictures');
  const [editProfile, setEditProfile] = useState(false);
  const { saveCreativeUserProfile } = useAuth();

  const navigate = useCallback(
    (route: string) => {
      router.push(route);
    },
    [router]
  );

  const { data: creativeProfile, isLoading } = useQuery({
    queryKey: [QueryKeyEnum.CREATIVE_PROFILE, router.query.id],
    queryFn: async () => {
      if (!router.query.id) return null;

      const response = await CreativeProfileService.getProfileByUserIdApi(router.query.id as string, false);

      if (response.responseData) {
        saveCreativeUserProfile(response.responseData);
      }

      return response.responseData;
    },
    enabled: !!router.query.id,
  });

  return {
    navigate,
    creativeProfile,
    tabButtons,
    activeTab,
    setActiveTab,
    editProfile,
    setEditProfile,
    isLoading,
  };
};
