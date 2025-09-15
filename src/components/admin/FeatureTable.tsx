import { Box, Skeleton, Typography } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { GrAction } from 'react-icons/gr';
import { IoClose } from 'react-icons/io5';
import { AdminFeatureService } from '../../api/admin/AdminFeatureService';
import { userTypes } from '../../data/profileSetup';
import useCustomTheme from '../../hooks/theme.hook';
import { useModal } from '../../hooks/utils.hook';
import { CreateFeatureDto } from '../../models/dtos/CreateFeatureDto';
import { FeatureDto } from '../../models/dtos/FeatureDto';
import { useAuth } from '../../providers/AuthProvider';
import { ISelectData } from '../../types';
import CardHeaderDropdown from '../atoms/CardHeaderDropdown';
import CustomButton from '../atoms/CustomButton';
import Text from '../atoms/CustomText';
import InputField from '../atoms/Input';
import SelectField from '../atoms/SelectField';
import CustomModal from '../modals/CustomModal';

interface IRowProps {
  featureData: FeatureDto;
  key: number;
  refetch: () => void;
}

const FeatureTable = () => {
  const { themeColors } = useCustomTheme();
  const { userDetails } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [newFeature, setNewFeature] = useState({} as CreateFeatureDto);
  const [open, setOpen] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<ISelectData[]>([]);
  const [selectedUserTypes, setSelectedUserTypes] = useState<ISelectData[]>([]);
  const [featureSearchTerm] = useState('');

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  const {
    data: features,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['features', userDetails?.userId, currentPage],
    queryFn: async () =>
      await AdminFeatureService.getFeaturesByFilterApi({
        pageNumber: currentPage,
        pageSize: 10,
      }),
    enabled: !!userDetails?.userId,
  });

  const { data: subFeatures } = useQuery({
    queryKey: ['sub-features', featureSearchTerm],
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

  const createFeature = async () => {
    setLoading(true);
    const response = await AdminFeatureService.createFeatureApi(newFeature);
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
                    <GrAction
                      style={{
                        width: '26px',
                        height: '26px',
                        color: themeColors.primary,
                      }}
                    />
                  </div>
                  <div className="card__header-title">
                    <h4>Features</h4>
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
                        Create Feature
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div
              className="attendant__wrapper mb-60"
              style={{
                overflowX: features && features?.responseData && features?.responseData?.data && features?.responseData?.data?.length > 0 ? 'auto' : 'hidden',
              }}
            >
              {isLoading ? (
                <table id="applications-table">
                  <thead>
                    <tr>
                      <th>Feature Name</th>
                      <th>Sub Features</th>
                      <th>UserTypes</th>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <>
                  {features && features?.responseData && features?.responseData?.data && features?.responseData?.data?.length > 0 ? (
                    <table id="applications-table">
                      <thead>
                        <tr>
                          <th>Feature Name</th>
                          <th>Sub Features</th>
                          <th>UserTypes</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {features &&
                          features?.responseData &&
                          features?.responseData?.data &&
                          features?.responseData?.data?.length > 0 &&
                          features.responseData?.data?.map((feature: any, index: number) => <FeatureTableRow featureData={feature as any} key={index} refetch={() => refetch()} />)}
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
                        There are no features available.
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
                        Create Feature
                      </CustomButton>
                    </Box>
                  )}
                </>
              )}
            </div>
            {features && features?.responseData && features?.responseData?.data && features?.responseData?.data?.length > 0 && (
              <Box sx={{ translate: '0px -40px', float: 'right', mt: '28px' }}>
                <Pagination
                  count={Math.ceil(Number(features.responseData?.pageSize! || 1) / 4)}
                  defaultPage={1}
                  siblingCount={0}
                  boundaryCount={0}
                  page={Number(features.responseData?.page || 1)}
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
            Create Feature
          </Text>

          <InputField
            label="Feature Name"
            placeholder="Feature Name"
            type="text"
            value={newFeature.featureName}
            onChange={(e) => {
              setNewFeature({ ...newFeature, featureName: e?.target.value });
            }}
            mt={3}
          />

          <Typography fontSize={14} fontWeight={500} color={'#141416'} style={{ marginTop: '20px', marginBottom: '10px' }}>
            Sub Features
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
                    setNewFeature({
                      ...newFeature,
                      subFeatures: newFeature.subFeatures?.filter((feat) => feature.value !== feat),
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
              subFeatures?.map((feature: any) => {
                return {
                  label: feature.featureName,
                  value: feature.featureId,
                } as ISelectData;
              }) ?? []
            }
            value={null}
            onChange={(e) => {
              if (!e || !e.value) return;
              setSelectedFeatures(selectedFeatures.concat(e));
              setNewFeature({
                ...newFeature,
                subFeatures: newFeature.subFeatures?.concat(String(e?.value)),
              });
            }}
            placeholder="Add features."
            mt={3}
          />

          <Typography fontSize={14} fontWeight={500} color={'#141416'} style={{ marginTop: '20px', marginBottom: '10px' }}>
            Access User Types
          </Typography>

          {selectedUserTypes && selectedUserTypes.length > 0 ? (
            selectedUserTypes.map((type, index) => (
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
                  {type.label}
                </Text>
                <IoClose
                  style={{
                    display: 'flex',
                    width: '25px',
                    height: '25px',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setSelectedUserTypes(selectedUserTypes.filter((userType) => type.label !== userType.label));
                    setNewFeature({
                      ...newFeature,
                      accessUserTypes: newFeature.accessUserTypes?.filter((userType) => type.value !== userType),
                    });
                  }}
                />
              </Box>
            ))
          ) : (
            <Text size={20} weight={500} center>
              Add an access user type.
            </Text>
          )}

          <SelectField
            options={userTypes}
            value={null}
            onChange={(e) => {
              if (!e || !e.value) return;
              setSelectedUserTypes(selectedUserTypes.concat(e));
              setNewFeature({
                ...newFeature,
                accessUserTypes: newFeature.accessUserTypes?.concat(String(e?.value)),
              });
            }}
            placeholder="Add user type."
            mt={3}
          />

          <InputField
            label="Access Route"
            placeholder="Access Route"
            type="text"
            value={newFeature.accessRoute ?? ''}
            onChange={(e) => {
              setNewFeature({
                ...newFeature,
                accessRoute: String(e?.target.value),
              });
            }}
            mt={3}
          />

          <Typography fontSize={14} fontWeight={500} color={'#141416'} style={{ marginTop: '20px' }}>
            Description
          </Typography>
          <textarea
            maxLength={200}
            required
            value={newFeature.description}
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
              setNewFeature({ ...newFeature, description: e.target.value });
            }}
          ></textarea>

          <CustomButton mode="primary" style={{ marginTop: '20px' }} onClick={() => createFeature()} disabled={loading} loading={loading}>
            Create Feature
          </CustomButton>
        </Box>
      </CustomModal>
    </>
  );
};

const FeatureTableRow: React.FC<IRowProps> = ({ featureData, refetch }) => {
  const [feature, setFeature] = useState(featureData);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState('delete-feature');
  const { open, setOpen } = useModal();
  const { themeColors } = useCustomTheme();
  const [updatedFeature, setUpdatedFeature] = useState(feature);
  const [selectedFeatures, setSelectedFeatures] = useState<ISelectData[]>([]);
  const [selectedUserTypes, setSelectedUserTypes] = useState<ISelectData[]>([]);
  const [featureSearchTerm] = useState('');

  useEffect(() => {
    setSelectedFeatures(
      featureData.subFeaturesData?.map((feature) => {
        return {
          label: feature.featureName ?? '',
          value: feature.featureId ?? '',
        };
      }) ?? []
    );
    setSelectedUserTypes(userTypes.filter((type) => featureData.accessUserTypes?.includes(String(type.value))) ?? []);
  }, [featureData]);

  const updateFeature = async () => {
    setLoading(true);
    const response = await AdminFeatureService.updateFeatureApi(updatedFeature);
    if (response.status) {
      setFeature(response.responseData as FeatureDto);
    } else toast.error(response.responseMessage);
    setLoading(false);
    setOpen(false);
  };

  const deleteFeature = async () => {
    setLoading(true);
    const response = await AdminFeatureService.deleteFeatureApi(featureData.featureId!);
    if (response.status) {
      await refetch();
    } else toast.error(response.responseMessage);
    setLoading(false);
    setOpen(false);
  };

  const { data: subFeatures } = useQuery({
    queryKey: ['sub-features', featureSearchTerm],
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
      <tr key={featureData.featureId}>
        <td>
          <div className="attendant__date">
            <span className="nowrap">{featureData.featureName}</span>
          </div>
        </td>
        <td>
          <div className="attendant__time">
            <span className="nowrap">
              {feature.subFeatures && feature.subFeatures.length > 0 ? (
                <span className="jampack-my-1 jampack-me-2 jampack-badge jampack-badge-soft-dark jampack-bg-bg-grey-light-5">{feature.subFeatures[0].replaceAll('_', ' ')}</span>
              ) : (
                'N/A'
              )}
              {feature.subFeatures && feature.subFeatures.length > 1 ? (
                <span className="jampack-my-1 jampack-me-2 jampack-badge jampack-badge-soft-dark jampack-bg-bg-grey-light-5">+{feature.subFeatures.length - 1}</span>
              ) : null}
            </span>
          </div>
        </td>
        <td>
          <div className="attendant__date">
            <span className="nowrap">
              {feature.accessUserTypes && feature.accessUserTypes.length > 0 ? (
                <span className="jampack-my-1 jampack-me-2 jampack-badge jampack-badge-soft-dark jampack-bg-bg-grey-light-5">{feature.accessUserTypes[0].replaceAll('_', ' ')}</span>
              ) : (
                'N/A'
              )}
              {feature.accessUserTypes && feature.accessUserTypes.length > 1 ? (
                <span className="jampack-my-1 jampack-me-2 jampack-badge jampack-badge-soft-dark jampack-bg-bg-grey-light-5">+{feature.accessUserTypes.length - 1}</span>
              ) : null}
            </span>
          </div>
        </td>
        <td>
          <Box className="attendant__action">
            <CardHeaderDropdown
              options={[
                {
                  label: 'Edit',
                  onClick: () => {
                    setAction('update-feature');
                    setOpen(true);
                  },
                },
                {
                  label: 'Delete',
                  onClick: () => {
                    setAction('delete-feature');
                    setOpen(true);
                  },
                },
              ]}
            />
          </Box>
        </td>
      </tr>

      <CustomModal open={open} closeOnOverlayClick closeModal={() => setOpen(false)} maxWidth="90%" width="533px" showCloseIcon>
        {action === 'update-feature' && (
          <Box sx={{ padding: '20px 40px' }}>
            <Text size={24} weight={700} center color="#141416" sx={{ mb: 2 }}>
              Update Feature
            </Text>

            <InputField
              label="Feature Name"
              placeholder="Feature Name"
              type="text"
              value={updatedFeature.featureName}
              onChange={(e) => {
                setUpdatedFeature({
                  ...updatedFeature,
                  featureName: e?.target.value,
                });
              }}
              mt={3}
            />

            <Typography fontSize={14} fontWeight={500} color={'#141416'} style={{ marginTop: '20px', marginBottom: '10px' }}>
              Sub Features
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
                      setUpdatedFeature({
                        ...updatedFeature,
                        subFeatures: updatedFeature.subFeatures?.filter((feat) => feature.value !== feat),
                      });
                    }}
                  />
                </Box>
              ))
            ) : (
              <Text size={20} weight={500} center>
                Add a sub feature.
              </Text>
            )}

            <SelectField
              options={
                subFeatures?.map((feature: any) => {
                  return {
                    label: feature.featureName,
                    value: feature.featureId,
                  } as ISelectData;
                }) ?? []
              }
              value={null}
              onChange={(e) => {
                if (!e || !e.value) return;
                setSelectedFeatures(selectedFeatures.concat(e));
                setUpdatedFeature({
                  ...updatedFeature,
                  subFeatures: updatedFeature.subFeatures?.concat(String(e?.value)),
                });
              }}
              placeholder="Add features."
              mt={3}
            />

            <Typography fontSize={14} fontWeight={500} color={'#141416'} style={{ marginTop: '20px', marginBottom: '10px' }}>
              Access User Types
            </Typography>

            {selectedUserTypes && selectedUserTypes.length > 0 ? (
              selectedUserTypes.map((type, index) => (
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
                    {type.label}
                  </Text>
                  <IoClose
                    style={{
                      display: 'flex',
                      width: '25px',
                      height: '25px',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setSelectedUserTypes(selectedUserTypes.filter((userType) => type.label !== userType.label));
                      setUpdatedFeature({
                        ...updatedFeature,
                        accessUserTypes: updatedFeature.accessUserTypes?.filter((userType) => type.value !== userType),
                      });
                    }}
                  />
                </Box>
              ))
            ) : (
              <Text size={20} weight={500} center>
                Add an access user type.
              </Text>
            )}

            <SelectField
              options={userTypes}
              value={null}
              onChange={(e) => {
                if (!e || !e.value) return;
                setSelectedUserTypes(selectedUserTypes.concat(e));
                setUpdatedFeature({
                  ...updatedFeature,
                  accessUserTypes: updatedFeature.accessUserTypes?.concat(String(e?.value)),
                });
              }}
              placeholder="Add user type."
              mt={3}
            />

            <InputField
              label="Access Route"
              placeholder="Access Route"
              type="text"
              value={updatedFeature.accessRoute ?? ''}
              onChange={(e) => {
                setUpdatedFeature({
                  ...updatedFeature,
                  accessRoute: String(e?.target.value),
                });
              }}
              mt={3}
            />

            <Typography fontSize={14} fontWeight={500} color={'#141416'} style={{ marginTop: '20px' }}>
              Description
            </Typography>
            <textarea
              maxLength={200}
              required
              value={updatedFeature.description}
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
                setUpdatedFeature({
                  ...updatedFeature,
                  description: e.target.value,
                });
              }}
            ></textarea>

            <CustomButton mode="primary" style={{ marginTop: '20px' }} onClick={() => updateFeature()} disabled={loading} loading={loading}>
              Update Feature
            </CustomButton>
          </Box>
        )}

        {action === 'delete-feature' && (
          <Box sx={{ padding: '20px 40px' }}>
            <Text size={24} weight={700} center color="#141416" sx={{ mb: 2 }}>
              Delete Feature
            </Text>

            <Text size={17} weight={500} center color="#141416" sx={{ mb: 2 }}>
              Are you sure you want to delete this feature?
            </Text>

            <CustomButton mode="primary" style={{ marginTop: '20px' }} onClick={() => deleteFeature()} disabled={loading} loading={loading}>
              Delete Feature
            </CustomButton>
          </Box>
        )}
      </CustomModal>
    </>
  );
};

export default FeatureTable;
