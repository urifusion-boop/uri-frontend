import { Box } from "@mui/material";
import React, { useState } from "react";
import GalleryBox from "./GalleryBox";
import { useAuth } from "@/providers/AuthProvider";
import GalleryBox2 from "./GalleryBoxSecond";
import EmptyProfileDetails from "@/components/creatives/EmptyProfileDetails";
import { useRouter } from "next/router";
import { pictureSizes } from "@/data/creatives";
import { CreativeProfileDto } from "@/models/dtos/CreativeProfileDto";
import ImageModal from "@/components/modals/ImageModal";

interface ProfileGalleryProps {
  creativeProfile: CreativeProfileDto | null;
}

const ProfileGallery = ({ creativeProfile }: ProfileGalleryProps) => {
  const { userProfile } = useAuth();
  const route = useRouter();
  const { id } = route.query;
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true); // Open the modal when an image is clicked
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <>
      {userProfile.userId === id ? (
        <Box>
          {pictureSizes.map((item) => (
            <GalleryBox
              item={item}
              key={item.name}
              index={item.index}
              creativeProfile={userProfile}
              onClick={handleImageClick}
            />
          ))}
        </Box>
      ) : creativeProfile &&
        creativeProfile.images &&
        creativeProfile.images.length > 0 ? (
        <Box>
          {pictureSizes.map((item) => (
            <GalleryBox2
              item={item}
              key={item.name}
              index={item.index}
              creativeProfile={creativeProfile!}
              onClick={handleImageClick} // Pass the click handler to GalleryBox2
            />
          ))}
        </Box>
      ) : (
        <EmptyProfileDetails
          header="No Pictures"
          image="/assets/images/camera.png"
          text="This creative is yet to add their pictures. Stay tuned!"
          height={800}
          width={800}
        />
      )}
      {/* Conditional rendering of the ImageModal based on the state */}
      {isModalOpen && (
        <ImageModal
          isOpen={isModalOpen}
          imageUrl={selectedImage}
          onClose={() => handleCloseModal()}
          modalStyle={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "350px", // Set the width as necessary
            height: "480px", // Set the height as necessary
            border: "1px solid",
            // Add any other custom styles as needed
          }}
        />
      )}
    </>
  );
};

export default ProfileGallery;
