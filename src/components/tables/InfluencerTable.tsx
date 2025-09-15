import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { BiLogoLinkedinSquare, BiLogoTiktok } from 'react-icons/bi';

import { InfluencerService } from '@/api/InfluencerService';
import { queryClient } from '@/configs/query-client.config';
import { InfluencerDto } from '@/models/dtos/InfluencerDto';
import { SocialMediaAccountTypeEnum } from '@/models/enum-models/AccountTypeEnum';
import { SocialMediaEnum } from '@/models/enum-models/SocialMediaEnum';
import AddIcon from '@mui/icons-material/Add';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { IoMdPerson } from 'react-icons/io';
import CardHeaderDropdown from '../atoms/CardHeaderDropdown';
import { triggerToast } from '../atoms/CustomToast';
import EmptyState from '../atoms/EmptyState';
import PlatformIcon from '../atoms/PlatformIcons';
import Spinner from '../loaders/Spinner';

// Icons for each platform
const accountIcons = {
  Instagram: <InstagramIcon color="primary" />,
  Twitter: <XIcon color="primary" />,
  X: <XIcon color="primary" />,
  TikTok: <BiLogoTiktok size={24} color="#CD1B78" />,
  Facebook: <FacebookIcon color="primary" />,
  Linkedin: <BiLogoLinkedinSquare size={24} color="#CD1B78" />,
};

interface InfluencerTableProps {
  accounts: InfluencerDto[];
  onEdit: (account: InfluencerDto) => void; // Add onEdit prop
  isLoading?: boolean;
  onCreate?: () => void;
  handleSelect?: (influencer: InfluencerDto) => void;
  selectedAccounts?: InfluencerDto[];
  unAuthenticatedAccount: (influencer: InfluencerDto) => void;
  authenticateAccount: (influencer: InfluencerDto) => void;
}

const InfluencerTable = ({ accounts, onEdit, isLoading, onCreate, handleSelect, selectedAccounts, authenticateAccount, unAuthenticatedAccount }: InfluencerTableProps) => {
  const TableDetails = ({ account }: { account: InfluencerDto }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { mutate: deleteInfluencer, isLoading: deleting } = useMutation({
      mutationFn: async (influencerId: string) => {
        const response = await InfluencerService.deleteInfluencerApi(influencerId);
        if (response.status) {
          queryClient.invalidateQueries({ queryKey: ['influencers'] });
          queryClient.invalidateQueries({ queryKey: ['feature-limit'] });

          setShowDeleteModal(false);
        } else {
          toast.error(response.responseMessage);
        }
      },
    });

    const handleClose = () => setShowDeleteModal(false);

    const handleConfirmDelete = () => {
      deleteInfluencer(account.influencer_id ?? '');
    };

    return (
      <>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox onClick={() => handleSelect && handleSelect(account)} checked={selectedAccounts?.includes(account)} />
          </TableCell>
          <TableCell>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              {account?.profile_pic ? (
                <img
                  src={account.profile_pic}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                  }}
                  alt={account.social_name}
                />
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: '#f1f1f1',
                  }}
                >
                  <IoMdPerson size={30} color="#a8a8a8" />
                </Box>
              )}
            </Box>
          </TableCell>
          <TableCell style={{ color: '#4a4a4a' }}>{account.social_name}</TableCell>
          <TableCell>
            <PlatformIcon platform={account.social_platform ?? ''} />
            <Typography style={{ color: '#4a4a4a', fontSize: '0.9rem' }}>{account.social_username}</Typography>
          </TableCell>
          <TableCell>
            {account?.token ? (
              <Button onClick={() => unAuthenticatedAccount(account)}>
                <Typography color="green" sx={{ cursor: 'pointer', textWrap: 'nowrap' }}>
                  Connected
                </Typography>
              </Button>
            ) : (
              <Button onClick={() => authenticateAccount(account)}>
                <Typography color="red" sx={{ cursor: 'pointer', textWrap: 'nowrap' }}>
                  Re-connect
                </Typography>
              </Button>
            )}
          </TableCell>
          <TableCell style={{ color: '#4a4a4a' }}>{account.followers ?? 'N/A'}</TableCell>
          <TableCell style={{ color: '#4a4a4a' }}>{account.createdAt ? dayjs(account.createdAt).format('DD/MM/YYYY') : 'N/A'}</TableCell>
          <TableCell align="right">
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                flexDirection: 'row-reverse',
              }}
            >
              <CardHeaderDropdown
                options={[
                  {
                    label: 'Edit',
                    onClick: () => onEdit(account),
                  },
                  {
                    label: 'Delete',
                    onClick: () => setShowDeleteModal(true),
                  },
                ]}
              />
              {/* Disable analyze button for linkedin personal account */}
              {account?.social_platform === SocialMediaEnum.LINKEDIN && account.account_type === SocialMediaAccountTypeEnum.PERSONAL ? (
                <Button variant="contained" color="primary" size="small" onClick={() => triggerToast('error', 'Linkedin personal account cannot be analyzed')} sx={{ mr: 1 }}>
                  Analyze
                </Button>
              ) : (
                <Link href={`/account-tracking/${account.influencer_id}/analytics/${account?.social_platform?.toLowerCase()}?username=${account.social_username}`} passHref>
                  <Button variant="contained" color="primary" size="small" sx={{ mr: 1 }}>
                    Analyze
                  </Button>
                </Link>
              )}
            </Box>
          </TableCell>
        </TableRow>

        <Dialog open={showDeleteModal} onClose={handleClose} aria-labelledby="responsive-dialog-title">
          <DialogTitle id="responsive-dialog-title">{'Confirm Deletion'}</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete this influencer? This action cannot be undone.</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary" disabled={deleting}>
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="error" autoFocus>
              {deleting ? <Spinner color="#cd1b78" /> : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  const tableHeaders = ['Profile Picture', 'Account Name', 'Platform', 'Authentication', 'Followers', 'Date Added'];

  return (
    <>
      <TableContainer sx={{ bgcolor: '#fff', borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: 0 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              {tableHeaders.map((header) => (
                <TableCell
                  key={header}
                  style={{
                    color: '#000',
                  }}
                >
                  {header}
                </TableCell>
              ))}
              <TableCell
                style={{
                  color: '#000',
                }}
                align="right"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? [1, 2, 3, 4, 5].map((index) => (
                  <TableRow key={index}>
                    {[...Array(8)].map((_, index) => (
                      <TableCell key={index}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : accounts.map((account) => <TableDetails key={account.influencer_id} account={account} />)}
          </TableBody>
        </Table>
      </TableContainer>
      {!isLoading && accounts.length === 0 && (
        <EmptyState
          message="No influencers found"
          buttonText="Add Accounts"
          onAction={onCreate}
          icon={<AddIcon sx={{ fontSize: 60, color: '#cd1b78' }} />} // Optional icon
        />
      )}
    </>
  );
};

export default InfluencerTable;
