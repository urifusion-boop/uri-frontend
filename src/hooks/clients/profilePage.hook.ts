import { ClientProfileService } from '@/api/ClientProfileService';
import { QueryKeyEnum } from '@/models/enum-models/QueryKeyEnum';
import { useAuth } from '@/providers/AuthProvider';
import Pictures from '@/utils/icon/Pictures';
import Portfolio from '@/utils/icon/Portfolio';
import Video from '@/utils/icon/Videos';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { ModelAttendeeIcon, PhotographerAttendeeIcon } from '../../components/atoms/Icons';
import { UserDto } from '../../models/dtos/UserDto';

const tabButtons: any = [
  {
    label: 'Business details',
    value: 'business details',
    icon: Portfolio,
  },
  {
    label: 'Photos',
    value: 'photos',
    icon: Pictures,
  },
  {
    label: 'Videos',
    value: 'videos',
    icon: Video,
  },
];

export const useProfileHook = () => {
  const router = useRouter();
  const [modalState, setModalState] = useState('AddNote');
  const [clientData, setClientData] = useState<UserDto | null>({} as UserDto);
  const [activeTab, setActiveTab] = useState('business details');
  const [editProfile, setEditProfile] = useState(false);
  const { saveClientUserProfile } = useAuth();

  const navigate = useCallback(
    (route: string) => {
      router.push(route);
    },
    [router]
  );

  const { data: clientProfile, isLoading } = useQuery({
    queryKey: [QueryKeyEnum.CLIENT_PROFILE, router.query.id],
    queryFn: async () => {
      if (!router.query.id) return null;

      const response = await ClientProfileService.getProfileByUserIdApi(router.query.id as string);

      if (response.responseData) {
        saveClientUserProfile(response.responseData);
      }

      return response.responseData;
    },
    enabled: !!router.query.id,
  });

  const getAttendeeIcon: any = (attendeeType: string) => {
    const icons: any = {
      Model: ModelAttendeeIcon,
      Photographer: PhotographerAttendeeIcon,
    };
    return icons[attendeeType];
  };
  return {
    navigate,
    getAttendeeIcon,
    clientData,
    setClientData,
    clientProfile,
    tabButtons,
    activeTab,
    setActiveTab,
    modalState,
    setModalState,
    editProfile,
    setEditProfile,
    isLoading,
  };
};
