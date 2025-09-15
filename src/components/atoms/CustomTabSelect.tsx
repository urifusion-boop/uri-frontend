import styles from "@/styles/Organisms.module.css";
import { useMediaQuery } from "@mui/material";
import Text from "./CustomText";
import useCustomTheme from "../../hooks/theme.hook";

interface IProps {
  active: string;
  buttons: {
    label: string;
    value: string;
    icon?: ({
      color,
      size,
    }: {
      color: string;
      size: number;
    }) => React.JSX.Element;
    iconSize?: number;
  }[];
  onClick: (value: string) => void;
  isMobile?: boolean;
  isCenter?: boolean;
  width?: string;
}

const CustomTabSelect: React.FC<IProps> = ({
  active,
  buttons,
  onClick,
  isMobile,
  isCenter,
  width,
}) => {
  const { themeColors } = useCustomTheme();
  const matches = useMediaQuery("(max-width: 500px)");

  return (
    <div
      className={styles.tabSelect}
      style={{
        borderBottom: `1px solid ${themeColors.borderColor}`,
        display: isCenter ? "flex" : "block",
        justifyContent: isCenter ? "center" : "flex-start",
        paddingRight: isCenter ? "0px" : "20px",
        gap: isCenter ? "20px" : "0px",
      }}
    >
      {buttons.length &&
        buttons.map((button, index) => (
          <div
            className={styles.tabSelectButton}
            onClick={() => onClick(button.value)}
            key={index}
          >
            <Text
              size={16}
              weight={500}
              sx={{ display: "flex", alignItems: "center", gap: "12px" }}
              color={
                active === button.value
                  ? themeColors.primary
                  : themeColors.placeholder
              }
            >
              {button.icon && (
                <button.icon
                  size={button?.iconSize ?? 28}
                  color={
                    active === button.value
                      ? themeColors.primary
                      : themeColors.placeholder
                  }
                />
              )}
              <span style={{ display: matches && isMobile ? "none" : "block" }}>
                {button.label}
              </span>
            </Text>
            {active === button.value && (
              <div
                style={{
                  backgroundColor: themeColors.primary,
                  width: width ? width : "",
                }}
              ></div>
            )}
          </div>
        ))}
    </div>
  );
};

export default CustomTabSelect;
