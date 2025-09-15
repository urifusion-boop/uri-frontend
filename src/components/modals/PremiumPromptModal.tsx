import CustomButton from '@/components/atoms/CustomButton';
import Text from '@/components/atoms/CustomText';
import CustomModal from '@/components/modals/CustomModal';
import { Box, Grid, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { PremiumIcon } from '../atoms/Icons';

function PremiumPromptModal() {
	const isMobile = useMediaQuery('(max-width:800px)');
	const router = useRouter();

	// State to control the modal's open status
	const [open, setOpen] = useState(false);

	// Check `sessionStorage` on component mount
	useEffect(() => {
		const hasShownModal = sessionStorage.getItem('hasShownPremiumModal');

		// If modal hasn't been shown in this session, display it
		if (!hasShownModal) {
			setOpen(true);
			sessionStorage.setItem('hasShownPremiumModal', 'true');
		}
	}, []);

	return (
		<CustomModal
			width='756px'
			showCloseIcon
			setOpen={setOpen}
			open={open}>
			<Box
				display='flex'
				justifyContent='center'
				my={2}>
				<PremiumIcon
					width={isMobile ? 160 : 200}
					height={isMobile ? 140 : 180}
				/>
			</Box>
			<Text
				style={{
					textAlign: 'center',
				}}
				weight={600}
				size={isMobile ? 20 : 32}>
				Try Premium
			</Text>
			<Text
				weight={500}
				style={{
					textAlign: 'center',
					color: '#6C727F',
				}}
				size={14}>
				Upgrade your plan to have access to all premium content
			</Text>
			<Grid
				display={'flex'}
				gap={{
					xs: 2,
					sm: 3,
				}}
				paddingBottom={isMobile ? 6 : 2}
				paddingX={isMobile ? 6 : 2}
				flexDirection={isMobile ? 'column' : 'row'}
				justifyContent='center'
				mt={6}>
				<CustomButton
					mode='inverse'
					style={{
						backgroundColor: '#FEF4FD',
						borderWidth: 0,
					}}
					onClick={() => setOpen(false)}>
					Maybe Later
				</CustomButton>
				<CustomButton
					mode='primary'
					onClick={() => {
						setOpen(false);
						router.push("/dashboard");
					}}>
					Upgrade Plan
				</CustomButton>
			</Grid>
		</CustomModal>
	);
}

export default PremiumPromptModal;
