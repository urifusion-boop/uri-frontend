import { Grid, Skeleton, SxProps, Theme } from "@mui/material";
import React from "react";

interface LoaderWrapperProps {
  isLoading?: boolean;
  children: React.ReactNode;
  skeletonHeight?: string;
  skeletonWidth?: string;
  skeletonVariant?: "rectangular" | "circular" | "text";
  numberOfSkeletons?: number;
  mb?: string;
  sx?: SxProps<Theme>;
  // Grid related props
  isGrid?: boolean;
  gridColumns?: number;
  gridSpacing?: number;
  gridItemSx?: SxProps<Theme>;
}

const LoaderWrapper = ({
  children,
  isLoading,
  skeletonHeight,
  skeletonVariant,
  skeletonWidth,
  numberOfSkeletons,
  mb,
  sx,
  isGrid = false,
  gridColumns = 3,
  gridSpacing = 2,
  gridItemSx,
}: LoaderWrapperProps) => {
  const renderSkeletons = () => {
    const skeletons = Array.from({ length: numberOfSkeletons ?? 1 }).map(
      (_, index) => (
        <Skeleton
          key={`skeleton-${index}`}
          variant={skeletonVariant ?? "rectangular"}
          sx={{
            height: skeletonHeight ?? "100%",
            width: skeletonWidth ?? "100%",
            mb: mb ?? "0",
            ...sx,
          }}
          animation="wave"
        />
      )
    );

    if (isGrid) {
      return (
        <Grid container spacing={gridSpacing}>
          {skeletons.map((skeleton, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={12 / gridColumns}
              key={`grid-item-${index}`}
              sx={gridItemSx}
            >
              {skeleton}
            </Grid>
          ))}
        </Grid>
      );
    }

    return skeletons;
  };

  return <>{isLoading ? renderSkeletons() : children}</>;
};

export default LoaderWrapper;
