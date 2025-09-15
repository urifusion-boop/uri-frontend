import { containsNumber, containsSymbol } from '@/configs/rules.config';
import { UriResponse } from '@/models/responses/UriResponse';
import { Box, Grid, Skeleton } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FaFileExcel } from 'react-icons/fa';
import { HiMiniUserGroup } from 'react-icons/hi2';
import { IoClose } from 'react-icons/io5';
import { UserService } from '../../api/UserService';
import { AdminProfileService } from '../../api/admin/AdminProfileService';
import { AdminUserService } from '../../api/admin/AdminUserService';
import { userRoles, userTypes } from '../../data/profileSetup';
import { userStatuses } from '../../data/user';
import { TextHelper } from '../../helpers/TextHelper';
import useCustomTheme from '../../hooks/theme.hook';
import { useModal } from '../../hooks/utils.hook';
import { ClientProfileDto } from '../../models/dtos/ClientProfileDto';
import { CreativeProfileDto } from '../../models/dtos/CreativeProfileDto';
import { GetClientsProfileDto } from '../../models/dtos/GetClientsProfileDto';
import { GetCreativesProfileDto } from '../../models/dtos/GetCreativesProfileDto';
import { UserRoleEnum } from '../../models/enum-models/UserRoleEnums';
import { useAuth } from '../../providers/AuthProvider';
import { ISelectData } from '../../types';
import CardHeaderDropdown from '../atoms/CardHeaderDropdown';
import CustomButton from '../atoms/CustomButton';
import CustomRadio from '../atoms/CustomRadio';
import Text from '../atoms/CustomText';
import InputField from '../atoms/Input';
import PhoneInput from '../atoms/PhoneInput';
import SelectField from '../atoms/SelectField';
import CustomModal from '../modals/CustomModal';

interface ICreativeRowProps {
  userData: CreativeProfileDto;
  key: number;
}

interface IClientRowProps {
  userData: ClientProfileDto;
  key: number;
}

const defaultNewUser = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  password: '',
  confirmPassword: '',
  userType: '',
  role: '',
};

