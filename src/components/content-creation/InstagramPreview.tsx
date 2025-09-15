import React, { useState } from "react";
import { Box, Typography, Avatar, IconButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { UserDocDto } from "@/models/dtos/base/UserDocDto";
import { MediaHelper } from "@/helpers/MediaHelper";
import { MediaTypeEnum } from "@/models/enum-models/MediaTypeEnum";
import { TextHelper } from "@/helpers/TextHelper";
import { Swiper as SwiperType } from "swiper/types";
import { Navigation } from "swiper/modules";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { FiSend } from "react-icons/fi";

interface InstagramPreviewProps {
  username: string;
  avatarUrl: string;
  images: UserDocDto[];
  caption: string;
}

const InstagramPreview: React.FC<InstagramPreviewProps> = ({
  username,
  avatarUrl,
  images,
  caption,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);
  };

  return (
    <Box sx={{ boxShadow: 3, width: "100%", p: 2, borderRadius: 2 }}>
      <Box>
        {/* Header */}
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar src={avatarUrl} alt={username} sx={{ marginRight: 2 }} />
          <Typography variant="subtitle1" fontWeight="bold">
            {username}
          </Typography>
        </Box>

        {/* Swiper */}
        <Box
          sx={{
            position: "relative",
            mb: 2,
          }}
        >
          <Swiper
            spaceBetween={10}
            slidesPerView={1}
            pagination={{ clickable: true }}
            navigation={{
              nextEl: `.swiper-button-next${username}`,
              prevEl: `.swiper-button-prev${username}`,
            }}
            scrollbar={{ draggable: true }}
            modules={[Navigation]}
            onSlideChange={handleSlideChange}
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <Box
                  sx={{
                    width: "100%",
                    height: 500,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {MediaHelper.getMediaType(image.docType) ===
                  MediaTypeEnum.IMAGE ? (
                    <img
                      src={TextHelper.setUrl(image.url)}
                      alt={`Image ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%,",
                        objectFit: "cover",
                        borderRadius: 1,
                      }}
                    />
                  ) : (
                    <video
                      src={TextHelper.setUrl(image.url)}
                      autoPlay
                      loop
                      muted
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 1,
                      }}
                    />
                  )}
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
          <IconButton
            className={`swiper-button-next${username}`}
            style={{
              position: "absolute",
              top: "50%",
              right: "10px",
              transform: "translateY(-50%)",
              zIndex: 10,
              color: "#fff",
              backgroundColor: "rgba(0,0,0,0.5)",
              visibility:
                activeIndex === images.length - 1 ? "hidden" : "visible",
            }}
          >
            <BsChevronRight size={10} />
          </IconButton>

          <IconButton
            className={`swiper-button-prev${username}`}
            style={{
              position: "absolute",
              top: "50%",
              left: "10px",
              transform: "translateY(-50%)",
              zIndex: 10,
              color: "#fff",
              backgroundColor: "rgba(0,0,0,0.5)",
              visibility: activeIndex === 0 ? "hidden" : "visible",
            }}
          >
            <BsChevronLeft size={10} />
          </IconButton>
        </Box>

        {/* Buttons */}
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Box>
            <IconButton>
              <FavoriteBorderIcon />
            </IconButton>
            <IconButton>
              <ChatBubbleOutlineIcon />
            </IconButton>
            <IconButton>
              <FiSend />
            </IconButton>
          </Box>
          <IconButton>
            <BookmarkBorderIcon />
          </IconButton>
        </Box>

        {/* Caption */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="body1" mt={2} fontWeight={600}>
            {username}
          </Typography>
          <Typography variant="body1" mt={2}>
            {caption}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default InstagramPreview;
