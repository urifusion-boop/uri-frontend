import SeoHead from '@/components/atoms/SeoHead';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/Footer';
import TAndC from '@/components/landing/TAndC';
import Navigation from '@/components/Navigation';
import useCustomTheme from '@/hooks/theme.hook';
import styles from '@/styles/landing.module.css';
import { Box, Link, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { IoMdClose } from 'react-icons/io';
import { UserService } from '../../api/UserService';
import CustomButton from '../../components/atoms/CustomButton';
import CustomRadio from '../../components/atoms/CustomRadio';
import Text from '../../components/atoms/CustomText';
import InputField from '../../components/atoms/Input';
import { TextHelper } from '../../helpers/TextHelper';
import { AccountDeletionReasonEnum } from '../../models/enum-models/AccountDeletionReasonEnum';

export default function DeleteAccount() {
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [showFAQs, setShowFAQs] = useState(false);
  useCustomTheme();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [deletionReasons, setDeletionReasons] = useState<string[]>([]);
  const [otherReason, setOtherReason] = useState('');

  const deleteAccount = async () => {
    setLoading(true);

    const result = await UserService.deleteUserApi({
      email,
      deletionReasons,
      otherReason,
    });

    if (result.status) router.push('/');
    else toast.error(result.responseMessage);

    setLoading(false);
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <>
      <SeoHead title="Delete Account" />

      <div className={styles.welcome}>
        <Navigation />
      </div>

      <>
        <Box className={styles.overlay} onClick={() => setShowDeleteAccount(showDeleteAccount)}></Box>
        <Box className={`${styles.infoContainer} no-scroll`}>
          <Box sx={{ padding: '30px 30px' }}>
            <Box className="d-flex justify-between" sx={{ alignItems: 'center', mb: '10px' }}>
              <Link href={process.env.NEXT_PUBLIC_CLIENT_HOST}>
                <img src="/assets/images/logo.png" alt="logo" width={70} height={40} style={{ marginLeft: '-7px' }} />
              </Link>
              <IoMdClose
                style={{
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer',
                }}
                onClick={handleClose}
              />
            </Box>
            <Typography variant="h5" gutterBottom>
              Delete Account
            </Typography>
            <Typography variant="body2" gutterBottom>
              If you want to leave URI, you can delete your account. Your user data will be deleted permanently. Note that this action cannot be undone.
            </Typography>

            <InputField label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} mt={3} />
            {email.length < 1 || !TextHelper.containsEmail(email) ? (
              <Text size={12} weight={400} color="red">
                Please input the email address linked to your account.
              </Text>
            ) : null}

            <Typography variant="body2" gutterBottom mt={3}>
              Please select a reason for deleting your account:
            </Typography>

            <CustomRadio
              label={'Account Compromised'}
              checked={deletionReasons.includes(AccountDeletionReasonEnum.ACCOUNT_CONPROMISED)}
              onClick={() => {
                deletionReasons.includes(AccountDeletionReasonEnum.ACCOUNT_CONPROMISED)
                  ? setDeletionReasons(deletionReasons.filter((reason) => reason !== AccountDeletionReasonEnum.ACCOUNT_CONPROMISED))
                  : setDeletionReasons(deletionReasons.concat(AccountDeletionReasonEnum.ACCOUNT_CONPROMISED));
              }}
              value={AccountDeletionReasonEnum.ACCOUNT_CONPROMISED}
            />

            <CustomRadio
              label={'Preferred Alternative'}
              checked={deletionReasons.includes(AccountDeletionReasonEnum.PREFERRED_ALTERNATIVE)}
              onClick={() => {
                deletionReasons.includes(AccountDeletionReasonEnum.PREFERRED_ALTERNATIVE)
                  ? setDeletionReasons(deletionReasons.filter((reason) => reason !== AccountDeletionReasonEnum.PREFERRED_ALTERNATIVE))
                  : setDeletionReasons(deletionReasons.concat(AccountDeletionReasonEnum.PREFERRED_ALTERNATIVE));
              }}
              value={AccountDeletionReasonEnum.PREFERRED_ALTERNATIVE}
            />

            <CustomRadio
              label={'Privacy Concerns'}
              checked={deletionReasons.includes(AccountDeletionReasonEnum.PRIVACY_CONCERNS)}
              onClick={() => {
                deletionReasons.includes(AccountDeletionReasonEnum.PRIVACY_CONCERNS)
                  ? setDeletionReasons(deletionReasons.filter((reason) => reason !== AccountDeletionReasonEnum.PRIVACY_CONCERNS))
                  : setDeletionReasons(deletionReasons.concat(AccountDeletionReasonEnum.PRIVACY_CONCERNS));
              }}
              value={AccountDeletionReasonEnum.PRIVACY_CONCERNS}
            />

            <CustomRadio
              label={'Other'}
              checked={deletionReasons.includes(AccountDeletionReasonEnum.OTHER)}
              onClick={() => {
                deletionReasons.includes(AccountDeletionReasonEnum.OTHER)
                  ? setDeletionReasons(deletionReasons.filter((reason) => reason !== AccountDeletionReasonEnum.OTHER))
                  : setDeletionReasons(deletionReasons.concat(AccountDeletionReasonEnum.OTHER));
              }}
              value={AccountDeletionReasonEnum.OTHER}
            />

            {deletionReasons.length < 1 ? (
              <Text size={12} weight={400} color="red">
                Please select a reason for deleting your account.
              </Text>
            ) : null}

            {deletionReasons.includes(AccountDeletionReasonEnum.OTHER) && (
              <>
                <textarea
                  maxLength={200}
                  required
                  style={{
                    width: '100%',
                    minHeight: '173px',
                    maxHeight: '173px',
                    margin: '30px 0 0px',
                    border: '1px solid #E0DEF7',
                    borderRadius: '5px',
                    outline: '1px solid #E0DEF7',
                    padding: '18px',
                    background: 'white',
                  }}
                  placeholder="Not more than 500 characters."
                  onChange={(e) => {
                    setOtherReason(String(e.target.value).trim().length <= 500 ? e.target.value : otherReason);
                  }}
                  value={otherReason}
                ></textarea>

                {otherReason.length < 1 ? (
                  <Text size={12} weight={400} color="red">
                    Please specify the reason for deleting your account.
                  </Text>
                ) : null}
              </>
            )}

            <CustomButton
              mode="primary"
              style={{ width: '253px', marginTop: '30px' }}
              onClick={() => deleteAccount()}
              disabled={email.length < 1 || !TextHelper.containsEmail(email) || deletionReasons.length < 1 || (deletionReasons.includes(AccountDeletionReasonEnum.OTHER) && otherReason.length < 1)}
              loading={loading}
            >
              Delete
            </CustomButton>
          </Box>
        </Box>
      </>

      <Footer />

      {showDeleteAccount ? <TAndC toggleTAndC={() => setShowDeleteAccount(!showDeleteAccount)} /> : null}
      {showFAQs ? <FAQ /> : null}
    </>
  );
}
