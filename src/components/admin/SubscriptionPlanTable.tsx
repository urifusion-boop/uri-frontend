import { Box, Skeleton, Typography } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { IoMdPricetags } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import { SubscriptionPlanService } from '../../api/SubscriptionPlanService';
import { AdminFeatureService } from '../../api/admin/AdminFeatureService';
import { AdminSubscriptionPlanService } from '../../api/admin/AdminSubscriptionPlanService';
import { userTypes } from '../../data/profileSetup';
import { subscriptionDurations } from '../../data/subscription';
import { TextHelper } from '../../helpers/TextHelper';
import useCustomTheme from '../../hooks/theme.hook';
import { useModal } from '../../hooks/utils.hook';
import { CreateSubscriptionPlanDto } from '../../models/dtos/CreateSubscriptionPlanDto';
import { SubscriptionPlanDto } from '../../models/dtos/SubscriptionPlanDto';
import { useAuth } from '../../providers/AuthProvider';
import { ISelectData } from '../../types';
import CardHeaderDropdown from '../atoms/CardHeaderDropdown';
import CustomButton from '../atoms/CustomButton';
import Text from '../atoms/CustomText';
import InputField from '../atoms/Input';
import SelectField from '../atoms/SelectField';
import CustomModal from '../modals/CustomModal';

interface IRowProps {
  subscriptionPlanData: SubscriptionPlanDto;
  key: number;
  refetch: () => void;
}

