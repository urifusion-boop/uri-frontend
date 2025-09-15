import { CanvasHelper } from '@/helpers/CanvasHelper';
import { Box, LinearProgress, Typography, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/router';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FaCheck, FaCircleCheck, FaX } from 'react-icons/fa6';
import ReactCrop, { Crop, centerCrop, convertToPixelCrop, makeAspectCrop } from 'react-image-crop';
import { DocumentService } from '../../api/DocumentService';
import { FileHelper } from '../../helpers/FileHelper';
import { IFile } from '../../hooks/profile/client/clientProfileSetup.hook';
import CustomModal from '../modals/CustomModal';
import CustomButton from './CustomButton';
import Text from './CustomText';

const ASPECT_RATIO = 1;

interface IProps {
  onSave: (data: IFile) => void;
  dimension: number;
  setOpenCropModal: Dispatch<SetStateAction<boolean>>;
  imageSrc: string | undefined;
  openCropModal: boolean;
}

const ImageProcessing: React.FC<IProps> = ({ onSave, dimension, imageSrc, openCropModal, setOpenCropModal }) => {
  const router = useRouter();

  const [loading] = useState(false);
  const [validated] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [outputCropImage, setOutputCropImage] = useState<string | null>();
  const [outputImageBgRemoved] = useState<string | null>();
  const [, setStep] = useState(1);
  const [crop, setCrop] = useState<Crop>();
  const [open, setOpen] = useState(false);

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const matches = useMediaQuery('(max-width: 500px)');

  const handleSave = async () => {
    if (!outputCropImage) return;

    setUploadingImage(true);

    const blob = await fetch(outputCropImage).then((res) => res.blob());

    const fileData = new FormData();
    fileData.append('file', blob);

    const response = await DocumentService.uploadFile(fileData, `${router.query.id}/GeneralImages/${Date.now()}_${'headshot'}`);

    if (response.responseCode === 200) {
      let img = {
        docName: response.responseData?.docName!,
        docType: response.responseData?.docType!,
        publicId: response.responseData?.publicId!,
        url: response.responseData?.url!,
      };

      setOpen(false);

      onSave(img);
    } else {
      toast.error('Error uploading image');
      setUploadingImage(false);
    }

    setUploadingImage(false);
  };

  const onImageLoad = (e: any) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (dimension / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: '%',
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  useEffect(() => {
    if (!outputCropImage) return;
    setStep(1);
  }, [outputCropImage]);

  return (
    <>
      <CustomModal open={openCropModal} radius="8px" bgColor="#fff" showCloseIcon setOpen={setOpenCropModal}>
        <Box>
          <Box display={'flex'} flexDirection={'column'} alignItems={'center'} my={'40px'} gap={'20px'}>
            <ReactCrop
              crop={crop}
              keepSelection
              aspect={1}
              onChange={(crop, percentCrop) => {
                setCrop(percentCrop);
              }}
              minHeight={dimension}
              minWidth={dimension}
              maxHeight={dimension}
              maxWidth={dimension}
            >
              <img src={imageSrc} ref={imgRef} alt="image" style={{ maxHeight: '300px' }} onLoad={onImageLoad} />
            </ReactCrop>

            <canvas
              ref={previewCanvasRef}
              style={{
                display: 'none',
              }}
            />
          </Box>
          <Box display={'flex'} alignItems={'center'} gap={'12px'} mt={'20px'} flexDirection={matches ? 'column' : 'row'} maxWidth={'521px'} mx={'auto'}>
            <CustomButton mode="inverse" type="submit" data-testid="edit-profile-button" onClick={() => setOpenCropModal(false)}>
              Cancel
            </CustomButton>
            <CustomButton
              mode="primary"
              type="submit"
              data-testid="edit-profile-button"
              onClick={() => {
                CanvasHelper.setCanvasPreview(imgRef?.current!, previewCanvasRef?.current!, convertToPixelCrop(crop!, imgRef.current?.width!, imgRef.current?.height!), setOutputCropImage);

                setOpenCropModal(false);
                setOpen(true);
              }}
            >
              Done
            </CustomButton>
          </Box>
        </Box>
      </CustomModal>

      <CustomModal open={open} setOpen={setOpen} bgColor="#fff">
        <Box
          sx={{
            margin: '10px',
            position: 'relative',
          }}
        >
          <>
            <Text size={matches ? 16 : 24} weight={500} sx={{ mt: 1 }} center>
              Image Processing
            </Text>
            <Text size={matches ? 12 : 18} weight={400} sx={{ mt: 1 }} color="#141416B2" center>
              We need to run some checks that align with our photo guidelines
            </Text>
            <Box
              style={{
                height: '250px',
                borderRadius: '10px',
                marginTop: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <img
                src={validated && outputImageBgRemoved ? FileHelper.binaryStringToImageSource(outputImageBgRemoved) : (outputCropImage ?? '')}
                alt="image not found"
                style={{
                  width: '90%',
                  height: '90%',
                  objectFit: 'contain',
                }}
              />

              <Box
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: '0px',
                  right: '0px',
                  borderRadius: '20px',
                  backgroundImage: 'url(/assets/gif/scanner.gif)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  pointerEvents: 'none',
                  display: loading && !validated ? 'block' : 'none',
                }}
              ></Box>
            </Box>

            <Box maxWidth={'425px'} mx={'auto'}>
              <LinearProgress
                variant="determinate"
                // value={50 * step}
                value={100}
                sx={{
                  '.MuiLinearProgress-bar': { bgcolor: '#CD1B7880' },
                  borderRadius: '10px',
                }}
              />
              <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={matches ? 'column' : 'row'} gap={'10px'} mt={'28px'}>
                <Box display={'flex'} alignItems={'center'} gap={'10px'}>
                  <Typography fontSize={matches ? 14 : 18} fontWeight={400} color={'#141416B2'}>
                    AI Validation
                  </Typography>
                  <FaCircleCheck size={16} color={validated ? '#CD1B78' : '#6C727F3D'} />
                </Box>
              </Box>
            </Box>

            {/* {loading && step === 1 && ( */}
            {loading && (
              <Typography sx={{ mt: 2 }} fontSize={matches ? 14 : 18} fontWeight={400} color={'#141416B2'} textAlign={'center'}>
                {' '}
                Ai Validation going on....please wait
              </Typography>
            )}

            {/* {validated && step === 1 && ( */}
            {validated && (
              <Box display={'flex'} alignItems={'center'} gap={1} justifyContent={'center'} bgcolor={'#AAFFE5'} maxWidth={'362px'} borderRadius={'4px'} height={'36px'} mt={1} mx={'auto'}>
                <FaCheck color="#5DD9C1" size={12} />
                <Typography fontSize={14} fontWeight={400} color={'#141416B2'} textAlign={'center'}>
                  {' '}
                  This image has been validated
                </Typography>
              </Box>
            )}

            {/* {!validated && !loading && step === 1 && ( */}
            {!validated && !loading && (
              <Box display={'flex'} alignItems={'center'} gap={1} justifyContent={'center'} bgcolor={'#FA8072'} maxWidth={'362px'} borderRadius={'4px'} height={'36px'} mt={1} mx={'auto'}>
                <FaX color="red" size={10} />
                <Typography fontSize={14} fontWeight={400} color={'#141416B2'} textAlign={'center'}>
                  {' '}
                  This photo does not align with our photo guidelines
                </Typography>
              </Box>
            )}

            <Box display={'flex'} alignItems={'center'} gap={'12px'} mt={'20px'} flexDirection={matches ? 'column' : 'row'} maxWidth={'521px'} mx={'auto'}>
              <CustomButton
                mode="inverse"
                type="submit"
                data-testid="edit-profile-button"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancel
              </CustomButton>
              <CustomButton mode={validated ? 'primary' : 'disabled'} type="submit" data-testid="edit-profile-button" disabled={!validated} onClick={handleSave} loading={uploadingImage}>
                Done
              </CustomButton>
            </Box>
          </>
        </Box>
      </CustomModal>
    </>
  );
};

export default ImageProcessing;