const UserTable = () => {
  const { themeColors } = useCustomTheme();
  const { userDetails } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<'creatives' | 'clients'>('creatives');
  const [users, setUsers] = useState<UriResponse<GetCreativesProfileDto | GetClientsProfileDto> | null>();
  const [show, setShow] = useState(false);
  const [newUser, setNewUser] = useState(defaultNewUser);
  const [openModal, setOpenModal] = useState(false);
  const [action, setAction] = useState('open');
  const [bulkUserFile, setBulkUserFile] = useState<File | null>(null);
  const [selectedUserType, setSelectedUserType] = useState<ISelectData>({} as ISelectData);
  const [selectedRole, setSelectedRole] = useState<ISelectData>({} as ISelectData);
  const [loading, setLoading] = useState(false);

  const inputFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const toggleShow = () => setShow(!show);

  const { isLoading } = useQuery({
    queryKey: [`user-profiles`, userDetails?.userId, currentPage, filter],
    queryFn: async () => {
      setUsers(null);
      const result =
        filter === 'creatives'
          ? await AdminProfileService.getCreativeProfilesByFilterApi({
              pageNumber: currentPage,
              pageSize: 10,
            })
          : await AdminProfileService.getClientProfilesByFilterApi({
              pageNumber: currentPage,
              pageSize: 10,
            });
      setUsers(result);
    },
    enabled: typeof userDetails?.userId !== undefined,
  });

  const createUser = async () => {
    setLoading(true);
    const response = await AdminUserService.createUserApi(newUser);
    if (response.status) {
      toast.success(response.responseMessage);
      setNewUser(defaultNewUser);
      setAction('open');
      setOpenModal(false);
    } else toast.error(response.responseMessage);
    setLoading(false);
  };

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) return;
    setBulkUserFile(fileObj);
  };

  const createBulkUsers = async () => {
    if (!bulkUserFile) return;
    setLoading(true);

    const fileData = new FormData();
    fileData.append('file', bulkUserFile);

    const response = await AdminUserService.createBulkUsersApi(fileData);

    if (response.status) {
      toast.success(response.responseMessage);
      setAction('open');
      setOpenModal(false);
      setBulkUserFile(null);
    } else toast.error(response.responseMessage);
    setLoading(false);
  };

  return (
    <>
      <div className="row">
        <div className="col-xxl-12">
          <div className="card__wrapper">
            <div className="card__header">
              <div className="card__header-top mb-5">
                <div className="card__title-inner">
                  <div className="card__header-icon">
                    <HiMiniUserGroup
                      style={{
                        width: '26px',
                        height: '26px',
                        color: themeColors.primary,
                      }}
                    />
                  </div>
                  <div className="card__header-title">
                    <h4>Users</h4>
                  </div>
                </div>
                <div className="breadcrumb__tab">
                  <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link${filter === 'creatives' ? ' active' : ''}`}
                        id="day-tab-1"
                        data-bs-toggle="tab"
                        data-bs-target="#day-tab-1-pane"
                        type="button"
                        role="tab"
                        aria-controls="day-tab-1-pane"
                        aria-selected={filter === 'creatives' ? 'true' : 'false'}
                        onClick={() => {
                          setFilter('creatives');
                          setCurrentPage(1);
                        }}
                      >
                        Creatives
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link${filter === 'clients' ? ' active' : ''}`}
                        id="day-tab-2"
                        data-bs-toggle="tab"
                        data-bs-target="#day-tab-2-pane"
                        type="button"
                        role="tab"
                        aria-controls="day-tab-2-pane"
                        aria-selected={filter === 'clients' ? 'true' : 'false'}
                        onClick={() => {
                          setFilter('clients');
                          setCurrentPage(1);
                        }}
                      >
                        Clients
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link`}
                        style={{ borderLeft: '1px solid lightgray' }}
                        id="day-tab-2"
                        data-bs-toggle="tab"
                        data-bs-target="#day-tab-2-pane"
                        type="button"
                        role="tab"
                        aria-controls="day-tab-2-pane"
                        aria-selected={'false'}
                        onClick={() => {
                          setAction('open');
                          setOpenModal(true);
                        }}
                      >
                        Create User
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div
              className="attendant__wrapper mb-60"
              style={{
                overflowX: users && users.responseData && users.responseData.data && users.responseData.data?.length > 0 ? 'auto' : 'hidden',
              }}
            >
              {isLoading ? (
                <table id="applications-table">
                  <thead>
                    <tr>
                      <th colSpan={2}>Name</th>
                      <th>Email</th>
                      <th>Type</th>
                      <th>Location</th>
                      <th>Date Created</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4].map((item) => (
                      <tr key={item}>
                        <td>
                          <Skeleton animation="wave" height={'30px'} width={'80px'} />
                        </td>
                        <td>
                          <Skeleton animation="wave" height={'30px'} width={'80px'} />
                        </td>
                        <td>
                          <Skeleton animation="wave" height={'30px'} width={'80px'} />
                        </td>
                        <td>
                          <Skeleton animation="wave" height={'30px'} width={'80px'} />
                        </td>
                        <td>
                          <Skeleton animation="wave" height={'30px'} width={'80px'} />
                        </td>
                        <td>
                          <Skeleton animation="wave" height={'30px'} width={'80px'} />
                        </td>
                        <td>
                          <Skeleton animation="wave" height={'30px'} width={'80px'} />
                        </td>
                        <td>
                          <Skeleton animation="wave" height={'30px'} width={'80px'} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <>
                  {users && users.responseData && users.responseData.data && users.responseData.data?.length > 0 ? (
                    <table id="applications-table">
                      <thead>
                        <tr>
                          <th colSpan={2}>Name</th>
                          <th>Email</th>
                          <th>Type</th>
                          <th>Location</th>
                          <th>Date Created</th>
                          <th>Status</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {users &&
                          users?.responseData &&
                          users?.responseData?.data &&
                          users?.responseData?.data?.length > 0 &&
                          users.responseData?.data?.map((user, index) =>
                            filter === 'creatives' ? <CreativeUserTableRow userData={user as any} key={index} /> : <ClientUserTableRow userData={user as any} key={index} />
                          )}
                      </tbody>
                    </table>
                  ) : (
                    <Box sx={{ width: '100%', marginBottom: '10px' }}>
                      <img
                        src="/assets/vectors/no-data-2.png"
                        alt="image"
                        style={{
                          width: '300px',
                          margin: '20px calc(50% - 150px) 0px calc(50% - 150px)',
                        }}
                      />

                      <Text size={15} weight={400} sx={{ mt: 1 }} center>
                        {filter === 'creatives' ? 'There are no creatives to view.' : 'There are no clients to view.'}
                      </Text>
                    </Box>
                  )}
                </>
              )}
            </div>
            {users && users.responseData && users.responseData.data && users.responseData.data?.length > 0 && (
              <Box sx={{ translate: '0px -40px', float: 'right', mt: '28px' }}>
                <Pagination
                  count={Math.ceil(Number(users.responseData.pageSize! || 1) / 4)}
                  defaultPage={1}
                  siblingCount={0}
                  boundaryCount={0}
                  page={Number(users.responseData.page || 1)}
                  onChange={(event, pageNumber) => setCurrentPage(pageNumber)}
                />
              </Box>
            )}
          </div>
        </div>
      </div>

      <CustomModal open={openModal} closeOnOverlayClick closeModal={() => setOpenModal(false)} maxWidth="90%" width="533px" showCloseIcon>
        {action === 'open' && (
          <Box sx={{ padding: '20px 40px' }}>
            <Text size={24} weight={700} center color="#141416" sx={{ mb: 2 }}>
              Create User(s)
            </Text>

            <CustomButton mode="primary" style={{ marginTop: '20px' }} onClick={() => setAction('createUser')}>
              Create Single User
            </CustomButton>
            <CustomButton mode="inverse" style={{ marginTop: '20px' }} onClick={() => setAction('createBulkUsers')}>
              Create Bulk Users
            </CustomButton>
          </Box>
        )}

        {action === 'createUser' && (
          <Box sx={{ padding: '20px 40px' }}>
            <Text size={24} weight={700} center color="#141416" sx={{ mb: 2 }}>
              Create User
            </Text>

            <InputField
              label="First Name*"
              placeholder="The user's first name."
              type="text"
              value={newUser.firstName}
              onChange={(e) => {
                setNewUser({ ...newUser, firstName: e?.target.value });
              }}
            />
            {newUser.firstName?.length < 2 ? (
              <Text size={12} weight={400} color="red">
                First Name must be at least two characters.
              </Text>
            ) : null}

            <InputField
              label="Last Name*"
              placeholder="The user's last name."
              type="text"
              value={newUser.lastName}
              onChange={(e) => {
                setNewUser({ ...newUser, lastName: e?.target.value });
              }}
              mt={3}
            />
            {newUser.lastName?.length < 2 ? (
              <Text size={12} weight={400} color="red">
                Last Name must be at least two characters.
              </Text>
            ) : null}

            <InputField
              label="Email*"
              placeholder="The user's email address."
              type="text"
              value={newUser.email}
              onChange={(e) => {
                setNewUser({ ...newUser, email: e?.target.value });
              }}
              mt={3}
            />
            {!TextHelper.containsEmail(newUser.email) ? (
              <Text size={12} weight={400} color="red">
                Please use a valid email address.
              </Text>
            ) : null}

            <PhoneInput
              label="Phone Number"
              value={newUser.phoneNumber}
              onChange={(value) => (typeof value === 'string' ? setNewUser({ ...newUser, phoneNumber: value }) : () => {})}
              errorText={'Please use a valid phone number.'}
              mt={3}
            />

            <InputField
              label="Password"
              placeholder="Enter Password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  password: e?.target.value,
                  confirmPassword: e?.target.value,
                })
              }
              mt={3}
              type={show ? 'text' : 'password'}
              rightIcon
              icon={
                !show ? (
                  <AiOutlineEyeInvisible color={themeColors.placeholder} style={{ width: 24, height: 24 }} className="pointer" onClick={toggleShow} />
                ) : (
                  <AiOutlineEye color={themeColors.placeholder} style={{ width: 24, height: 24 }} className="pointer" onClick={toggleShow} />
                )
              }
            />

            <Box sx={{ overflow: 'hidden' }}>
              <Box sx={{ float: 'left' }}>
                <CustomRadio disabled label="At least 8 characters" checked={typeof newUser.password === 'string' && newUser.password.trim().length >= 8} value="" fontSize={10} />
              </Box>
              <Box sx={{ float: 'left' }}>
                <CustomRadio disabled label="At least 1 symbol" checked={typeof newUser.password === 'string' && containsSymbol(newUser.password)} value="" fontSize={10} />
              </Box>
              <Box sx={{ float: 'left' }}>
                <CustomRadio disabled label="At least 1 number" checked={typeof newUser.password === 'string' && containsNumber(newUser.password)} value="" fontSize={10} />
              </Box>
            </Box>

            <SelectField
              label="User Role"
              options={userRoles}
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e ? e : { label: '', value: '' });
                setNewUser({ ...newUser, role: String(e?.value) });
              }}
              placeholder="Select a role."
              mt={3}
            />
            {!newUser.role ? (
              <Text size={12} weight={400} color="red">
                User role is required.
              </Text>
            ) : null}

            <Box
              sx={{
                opacity: newUser.role !== UserRoleEnum.USER ? '0.5' : '1',
                pointerEvents: newUser.role !== UserRoleEnum.USER ? 'none' : 'all',
              }}
            >
              <SelectField
                label="User Type"
                options={userTypes}
                value={selectedUserType}
                onChange={(e) => {
                  setSelectedUserType(e ? e : { label: '', value: '' });
                  setNewUser({ ...newUser, userType: String(e?.value) });
                }}
                placeholder="Select a user type."
                mt={3}
              />
              {!newUser.userType || newUser.role !== UserRoleEnum.USER ? (
                <Text size={12} weight={400} color="red">
                  {newUser.role !== UserRoleEnum.USER ? 'User Type is disabled for Admin and Super Admin users.' : 'User Type is required.'}
                </Text>
              ) : null}
            </Box>

            <CustomButton mode="primary" style={{ marginTop: '20px' }} onClick={() => createUser()} loading={loading}>
              Create User
            </CustomButton>
          </Box>
        )}

        {action === 'createBulkUsers' && (
          <Box sx={{ padding: '20px 40px' }}>
            <Text size={24} weight={700} center color="#141416" sx={{ mb: 2 }}>
              Create Users
            </Text>

            {!bulkUserFile ? (
              <>
                <Box
                  className="d-flex pointer"
                  sx={{
                    height: '150px',
                    backgroundColor: 'whitesmoke',
                    border: '4px dashed lightgray',
                    borderRadius: '10px',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onClick={() => inputFileRef.current?.click()}
                >
                  <FaFileExcel style={{ width: '30px', height: '30px' }} />
                  <Text size={14} weight={500} center color="#141416" sx={{ mt: 2 }}>
                    Click to upload an Excel file (.xlsx) containing the users details.
                  </Text>
                </Box>

                <input style={{ display: 'none' }} ref={inputFileRef} type="file" accept=".xlsx" onChange={(e) => handleFile(e)} />
              </>
            ) : (
              <Box
                className="d-flex"
                sx={{
                  padding: '15px 20px',
                  alignItems: 'center',
                  borderRadius: '8px',
                  border: `2px solid ${themeColors.primary}`,
                }}
              >
                <FaFileExcel
                  style={{
                    width: '30px',
                    height: '30px',
                    marginRight: '15px',
                    color: themeColors.primary,
                  }}
                />
                <Text size={15} weight={500} center color={themeColors.primary} sx={{ marginTop: '5px', display: 'flex', flex: '1' }}>
                  {bulkUserFile.name}
                </Text>
                <IoClose
                  style={{
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    color: themeColors.primary,
                  }}
                  onClick={() => setBulkUserFile(null)}
                />
              </Box>
            )}

            <CustomButton mode="primary" style={{ marginTop: '30px' }} onClick={() => createBulkUsers()} disabled={loading || !bulkUserFile} loading={loading}>
              Upload
            </CustomButton>
          </Box>
        )}
      </CustomModal>
    </>
  );
};

const CreativeUserTableRow: React.FC<ICreativeRowProps> = ({ userData, key }) => {
  const router = useRouter();
  const [user, setUser] = useState(userData);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState('delete');
  const { open, setOpen } = useModal();
  const { themeColors } = useCustomTheme();
  const [newStatus, setNewStatus] = useState<ISelectData>({} as ISelectData);

  const updateUserStatus = async () => {
    setLoading(true);
    const response = await UserService.updateUserApi({
      userId: user.userId,
      userStatus: String(newStatus.value) ?? 'ACTIVE',
    });
    if (response.status) {
      setUser({
        ...user,
        user: { ...user.user, userStatus: String(newStatus.value) ?? 'ACTIVE' },
      });
    } else toast.error(response.responseMessage);
    setLoading(false);
    setOpen(false);
  };

  return (
    <>
      <tr key={userData.userId}>
        <td>
          <div className="jampack-media jampack-align-items-center pointer">
            <div className="jampack-media-head jampack-me-2">
              <div className="jampack-avatar jampack-avatar-xs jampack-avatar-rounded">
                <img
                  alt="user"
                  loading="lazy"
                  width="180"
                  height="180"
                  decoding="async"
                  data-nimg="1"
                  className="jampack-avatar-img"
                  src={userData.headshot?.url ? TextHelper.setUrl(userData.headshot?.url) : '/assets/images/logo.png'}
                  style={{ color: 'transparent' }}
                  onClick={() => {
                    setOpen(true);
                    setAction('view-user');
                  }}
                />
              </div>
            </div>
          </div>
        </td>
        <td>
          <div className="attendant__seminer">
            <span className="nowrap">
              {userData.user?.firstName ?? 'N/A'} {userData.user?.lastName ?? ''}
            </span>
          </div>
        </td>
        <td>
          <div className="attendant__date">
            <span className="nowrap">{userData.user?.email ?? 'N/A'}</span>
          </div>
        </td>
        <td>
          <div className="attendant__time">
            {userData.creativeCategories && userData.creativeCategories.length > 0 ? (
              <span className="jampack-my-1 jampack-me-2 jampack-badge jampack-badge-soft-dark jampack-bg-bg-grey-light-5">{userData.creativeCategories[0].replace('_', ' ')}</span>
            ) : (
              'N/A'
            )}
            {userData.creativeCategories && userData.creativeCategories.length > 1 ? (
              <span className="jampack-my-1 jampack-me-2 jampack-badge jampack-badge-soft-dark jampack-bg-bg-grey-light-5">+{userData.creativeCategories.length - 1}</span>
            ) : null}
          </div>
        </td>
        <td>
          <div className="attendant__date">
            <span className="nowrap">{userData.location?.state ? userData.location?.state : 'N/A'}</span>
          </div>
        </td>
        <td>
          <div className="attendant__time">
            <span className="nowrap">{userData.user?.dateCreated ? TextHelper.getFormattedDate(userData.user?.dateCreated!) : 'N/A'}</span>
          </div>
        </td>
        <td>
          <span className="nowrap">{user.user?.userStatus}</span>
        </td>
        <td>
          <Box className="attendant__action">
            <CardHeaderDropdown
              options={[
                {
                  label: 'Update Status',
                  onClick: () => {
                    setOpen(true);
                    setAction('update-status');
                  },
                },
              ]}
            />
          </Box>
        </td>
      </tr>

      <CustomModal open={open} closeOnOverlayClick closeModal={() => setOpen(false)} maxWidth="90%" width="533px" showCloseIcon>
        {action === 'update-status' && (
          <Box sx={{ padding: '20px 40px' }}>
            <Text size={24} weight={700} center color="#141416" sx={{ mb: 2 }}>
              Update User Status
            </Text>
            <Text size={15} weight={500} center color="#141416">
              Select a status below.
            </Text>

            <SelectField
              label="User Status"
              options={userStatuses}
              value={newStatus}
              onChange={(e) => {
                setNewStatus(e ? e : { label: '', value: '' });
              }}
              placeholder="Select a status."
              mt={3}
            />

            <CustomButton mode="primary" style={{ marginTop: '20px' }} onClick={() => updateUserStatus()} disabled={loading} loading={loading}>
              Save
            </CustomButton>
          </Box>
        )}

        {action === 'edit-user' && <Box sx={{ padding: '20px 40px' }}></Box>}

        {action === 'view-user' && (
          <Box sx={{ padding: '10px 20px' }}>
            <Box
              sx={{
                width: '100px',
                height: '100px',
                borderRadius: '100px',
                backgroundImage: `url(${userData.headshot?.url ? TextHelper.setUrl(userData.headshot?.url) : '/assets/images/logo.png'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            ></Box>
            <Text size={17} weight={600} color="#141416" sx={{ mt: 1, mb: '15px' }}>
              {user.user?.firstName ?? 'N/A'} {user.user?.lastName ?? ''}
            </Text>
            <Box className="d-flex">
              <Text
                size={11}
                weight={500}
                color="#141416"
                sx={{
                  backgroundColor: 'lightgray',
                  borderRadius: '8px',
                  padding: '3px 9px',
                  mr: '5px',
                }}
              >
                {userData.creativeCategories && userData.creativeCategories.length > 0 ? userData.creativeCategories[0].replace('_', ' ') : 'N/A'}
              </Text>
              {userData.creativeCategories && userData.creativeCategories.length > 1 ? (
                <Text
                  size={11}
                  weight={500}
                  color="#141416"
                  sx={{
                    backgroundColor: 'lightgray',
                    borderRadius: '8px',
                    padding: '3px 9px',
                  }}
                >
                  +{userData.creativeCategories.length - 1}
                </Text>
              ) : null}
            </Box>

            <Grid container spacing={1} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <Text size={15} weight={400} color="#141416" sx={{ mt: 1, mb: '5px' }}>
                  Phone Number
                </Text>
                <Text size={15} weight={700} color={themeColors.primary} sx={{ mt: '5px' }}>
                  {user.user?.phoneNumber ?? 'N/A'}
                </Text>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Text size={15} weight={400} color="#141416" sx={{ mt: 1, mb: '5px' }}>
                  Country
                </Text>
                <Text size={15} weight={700} color={themeColors.primary} sx={{ mt: '5px' }}>
                  {user.location?.country ?? 'N/A'}
                </Text>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Text size={15} weight={400} color="#141416" sx={{ mt: 1, mb: '5px' }}>
                  Email Confirmed
                </Text>
                <Text size={15} weight={700} color={themeColors.primary} sx={{ mt: '5px' }}>
                  {user.user?.emailConfirmed ? 'TRUE' : 'FALSE'}
                </Text>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Text size={15} weight={400} color="#141416" sx={{ mt: 1, mb: '5px' }}>
                  Phone Number Confirmed
                </Text>
                <Text size={15} weight={700} color={themeColors.primary} sx={{ mt: '5px' }}>
                  {user.user?.phoneNumberConfirmed ? 'TRUE' : 'FALSE'}
                </Text>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Text size={15} weight={400} color="#141416" sx={{ mt: 1, mb: '5px' }}>
                  Date Created
                </Text>
                <Text size={15} weight={700} color={themeColors.primary} sx={{ mt: '5px' }}>
                  {TextHelper.getFormattedDate(user.user?.dateCreated!)}
                </Text>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Text size={15} weight={400} color="#141416" sx={{ mt: 1, mb: '5px' }}>
                  Status
                </Text>
                <Text size={15} weight={700} color={themeColors.primary} sx={{ mt: '5px' }}>
                  {user.user?.userStatus}
                </Text>
              </Grid>
            </Grid>

            <CustomButton mode="primary" style={{ marginTop: '20px' }} onClick={() => router.push(`/admin/creatives/${user.userId}`)}>
              View Profile
            </CustomButton>
          </Box>
        )}
      </CustomModal>
    </>
  );
};

