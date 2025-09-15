import React, { useCallback, useState } from 'react';
import useCustomTheme from '@/hooks/theme.hook';
import { BsPerson } from 'react-icons/bs';
import { ClientIcon, HoveredClientIcon } from '@/components/atoms/Icons';
import { useRouter } from 'next/router';
import { ItemType, Tab } from '@/types';
import { AuthService } from '../../api/AuthService';

const useSignupAshook = () => {
  const router = useRouter();
  const { themeColors } = useCustomTheme();
  const [activeTab, setActiveTab] = useState<Tab>('');
  const [loading, setLoading] = useState(false);

  const boxSX = {
    border: '3px solid transparent',
    borderRadius: '20px',
    padding: '40px 0px',
    '&:hover': {
      cursor: 'pointer',
      borderColor: themeColors.primary,
    },
  };

  const getGoogleAuth = async (type: string) => {
    if (loading) return;
    setLoading(true);
    const response = await AuthService.getGoogleAuth(
      `${process.env.NEXT_PUBLIC_CLIENT_HOST}/register/${type}`
    );
    setLoading(false);
    router.push(response.url);
  };

  const navigate = useCallback(
    (route: string) => {
      router.push(route);
    },
    [router]
  );

  const items: ItemType[] = [
    {
      image: (
        <BsPerson
          style={{ color: themeColors.signupIcon, width: 25, height: 32 }}
        />
      ),
      hoverImage: (
        <BsPerson
          style={{ color: themeColors.primary, width: 25, height: 32 }}
        />
      ),
      title: 'Creative',
      text: 'I am a creative, looking to work in an event.',
      buttonText: 'Join as a creative',
      identify: 'creative',
    },
    {
      image: <ClientIcon />,
      hoverImage: <HoveredClientIcon />,
      title: 'Business',
      text: 'I am a business, looking to grow and expand.',
      buttonText: 'Join as a business',
      identify: 'client',
    },
  ];

  const renderTextColor = (
    tab: Tab,
    smallText?: boolean
  ): 'primary' | 'base' | 'signup' => {
    return tab === activeTab ? 'primary' : smallText ? 'signup' : 'base';
  };

  const renderButtonColor = (tab: Tab): 'primary' | 'signup' => {
    return tab === activeTab ? 'primary' : 'signup';
  };

  return {
    boxSX,
    activeTab,
    setActiveTab,
    navigate,
    renderTextColor,
    renderButtonColor,
    items,
    loading,
    getGoogleAuth,
  };
};

export default useSignupAshook;
