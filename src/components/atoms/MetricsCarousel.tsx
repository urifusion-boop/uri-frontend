import { Swiper, SwiperSlide } from "swiper/react";
import { Box, IconButton } from "@mui/material";
import { MediaTypeEnum } from "@/models/enum-models/MediaTypeEnum";
import { Navigation } from "swiper/modules";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { useState } from "react";
import { Swiper as SwiperType } from "swiper/types";

interface MediaItemProps {
  postMedia: {
    id: string;
    data: {
      media_type: string;
      media_url: string;
    }[];
    media_url: string;
  };
}

const MetricsCarousel = ({ postMedia }: MediaItemProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);
  };

  return postMedia?.data && postMedia.data.length > 0 ? (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation={{
          nextEl: `.swiper-button-next${postMedia.id}`,
          prevEl: `.swiper-button-prev${postMedia.id}`,
        }}
        scrollbar={{ draggable: true }}
        modules={[Navigation]}
        onSlideChange={handleSlideChange}
      >
        {postMedia.data.map((child, index) => (
          <SwiperSlide key={index}>
            <Box
              sx={{
                height: "100%",
                width: "100%",
                mt: 1,
                borderRadius: 2,
                overflow: "hidden",
                mb: 2,
              }}
            >
              {child.media_type === MediaTypeEnum.IMAGE ? (
                <img
                  src={child.media_url}
                  alt="post"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              ) : (
                <video
                  src={child.media_url}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                  controls
                />
              )}
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>

      <IconButton
        className={`swiper-button-next${postMedia.id}`}
        style={{
          position: "absolute",
          top: "50%",
          right: "10px",
          transform: "translateY(-50%)",
          zIndex: 10,
          color: "#fff",
          backgroundColor: "rgba(0,0,0,0.5)",
          visibility:
            activeIndex === postMedia.data.length - 1 ? "hidden" : "visible",
        }}
      >
        <BsChevronRight size={10} />
      </IconButton>

      <IconButton
        className={`swiper-button-prev${postMedia.id}`}
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
  ) : (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        mt: 1,
        borderRadius: 2,
        overflow: "hidden",
        mb: 2,
      }}
    >
      <img
        src={postMedia.media_url}
        alt="post"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />
    </Box>
  );
};

export default MetricsCarousel;