const ClientUserTableRow: React.FC<IClientRowProps> = ({ userData, key }) => {
  const router = useRouter();
  const [user, setUser] = useState(userData);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState('delete');
  const { open, setOpen } = useModal();
  const { themeColors } = useCustomTheme();
  const [newStatus, setNewStatus] = useState<ISelectData>({} as ISelectData);

  const updateUserStatus = async () => {
    setLoading(true);
    const response = await UserService.updateUserApi({
      userId: user.userId,
      userStatus: String(newStatus.value) ?? 'ACTIVE',
    });
    if (response.status) {
      setUser({
        ...user,
        user: { ...user.user, userStatus: String(newStatus.value) ?? 'ACTIVE' },
      });
    } else toast.error(response.responseMessage);
    setLoading(false);
    setOpen(false);
  };

  return (
    <>
      <tr key={userData.userId}>
        <td>
          <div className="jampack-media jampack-align-items-center pointer">
            <div className="jampack-media-head jampack-me-2">
              <div className="jampack-avatar jampack-avatar-xs jampack-avatar-rounded">
                <img
                  alt="user"
                  loading="lazy"
                  width="180"
                  height="180"
                  decoding="async"
                  data-nimg="1"
                  className="jampack-avatar-img"
                  src={userData.logo?.url ? TextHelper.setUrl(userData.logo?.url) : '/assets/images/logo.png'}
                  style={{ color: 'transparent' }}
                  onClick={() => {
                    setOpen(true);
                    setAction('view-user');
                  }}
                />
              </div>
            </div>
          </div>
        </td>
        <td>
          <div className="attendant__seminer">
            <span className="nowrap">
              {userData.user?.firstName ?? 'N/A'} {userData.user?.lastName ?? ''}
            </span>
          </div>
        </td>
        <td>
          <div className="attendant__date">
            <span className="nowrap">{userData.user?.email ?? 'N/A'}</span>
          </div>
        </td>
        <td>
          <div className="attendant__time">
            {userData.businessDetail ? (
              <span className="jampack-my-1 jampack-me-2 jampack-badge jampack-badge-soft-dark jampack-bg-bg-pink-light-5">
                {userData.businessDetail.type ? userData.businessDetail.type?.replace('_', ' ') : 'N/A'}
              </span>
            ) : (
              'N/A'
            )}
          </div>
        </td>
        <td>
          <div className="attendant__date">
            <span className="nowrap">{userData.businessLocation?.state ? userData.businessLocation?.state : 'N/A'}</span>
          </div>
        </td>
        <td>
          <div className="attendant__time">
            <span className="nowrap">{userData.user?.dateCreated ? TextHelper.getFormattedDate(userData.user?.dateCreated!) : 'N/A'}</span>
          </div>
        </td>
        <td>
          <span className="nowrap">{user.user?.userStatus}</span>
        </td>
        <td>
          <Box className="attendant__action">
            <CardHeaderDropdown
              options={[
                {
                  label: 'Update Status',
                  onClick: () => {
                    setOpen(true);
                    setAction('update-status');
                  },
                },
              ]}
            />
          </Box>
        </td>
      </tr>

      <CustomModal open={open} closeOnOverlayClick closeModal={() => setOpen(false)} maxWidth="90%" width="533px" showCloseIcon>
        {action === 'update-status' && (
          <Box sx={{ padding: '20px 40px' }}>
            <Text size={24} weight={700} center color="#141416" sx={{ mb: 2 }}>
              Update User Status
            </Text>
            <Text size={15} weight={500} center color="#141416">
              Select a status below.
            </Text>

            <SelectField
              label="User Status"
              options={userStatuses}
              value={newStatus}
              onChange={(e) => {
                setNewStatus(e ? e : { label: '', value: '' });
              }}
              placeholder="Select a status."
              mt={3}
            />

            <CustomButton mode="primary" style={{ marginTop: '20px' }} onClick={() => updateUserStatus()} disabled={loading} loading={loading}>
              Save
            </CustomButton>
          </Box>
        )}

        {action === 'edit-user' && <Box sx={{ padding: '20px 40px' }}></Box>}

        {action === 'view-user' && (
          <Box sx={{ padding: '10px 20px' }}>
            <Box
              sx={{
                width: '100px',
                height: '100px',
                borderRadius: '100px',
                backgroundImage: `url(${userData.logo?.url ? TextHelper.setUrl(userData.logo?.url) : '/assets/images/logo.png'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            ></Box>
            <Text size={17} weight={600} color="#141416" sx={{ mt: 1, mb: '15px' }}>
              {user.user?.firstName ?? 'N/A'} {user.user?.lastName ?? ''}
            </Text>
            <Text size={17} weight={600} color={themeColors.primary} sx={{ mt: 1, mb: '15px' }}>
              {user.businessDetail?.name ?? 'N/A'}
            </Text>
            <Box className="d-flex">
              <Text
                size={11}
                weight={500}
                color="#141416"
                sx={{
                  backgroundColor: 'lightgray',
                  borderRadius: '8px',
                  padding: '3px 9px',
                  mr: '5px',
                }}
              >
                {userData.businessDetail ? (userData.businessDetail.type ? userData.businessDetail.type?.replace('_', ' ') : 'N/A') : 'N/A'}
              </Text>
            </Box>

            <Grid container spacing={1} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <Text size={15} weight={400} color="#141416" sx={{ mt: 1, mb: '5px' }}>
                  Phone Number
                </Text>
                <Text size={15} weight={700} color={themeColors.primary} sx={{ mt: '5px' }}>
                  {user.user?.phoneNumber ?? 'N/A'}
                </Text>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Text size={15} weight={400} color="#141416" sx={{ mt: 1, mb: '5px' }}>
                  Country
                </Text>
                <Text size={15} weight={700} color={themeColors.primary} sx={{ mt: '5px' }}>
                  {user.businessLocation?.country ?? 'N/A'}
                </Text>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Text size={15} weight={400} color="#141416" sx={{ mt: 1, mb: '5px' }}>
                  Email Confirmed
                </Text>
                <Text size={15} weight={700} color={themeColors.primary} sx={{ mt: '5px' }}>
                  {user.user?.emailConfirmed ? 'TRUE' : 'FALSE'}
                </Text>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Text size={15} weight={400} color="#141416" sx={{ mt: 1, mb: '5px' }}>
                  Phone Number Confirmed
                </Text>
                <Text size={15} weight={700} color={themeColors.primary} sx={{ mt: '5px' }}>
                  {user.user?.phoneNumberConfirmed ? 'TRUE' : 'FALSE'}
                </Text>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Text size={15} weight={400} color="#141416" sx={{ mt: 1, mb: '5px' }}>
                  Date Created
                </Text>
                <Text size={15} weight={700} color={themeColors.primary} sx={{ mt: '5px' }}>
                  {TextHelper.getFormattedDate(user.user?.dateCreated!)}
                </Text>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Text size={15} weight={400} color="#141416" sx={{ mt: 1, mb: '5px' }}>
                  Status
                </Text>
                <Text size={15} weight={700} color={themeColors.primary} sx={{ mt: '5px' }}>
                  {user.user?.userStatus}
                </Text>
              </Grid>
            </Grid>

            <CustomButton mode="primary" style={{ marginTop: '20px' }} onClick={() => router.push(`/admin/clients/${user.userId}`)}>
              View Profile
            </CustomButton>
          </Box>
        )}
      </CustomModal>
    </>
  );
};

export default UserTable;
