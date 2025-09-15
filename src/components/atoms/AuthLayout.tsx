import useCustomTheme from "@/hooks/theme.hook";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React, { ReactNode, useState, useEffect } from "react";

interface IProps {
  children: ReactNode;
}

const carouselItems = [
  {
    id: "growth",
    title: "Empower Your Growth",
    description:
      "Harness AI-driven solutions to streamline operations, enhance decision-making, and achieve measurable success.",
    image: "/assets/images/sign-three-stat.png",
  },
  {
    id: "opportunities",
    title: "Unlock New Opportunities",
    description:
      "Discover untapped potential with insights that help you identify trends, connect with customers, and expand your reach.",
    image: "/assets/images/sign-web-analytics.png",
  },
  {
    id: "competition",
    title: "Stay Ahead of the Competition",
    description:
      "Use advanced analytics to anticipate market changes, optimize campaigns, and maintain a competitive edge.",
    image: "/assets/images/sign-web-analytics.png",
  },
];

const AuthLayout: React.FC<IProps> = ({ children }) => {
  const { themeColors } = useCustomTheme();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide((prevSlide) =>
        prevSlide === carouselItems.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentSlide]);

  return (
    <Box
      sx={{
        background: themeColors.background,
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="max-w-[1200px] mx-auto flex w-full items-center md:space-x-6 px-8">
        {/* Login Form Section */}
        <div className="mx-auto flex-1 max-h-[850px] overflow-y-auto">
          {children}
        </div>

        {/* Carousel Section - Hidden on Mobile */}
        <div className="hidden md:flex flex-[0.85] w-full rounded-[30px] min-h-[690px] relative overflow-hidden">
          <Image
            src="/assets/images/sign-up-carousel-bg.png"
            alt="slide"
            layout="fill"
          />
          <Box
            className="flex h-full transition-transform duration-500 ease-in-out mb-4"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {carouselItems.map((item) => (
              <div
                key={item.id}
                className="w-full flex-shrink-0 justify-center h-full"
              >
                <Image
                  src={item.image}
                  alt="slide"
                  width={536}
                  height={507}
                  objectFit="contain"
                  className=" object-contain mt-[36px] px-8 mx-auto"
                />
                <Typography
                  fontWeight={600}
                  className="text-white text-center text-[30px]"
                >
                  {item.title}
                </Typography>
                <Typography
                  fontSize={15}
                  fontWeight={300}
                  className="text-white text-center mt-2 leading-[31px] px-9"
                >
                  {item.description}
                </Typography>
              </div>
            ))}
          </Box>
          <div className="absolute bottom-14 left-0 right-0 flex justify-center gap-2">
            {carouselItems.map((item, index) => (
              <button
                key={item.id}
                aria-label={`Go to slide ${index + 1}`}
                role="tab"
                aria-selected={currentSlide === index}
                className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                  currentSlide === index ? "bg-white scale-125" : "bg-white/50"
                }`}
                onClick={() => handleSlideChange(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </Box>
  );
};

export default AuthLayout;
