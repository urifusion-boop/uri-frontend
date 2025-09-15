import Text from '@/components/atoms/CustomText';
import { Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiSearch, FiSend } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { ClientProfileService } from '../../../api/ClientProfileService';
import { CreativeProfileService } from '../../../api/CreativeProfileService';
import { NotificationService } from '../../../api/NotificationService';
import CustomButton from '../../../components/atoms/CustomButton';
import CustomTabSelect from '../../../components/atoms/CustomTabSelect';
import DashboardLayout from '../../../components/atoms/DashboardLayout';
import InputField from '../../../components/atoms/Input';
import SeoHead from '../../../components/atoms/SeoHead';
import Spinner from '../../../components/loaders/Spinner';
import CreateNotificationSchema from '../../../data/schemas/CreateNotificationSchema';
import { SchemaHelper } from '../../../helpers/SchemaHelper';
import { TextHelper } from '../../../helpers/TextHelper';
import useCustomTheme from '../../../hooks/theme.hook';
import { ClientProfileDto } from '../../../models/dtos/ClientProfileDto';
import { CreativeProfileDto } from '../../../models/dtos/CreativeProfileDto';
import { NotificationTypeEnum } from '../../../models/enum-models/NotificationTypeEnum';
import { useAuth } from '../../../providers/AuthProvider';

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState('send');

  const tabButtons = [
    {
      label: 'Send User Notification',
      value: 'send',
      icon: ({ color, size }: { color: string; size: number }) => <FiSend color={color} size={size} />,
      iconSize: 24,
    },
  ];

  return (
    <>
      <SeoHead title="Notifications" />

      <DashboardLayout>
        <div className="body__overlay"></div>
        <div className="app__slide-wrapper">
          <Text
            size={24}
            weight={700}
            sx={{
              paddingBottom: '10px',
              marginBottom: '20px',
            }}
          >
            Notifications
          </Text>
          <CustomTabSelect active={activeTab} buttons={tabButtons} onClick={(value) => setActiveTab(value)} isMobile width="30px" />

          {activeTab === 'send' && <SendNotification />}
        </div>
      </DashboardLayout>
    </>
  );
};

