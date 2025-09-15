import useCustomTheme from "@/hooks/theme.hook";
import { Rating as MuiRating, styled } from "@mui/material";

interface IProps {
  ratingReviews: number;
  readonly?: boolean;
  precision?: number;
  size?: string;
  onChange:
    | ((
        event: React.SyntheticEvent<Element, Event>,
        value: number | null
      ) => void)
    | undefined;
}

const Rating = ({
  ratingReviews,
  precision,
  readonly,
  size,
  onChange,
}: IProps) => {
  const { themeColors } = useCustomTheme();

  const CustomRating = styled(MuiRating)({
    "& .MuiRating-iconFilled": {
      color: themeColors.primary,
    },
    "& .MuiRating-iconHover": {
      color: themeColors.primary,
    },
  });

  return (
    <CustomRating
      readOnly={readonly}
      value={ratingReviews}
      precision={precision || 1}
      sx={{ mx: "auto", fontSize: size || "20px" }}
      onChange={onChange}
    />
  );
};

export default Rating;