const SubscriptionPlanTable = () => {
  const { themeColors } = useCustomTheme();
  const { userDetails } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [newPlan, setNewPlan] = useState({} as CreateSubscriptionPlanDto);
  const [open, setOpen] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<ISelectData[]>([]);
  const [featureSearchTerm] = useState('');

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  const {
    data: subscriptionPlans,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['subscription-plans', userDetails?.userId, currentPage],
    queryFn: async () =>
      await SubscriptionPlanService.getSubscriptionPlans({
        pageNumber: currentPage,
        pageSize: 10,
      }),
    enabled: typeof userDetails?.userId !== undefined,
  });

  const { data: features } = useQuery({
    queryKey: ['features', userDetails?.userId, featureSearchTerm],
    queryFn: async () => {
      const result = await AdminFeatureService.getFeaturesByFilterApi({
        pageNumber: 1,
        pageSize: 10,
        featureName: featureSearchTerm,
      });
      if (result.status) return result.responseData?.data;
      else return [];
    },
    enabled: typeof userDetails?.userId !== undefined,
  });

  const createSubscriptionPlan = async () => {
    setLoading(true);
    const response = await AdminSubscriptionPlanService.createSubscriptionPlanApi(newPlan);
    if (response.status) {
      await refetch();
    } else toast.error(response.responseMessage);
    setLoading(false);
    setOpen(false);
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
                    <IoMdPricetags
                      style={{
                        width: '26px',
                        height: '26px',
                        color: themeColors.primary,
                      }}
                    />
                  </div>
                  <div className="card__header-title">
                    <h4>Subscription Plans</h4>
                  </div>
                </div>
                <div className="breadcrumb__tab">
                  <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link`}
                        id="day-tab-1"
                        data-bs-toggle="tab"
                        data-bs-target="#day-tab-1-pane"
                        type="button"
                        role="tab"
                        aria-controls="day-tab-1-pane"
                        aria-selected={'false'}
                        onClick={() => setOpen(true)}
                      >
                        Create Plan
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div
              className="attendant__wrapper mb-60"
              style={{
                overflowX: subscriptionPlans && subscriptionPlans?.responseData && subscriptionPlans?.responseData?.data && subscriptionPlans?.responseData?.data?.length > 0 ? 'auto' : 'hidden',
              }}
            >
              {isLoading ? (
                <table id="applications-table">
                  <thead>
                    <tr>
                      <th>Plan Name</th>
                      <th>Features</th>
                      <th>UserType</th>
                      <th>Price</th>
                      <th>Duration</th>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <>
                  {subscriptionPlans && subscriptionPlans?.responseData && subscriptionPlans?.responseData?.data && subscriptionPlans?.responseData?.data?.length > 0 ? (
                    <table id="applications-table">
                      <thead>
                        <tr>
                          <th>Plan Name</th>
                          <th>Features</th>
                          <th>UserType</th>
                          <th>Price</th>
                          <th>Duration</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscriptionPlans &&
                          subscriptionPlans?.responseData &&
                          subscriptionPlans?.responseData?.data &&
                          subscriptionPlans?.responseData?.data?.length > 0 &&
                          subscriptionPlans.responseData?.data?.map((plan: any, index: number) => (
                            <SubscriptionPlanTableRow subscriptionPlanData={plan as any} key={index} refetch={() => refetch()} />
                          ))}
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
                        There are no subscription plans available.
                      </Text>
                      <CustomButton
                        mode="primary"
                        style={{
                          margin: '16px calc(50% - 100px) 0px calc(50% - 100px)',
                          width: '200px',
                        }}
                        type="submit"
                        data-testid="apply-filter-button"
                        onClick={() => setOpen(true)}
                      >
                        Create Plan
                      </CustomButton>
                    </Box>
                  )}
                </>
              )}
            </div>
            {subscriptionPlans && subscriptionPlans?.responseData && subscriptionPlans?.responseData?.data && subscriptionPlans?.responseData?.data?.length > 0 && (
              <Box sx={{ translate: '0px -40px', float: 'right', mt: '28px' }}>
                <Pagination
                  count={Math.ceil(Number(subscriptionPlans.responseData?.pageSize! || 1) / 4)}
                  defaultPage={1}
                  siblingCount={0}
                  boundaryCount={0}
                  page={Number(subscriptionPlans.responseData?.page || 1)}
                  onChange={(event, pageNumber) => setCurrentPage(pageNumber)}
                />
              </Box>
            )}
          </div>
        </div>
      </div>

      <CustomModal open={open} closeOnOverlayClick closeModal={() => setOpen(false)} maxWidth="90%" width="533px" showCloseIcon>
        <Box sx={{ padding: '20px 40px' }}>
          <Text size={24} weight={700} center color="#141416" sx={{ mb: 2 }}>
            Create Subscription Plan
          </Text>

          <InputField
            label="Plan Name"
            placeholder="Plan Name"
            type="text"
            value={newPlan.planName}
            onChange={(e) => {
              setNewPlan({ ...newPlan, planName: e?.target.value });
            }}
            mt={3}
          />

          <Typography fontSize={14} fontWeight={500} color={'#141416'} style={{ marginTop: '20px', marginBottom: '10px' }}>
            Features
          </Typography>

          {selectedFeatures && selectedFeatures.length > 0 ? (
            selectedFeatures.map((feature, index) => (
              <Box
                className="d-flex"
                sx={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  marginBottom: '7px',
                  padding: '15px 20px',
                  alignItems: 'center',
                }}
                key={index}
              >
                <Text size={15} weight={500} style={{ display: 'flex', width: '50px' }}>
                  {index + 1}
                </Text>
                <Text size={15} weight={500} style={{ display: 'flex', flex: '1' }}>
                  {feature.label}
                </Text>
                <IoClose
                  style={{
                    display: 'flex',
                    width: '25px',
                    height: '25px',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setSelectedFeatures(selectedFeatures.filter((feat) => feature.label !== feat.label));
                    setNewPlan({
                      ...newPlan,
                      features: newPlan.features?.filter((feat) => feature.value !== feat),
                    });
                  }}
                />
              </Box>
            ))
          ) : (
            <Text size={20} weight={500} center>
              Add a feature.
            </Text>
          )}

          <SelectField
            options={
              features?.map((feature: any) => {
                return {
                  label: feature.featureName,
                  value: feature.featureId,
                } as ISelectData;
              }) ?? []
            }
            value={null}
            onChange={(e) => {
              if (!e || Array.isArray(e)) return;
              if (!e.value) return;
              setSelectedFeatures(selectedFeatures.concat(e));
              setNewPlan({
                ...newPlan,
                features: newPlan.features?.concat(String(e?.value)),
              });
            }}
            placeholder="Add features."
            mt={3}
          />

          <SelectField
            label="UserType"
            options={userTypes}
            value={{
              label: newPlan.userType ?? '',
              value: newPlan.userType?.toUpperCase() ?? '',
            }}
            onChange={(e) => {
              if (!e || Array.isArray(e)) return;
              if (!e.value) return;
              setNewPlan({ ...newPlan, userType: String(e?.value) });
            }}
            placeholder="Select a usertype."
            mt={3}
          />

          <InputField
            label="Price"
            placeholder="Price"
            type="text"
            value={newPlan.price ?? 0}
            onChange={(e) => {
              let isNum = TextHelper.isNumber(e.target.value);
              if (!isNum) return;
              setNewPlan({ ...newPlan, price: Number(e?.target.value) });
            }}
            mt={3}
            formatNumber
          />

          <SelectField
            label="Duration"
            options={subscriptionDurations}
            value={{
              label: newPlan.duration ?? '',
              value: newPlan.duration?.toUpperCase() ?? '',
            }}
            onChange={(e) => {
              if (!e || Array.isArray(e)) return;
              if (!e.value) return;
              setNewPlan({ ...newPlan, duration: String(e?.value) });
            }}
            placeholder="Select a duration."
            mt={3}
          />

          <Typography fontSize={14} fontWeight={500} color={'#141416'} style={{ marginTop: '20px' }}>
            Description
          </Typography>
          <textarea
            maxLength={200}
            required
            value={newPlan.description}
            style={{
              width: '100%',
              minHeight: '103px',
              maxHeight: '103px',
              margin: '10px 0 0px',
              border: '1px solid #E0DEF7',
              borderRadius: '5px',
              outline: '1px solid #E0DEF7',
              padding: '18px',
              background: themeColors.background,
            }}
            placeholder="Not more than 500 characters."
            onChange={(e) => {
              setNewPlan({ ...newPlan, description: e.target.value });
            }}
          ></textarea>

          <CustomButton mode="primary" style={{ marginTop: '20px' }} onClick={() => createSubscriptionPlan()} disabled={loading} loading={loading}>
            Create Plan
          </CustomButton>
        </Box>
      </CustomModal>
    </>
  );
};

const SubscriptionPlanTableRow: React.FC<IRowProps> = ({ subscriptionPlanData, refetch }) => {
  const [subscriptionPlan, setSubscriptionPlan] = useState(subscriptionPlanData);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState('delete-plan');
  const { open, setOpen } = useModal();
  const { themeColors } = useCustomTheme();
  const [updatedPlan, setUpdatedPlan] = useState(subscriptionPlan);
  const [selectedFeatures, setSelectedFeatures] = useState<ISelectData[]>([]);
  const [featureSearchTerm] = useState('');

  useEffect(() => {
    setSelectedFeatures(
      subscriptionPlanData.featuresData?.map((feature) => {
        return {
          label: feature.featureName ?? '',
          value: feature.featureId ?? '',
        };
      }) ?? []
    );
  }, [subscriptionPlanData]);

  const updateSubscriptionPlan = async () => {
    setLoading(true);
    const response = await AdminSubscriptionPlanService.updateSubscriptionPlanApi(updatedPlan);
    if (response.status) {
      setSubscriptionPlan(response.responseData as SubscriptionPlanDto);
    } else toast.error(response.responseMessage);
    setLoading(false);
    setOpen(false);
  };

  const deleteSubscriptionPlan = async () => {
    setLoading(true);
    const response = await AdminSubscriptionPlanService.deleteSubscriptionPlanApi(subscriptionPlanData.planId!);
    if (response.status) {
      await refetch();
    } else toast.error(response.responseMessage);
    setLoading(false);
    setOpen(false);
  };

  const { data: features } = useQuery({
    queryKey: ['features', featureSearchTerm],
    queryFn: async () => {
      const result = await AdminFeatureService.getFeaturesByFilterApi({
        pageNumber: 1,
        pageSize: 10,
        featureName: featureSearchTerm,
      });
      if (result.status) return result.responseData?.data;
      else return [];
    },
    enabled: true,
  });

  return (
    <>
      <tr key={subscriptionPlanData.planId}>
        <td>
          <div className="attendant__date">
            <span className="nowrap">{subscriptionPlanData.planName}</span>
          </div>
        </td>
        <td>
          <div className="attendant__time">
            <span className="nowrap">
              {subscriptionPlan.features && subscriptionPlan.features.length > 0 ? (
                <span className="jampack-my-1 jampack-me-2 jampack-badge jampack-badge-soft-dark jampack-bg-bg-grey-light-5">{subscriptionPlan.features[0].replace('_', ' ')}</span>
              ) : (
                'N/A'
              )}
              {subscriptionPlan.features && subscriptionPlan.features.length > 1 ? (
                <span className="jampack-my-1 jampack-me-2 jampack-badge jampack-badge-soft-dark jampack-bg-bg-grey-light-5">+{subscriptionPlan.features.length - 1}</span>
              ) : null}
            </span>
          </div>
        </td>
        <td>
          <div className="attendant__date">
            <span className="nowrap">
              {subscriptionPlan.userType ? <span className="jampack-my-1 jampack-me-2 jampack-badge jampack-badge-soft-dark jampack-bg-bg-grey-light-5">{subscriptionPlan.userType}</span> : 'N/A'}
            </span>
          </div>
        </td>
        <td>
          <div className="attendant__seminer">
            <span className="nowrap">{subscriptionPlanData.price}</span>
          </div>
        </td>
        <td>
          <div className="attendant__seminer">
            <span className="nowrap">{subscriptionPlanData.duration}</span>
          </div>
        </td>
        <td>
          <Box className="attendant__action">
            <CardHeaderDropdown
              options={[
                {
                  label: 'Edit',
                  onClick: () => {
                    setAction('update-plan');
                    setOpen(true);
                  },
                },
                {
                  label: 'Delete',
                  onClick: () => {
                    setAction('delete-plan');
                    setOpen(true);
                  },
                },
              ]}
            />
          </Box>
        </td>
      </tr>

      <CustomModal open={open} closeOnOverlayClick closeModal={() => setOpen(false)} maxWidth="90%" width="533px" showCloseIcon>
        {action === 'update-plan' && (
          <Box sx={{ padding: '20px 40px' }}>
            <Text size={24} weight={700} center color="#141416" sx={{ mb: 2 }}>
              Update Subscription Plan
            </Text>

            <InputField
              label="Plan Name"
              placeholder="Plan Name"
              type="text"
              value={updatedPlan.planName}
              onChange={(e) => {
                setUpdatedPlan({ ...updatedPlan, planName: e?.target.value });
              }}
              mt={3}
            />

            <Typography fontSize={14} fontWeight={500} color={'#141416'} style={{ marginTop: '20px', marginBottom: '10px' }}>
              Features
            </Typography>

            {selectedFeatures && selectedFeatures.length > 0 ? (
              selectedFeatures.map((feature, index) => (
                <Box
                  className="d-flex"
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    marginBottom: '7px',
                    padding: '15px 20px',
                    alignItems: 'center',
                  }}
                  key={index}
                >
                  <Text size={15} weight={500} style={{ display: 'flex', width: '50px' }}>
                    {index + 1}
                  </Text>
                  <Text size={15} weight={500} style={{ display: 'flex', flex: '1' }}>
                    {feature.label}
                  </Text>
                  <IoClose
                    style={{
                      display: 'flex',
                      width: '25px',
                      height: '25px',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setSelectedFeatures(selectedFeatures.filter((feat) => feature.label !== feat.label));
                      setUpdatedPlan({
                        ...updatedPlan,
                        features: updatedPlan.features?.filter((feat) => feature.value !== feat),
                      });
                    }}
                  />
                </Box>
              ))
            ) : (
              <Text size={20} weight={500} center>
                Add a feature.
              </Text>
            )}

            <SelectField
              options={
                features?.map((feature: any) => {
                  return {
                    label: feature.featureName,
                    value: feature.featureId,
                  } as ISelectData;
                }) ?? []
              }
              value={null}
              onChange={(e) => {
                if (!e || Array.isArray(e)) return;
              if (!e.value) return;
                setSelectedFeatures(selectedFeatures.concat(e));
                setUpdatedPlan({
                  ...updatedPlan,
                  features: updatedPlan.features?.concat(String(e?.value)),
                });
              }}
              placeholder="Add features."
              mt={3}
            />

            <SelectField
              label="UserType"
              options={userTypes}
              value={{
                label: updatedPlan.userType ?? '',
                value: updatedPlan.userType?.toUpperCase() ?? '',
              }}
              onChange={(e) => {
                if (!e || Array.isArray(e)) return;
              if (!e.value) return;
                setUpdatedPlan({ ...updatedPlan, userType: String(e?.value) });
              }}
              placeholder="Select a usertype."
              mt={3}
            />

            <InputField
              label="Price"
              placeholder="Price"
              type="text"
              value={updatedPlan.price ?? 0}
              onChange={(e) => {
                let isNum = TextHelper.isNumber(e.target.value);
                if (!isNum) return;
                setUpdatedPlan({
                  ...updatedPlan,
                  price: Number(e?.target.value),
                });
              }}
              mt={3}
              formatNumber
            />

            <SelectField
              label="Duration"
              options={subscriptionDurations}
              value={{
                label: updatedPlan.duration ?? '',
                value: updatedPlan.duration?.toUpperCase() ?? '',
              }}
              onChange={(e) => {
                if (!e || Array.isArray(e)) return;
              if (!e.value) return;
                setUpdatedPlan({ ...updatedPlan, duration: String(e?.value) });
              }}
              placeholder="Select a duration."
              mt={3}
            />

            <Typography fontSize={14} fontWeight={500} color={'#141416'} style={{ marginTop: '20px' }}>
              Description
            </Typography>
            <textarea
              maxLength={200}
              required
              value={updatedPlan.description}
              style={{
                width: '100%',
                minHeight: '103px',
                maxHeight: '103px',
                margin: '10px 0 0px',
                border: '1px solid #E0DEF7',
                borderRadius: '5px',
                outline: '1px solid #E0DEF7',
                padding: '18px',
                background: themeColors.background,
              }}
              placeholder="Not more than 500 characters."
              onChange={(e) => {
                setUpdatedPlan({ ...updatedPlan, description: e.target.value });
              }}
            ></textarea>

            <CustomButton mode="primary" style={{ marginTop: '20px' }} onClick={() => updateSubscriptionPlan()} disabled={loading} loading={loading}>
              Update Plan
            </CustomButton>
          </Box>
        )}

        {action === 'delete-plan' && (
          <Box sx={{ padding: '20px 40px' }}>
            <Text size={24} weight={700} center color="#141416" sx={{ mb: 2 }}>
              Delete Subscription Plan
            </Text>

            <Text size={17} weight={500} center color="#141416" sx={{ mb: 2 }}>
              Are you sure you want to delete this subscription plan?
            </Text>

            <CustomButton mode="primary" style={{ marginTop: '20px' }} onClick={() => deleteSubscriptionPlan()} disabled={loading} loading={loading}>
              Delete Plan
            </CustomButton>
          </Box>
        )}
      </CustomModal>
    </>
  );
};

export default SubscriptionPlanTable;