const SendNotification = () => {
  const router = useRouter();
  const { userDetails } = useAuth();
  const { themeColors } = useCustomTheme();
  const [newNotification, setNewNotification] = useState({
    userId: '',
    title: '',
    message: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<CreativeProfileDto & ClientProfileDto>();

  const { data: users, isLoading } = useQuery({
    queryKey: ['users', userDetails?.userId, searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 1) return [];
      let result: (CreativeProfileDto & ClientProfileDto)[] = [];

      const creativeResponse = await CreativeProfileService.getProfilesBySearchApi({
        pageNumber: 1,
        pageSize: 5,
        searchTerm,
      });
      if (creativeResponse.status && creativeResponse.responseData?.data) result = result.concat(creativeResponse.responseData?.data);
      const clientResponse = await ClientProfileService.getProfilesBySearchApi({
        pageNumber: 1,
        pageSize: 5,
        searchTerm,
      });
      if (clientResponse.status && clientResponse.responseData?.data) result = result.concat(clientResponse.responseData?.data);

      return result;
    },
    enabled: typeof userDetails?.userId !== undefined,
  });

  const createNotification = async () => {
    setLoading(true);
    const response = await NotificationService.createNotificationApi({
      ...newNotification,
      notificationType: NotificationTypeEnum.GENERIC,
      icon: '📧',
    });
    if (response.status) {
      setNewNotification({
        userId: '',
        title: '',
        message: '',
      });
      toast.success(response.responseMessage);
    } else {
      toast.error(response.responseMessage);
    }
    setLoading(false);
  };

  const schema = new SchemaHelper(CreateNotificationSchema);

  return (
    <Box sx={{ width: '600px', maxWidth: '100%', paddingBottom: '100px' }}>
      {!selectedUser && (
        <Box
          style={{
            marginBottom: '30px',
          }}
        >
          <InputField
            label="Select target user."
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            mt={1}
            leftIcon
            icon={<FiSearch color={themeColors.placeholder} style={{ width: 24, height: 24 }} />}
          />
        </Box>
      )}

      {isLoading && (
        <Box
          className="d-flex"
          sx={{
            height: '100px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Spinner color={themeColors.primary} />
        </Box>
      )}

      {searchTerm.length > 0 && users && users?.length > 0
        ? users.map((user, index) => (
            <Box
              sx={{
                height: '50px',
                backgroundColor: user.userId === selectedUser?.userId ? themeColors.primary : 'white',
                borderRadius: '8px',
                marginBottom: '5px',
                display: 'flex',
                boxShadow: '0px 2px 4px 0 rgba(0,0,0,0.1)',
                padding: '10px',
              }}
              className="pointer"
              onClick={() => {
                setSelectedUser(user);
                setSearchTerm('');
                setNewNotification({
                  ...newNotification,
                  userId: String(user.userId),
                });
              }}
              key={index}
            >
              <Box
                className="d-flex"
                sx={{
                  flex: 1,
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    width: '35px',
                    aspectRatio: '1',
                    borderRadius: '50px',
                    backgroundImage: `url(${TextHelper.setUrl(user?.headshot?.url ?? user.logo?.url ?? '/assets/images/logo.png')})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    margin: '0px 15px 0px 0px',
                    cursor: 'pointer',
                  }}
                  onClick={() => router.push(`/admin/creatives/${user.userId}`)}
                ></Box>
                <Box
                  style={{
                    flex: 1,
                    alignItems: 'center',
                  }}
                >
                  <Text size={16} weight={500} color={user.userId === selectedUser?.userId ? 'white' : 'black'}>
                    {user.user?.firstName ?? 'N/A'} {user.user?.lastName ?? ''}
                  </Text>
                  <Text size={7} weight={300} color={user.userId === selectedUser?.userId ? 'white' : 'black'}>
                    {user.creativeCategories && user.creativeCategories.length > 0 ? user.creativeCategories[0].replace('_', ' ') : ''}
                    {user.businessDetail ? `${user.businessDetail.name ?? 'N/A'} (${user.businessDetail.type?.replace('_', ' ')})` : ''}
                  </Text>
                </Box>
              </Box>
            </Box>
          ))
        : null}

      {selectedUser && (
        <>
          <Text
            size={15}
            weight={600}
            sx={{
              marginBottom: '20px',
            }}
          >
            Selected User
          </Text>
          <Box
            sx={{
              height: '50px',
              backgroundColor: themeColors.primary,
              borderRadius: '8px',
              marginBottom: '5px',
              display: 'flex',
              boxShadow: '0px 2px 4px 0 rgba(0,0,0,0.1)',
              padding: '10px',
              marginTop: '20px',
            }}
            className="pointer"
          >
            <Box
              className="d-flex"
              sx={{
                flex: 1,
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  width: '35px',
                  aspectRatio: '1',
                  borderRadius: '50px',
                  backgroundImage: `url(${TextHelper.setUrl(selectedUser?.headshot?.url ?? selectedUser.logo?.url ?? '/assets/images/logo.png')})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  margin: '0px 15px 0px 0px',
                  cursor: 'pointer',
                }}
                onClick={() => router.push(`/admin/creatives/${selectedUser.userId}`)}
              ></Box>
              <Box
                style={{
                  flex: 1,
                  alignItems: 'center',
                }}
              >
                <Text size={16} weight={500} color={'white'}>
                  {selectedUser.user?.firstName ?? 'N/A'} {selectedUser.user?.lastName ?? ''}
                </Text>
                <Text size={7} weight={300} color={'white'}>
                  {selectedUser.creativeCategories && selectedUser.creativeCategories.length > 0 ? selectedUser.creativeCategories[0].replace('_', ' ') : ''}
                  {selectedUser.businessDetail ? `${selectedUser.businessDetail.name ?? 'N/A'} (${selectedUser.businessDetail.type?.replace('_', ' ')})` : ''}
                </Text>
              </Box>
            </Box>

            <Box
              sx={{
                width: '40px',
                height: '100%',
              }}
            >
              <IoClose
                style={{
                  width: '30px',
                  height: '30px',
                  color: 'white',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedUser(undefined);
                  setNewNotification({ ...newNotification, userId: '' });
                }}
              />
            </Box>
          </Box>
        </>
      )}

      {!selectedUser && !searchTerm && (
        <Text
          size={15}
          weight={600}
          sx={{
            marginBottom: '20px',
            color: themeColors.primary,
          }}
        >
          Select a user to send notifications to.
        </Text>
      )}

      <Box
        sx={{
          opacity: selectedUser ? '1' : '0.5',
          pointerEvents: selectedUser ? 'all' : 'none',
        }}
      >
        <InputField
          label="Title"
          placeholder="Title of the notification (optional)."
          value={newNotification.title}
          onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
          mt={3}
        />

        <Text
          size={15}
          weight={600}
          sx={{
            mb: '20px',
            mt: '30px',
          }}
        >
          Message
        </Text>
        <textarea
          maxLength={200}
          required
          style={{
            width: '100%',
            minHeight: '173px',
            maxHeight: '173px',
            margin: '0px 0 0px',
            border: '1px solid #E0DEF7',
            borderRadius: '5px',
            outline: '1px solid #E0DEF7',
            padding: '18px',
            background: 'white',
          }}
          placeholder="Not more than 500 characters."
          onChange={(e) => {
            setNewNotification({ ...newNotification, message: e.target.value });
          }}
          value={newNotification.message}
        ></textarea>
        {newNotification.message?.length < 1 ? (
          <Text size={12} weight={400} color="red">
            Message must be at least 10 characters.
          </Text>
        ) : null}
      </Box>

      <Box mt={'30px'} maxWidth={'300px'}>
        <CustomButton mode="primary" onClick={() => createNotification()} disabled={loading || newNotification.userId?.length < 1 || newNotification.message?.length < 1}>
          {loading ? <Spinner color="#fff" /> : 'Send'}
        </CustomButton>
      </Box>
    </Box>
  );
};

export default NotificationsPage;
