import SkeletonLoader from '@/components/loaders/SkeletonLoader';
import { FilterFormValues } from '@/hooks/creatives/dashboard.hook';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaCircleNodes } from 'react-icons/fa6';
import { GrAction } from 'react-icons/gr';
import { HiMiniUserGroup } from 'react-icons/hi2';
import { IoMdPricetags } from 'react-icons/io';
import { BsGraphUp } from 'react-icons/bs';
import overlay_img from '../../../public/assets/images/stat-bg.png';
import FeatureTable from '../../components/admin/FeatureTable';
import SubscriptionPlanTable from '../../components/admin/SubscriptionPlanTable';
import UserTable from '../../components/admin/UserTable';
import WorkflowAnalyticsTab from '../../components/admin/WorkflowAnalyticsTab';
import CustomTabSelect from '../../components/atoms/CustomTabSelect';
import DashboardLayout from '../../components/atoms/DashboardLayout';
import SeoHead from '../../components/atoms/SeoHead';
import { useAdminDashHook } from '../../hooks/admin/dashboard.hook';

const AdminDashboard = () => {
  const { filterSchema, analytics, loading } = useAdminDashHook();
  const [activeTab, setActiveTab] = useState('users');

  useForm<FilterFormValues>({
    mode: 'onBlur',
    resolver: zodResolver(filterSchema),
  });

  const tabButtons = [
    {
      label: 'Overview',
      value: 'overview',
      icon: FaCircleNodes,
      iconSize: 24,
    },
    {
      label: 'Users',
      value: 'users',
      icon: HiMiniUserGroup,
    },
    {
      label: 'Workflows',
      value: 'workflows',
      icon: BsGraphUp,
    },
    {
      label: 'Features',
      value: 'features',
      icon: GrAction,
    },
    {
      label: 'Pricing',
      value: 'pricing',
      icon: IoMdPricetags,
    },
  ];

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <DashboardLayout>
      <SeoHead title="Admin Dashboard" />

      <div className="body__overlay"></div>
      <div className="app__slide-wrapper">
        <div className="row g-20">
          <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-6">
            <div className="expovent__count-item mb-20">
              <div className="expovent__count-thumb include__bg transition-3" style={{ backgroundImage: `url(${overlay_img.src})` }}></div>
              <div className="expovent__count-content">
                <h3 className="expovent__count-number">{`${analytics?.totalCreatives}`}</h3>
                <span className="expovent__count-text">Joined Creatives</span>
              </div>
              <div className="expovent__count-icon">
                <i className="i-flaticon-icon flaticon-group"></i>
              </div>
            </div>
          </div>
          <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-6">
            <div className="expovent__count-item mb-20">
              <div className="expovent__count-thumb include__bg transition-3" style={{ backgroundImage: `url(${overlay_img.src})` }}></div>
              <div className="expovent__count-content">
                <h3 className="expovent__count-number">{`${analytics?.totalClients}`}</h3>
                <span className="expovent__count-text">Total Clients</span>
              </div>
              <div className="expovent__count-icon">
                <i className="i-flaticon-icon flaticon-speaker"></i>
              </div>
            </div>
          </div>
          <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-6">
            <div className="expovent__count-item mb-20">
              <div className="expovent__count-thumb include__bg transition-3" style={{ backgroundImage: `url(${overlay_img.src})` }}></div>
              <div className="expovent__count-icon">
                <i className="i-flaticon-icon flaticon-reminder"></i>
              </div>
            </div>
          </div>
          <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-6">
            <div className="expovent__count-item mb-20">
              <div className="expovent__count-thumb include__bg transition-3" style={{ backgroundImage: `url(${overlay_img.src})` }}></div>
              <div className="expovent__count-content">
                <h3 className="expovent__count-number">{`${analytics?.totalUsers}`}</h3>
                <span className="expovent__count-text">All Users</span>
              </div>
              <div className="expovent__count-icon">
                <i className="i-flaticon-icon flaticon-ticket-1"></i>
              </div>
            </div>
          </div>
        </div>

        <Box my={3} width={'100%'}>
          <Box width={'100%'}>
            <CustomTabSelect active={activeTab} buttons={tabButtons as any} onClick={(value) => setActiveTab(value)} isMobile isCenter width="30px" />
          </Box>
          {activeTab === 'users' && <UserTable />}
          {activeTab === 'workflows' && <WorkflowAnalyticsTab />}
          {activeTab === 'features' && <FeatureTable />}
          {activeTab === 'pricing' && <SubscriptionPlanTable />}
        </Box>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
