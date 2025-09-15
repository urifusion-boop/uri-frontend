import React, { useEffect, useRef } from "react";
import Scrollbar from "smooth-scrollbar";
import Link from "next/link";
import { Box } from "@mui/material";
import { CreativeProfileDto } from "../../models/dtos/CreativeProfileDto";
import { HiMiniUserGroup } from "react-icons/hi2";
import useCustomTheme from "../../hooks/theme.hook";
import SkeletonCard from "@/components/cards/SkeletonCard";
import { useAuth } from "@/providers/AuthProvider";
import { TextHelper } from "../../helpers/TextHelper";

interface IProps {
  creatives: CreativeProfileDto[];
}

const EventSpeakerList: React.FC<IProps> = ({ creatives }) => {
  const scrollContainerRef = useRef(null);
  const { themeColors } = useCustomTheme();
  const { userDetails } = useAuth();

  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollbar = Scrollbar.init(scrollContainerRef.current);

      return () => {
        scrollbar.destroy();
      };
    }
  }, []);
  return (
    <div className="col-xxl-4 col-xl-4 col-lg-6">
      <div className="card__wrapper">
        <div className="card__header">
          <div className="card__header-top">
            <div className="card__title-inner">
              <div className="card__header-icon">
                <HiMiniUserGroup
                  style={{
                    width: "26px",
                    height: "26px",
                    color: themeColors.primary,
                  }}
                />
              </div>
              <div className="card__header-title">
                <h4>Creatives List</h4>
              </div>
            </div>
            <div className="card__header-right">
              <div className="card__btn">
                <Link href="/creatives">view all Creatives</Link>
              </div>
            </div>
          </div>
        </div>

        <div ref={scrollContainerRef}>
          <div className="card__inner">
            <div className="speaker__wrapper" style={{ paddingTop: "15px" }}>
              {creatives.slice(0, 5).length > 0 &&
                creatives.slice(0, 5).map((creative, index) => (
                  <div key={index} className="speaker__item">
                    <div className="speaker__inner">
                      <div className="speaker__info">
                        <div className="speaker__thumb">
                          <Link
                            href={
                              userDetails?.userId === creative.userId
                                ? `/profile/${creative.userId}`
                                : `/creatives/${creative.userId}`
                            }
                          >
                            <div
                              style={{
                                height: "60px",
                                width: "60px",
                                position: "relative",
                                backgroundColor: "#e8e8e8",
                              }}
                            >
                              <img
                                src={
                                  creative.headshot?.url
                                    ? TextHelper.setUrl(creative.headshot?.url)
                                    : creative.gender === "MALE"
                                      ? `/assets/images/default-user-avatar-male.png`
                                      : `/assets/images/default-user-avatar-female.png`
                                }
                                alt="image not found"
                                style={{
                                  borderRadius: "8px",
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                  objectFit: "cover",
                                }}
                                width={60}
                                height={60}
                              />
                            </div>
                          </Link>
                        </div>
                        <div className="speaker__content">
                          <h5 className="speaker__title">
                            <Link href={`/creatives/${creative.userId}`}>
                              {creative.user?.firstName ?? ""}
                            </Link>
                          </h5>
                          <span
                            className="speaker__status"
                            style={{ transform: "scale(0.7,0.7)" }}
                          >
                            {creative.creativeCategories &&
                            creative.creativeCategories?.length > 0 ? (
                              <span className="creative-tag">
                                {creative.creativeCategories[0].replace(
                                  "_",
                                  " "
                                )}
                              </span>
                            ) : (
                              "N/A"
                            )}
                            {creative.creativeCategories &&
                            creative.creativeCategories?.length > 1 ? (
                              <span className="creative-tag">{`+${
                                creative.creativeCategories?.length - 1
                              }`}</span>
                            ) : null}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              {creatives.length < 1 && (
                <Box>
                  <SkeletonCard />
                </Box>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventSpeakerList;
