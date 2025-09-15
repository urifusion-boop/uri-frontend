import styles from "@/styles/Atoms.module.css";
import { useMediaQuery } from "@mui/material";
import { AiOutlineInfoCircle } from "react-icons/ai";

interface IProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  text: string;
}

const Tooltip: React.FC<IProps> = ({ text }) => {
  const matches = useMediaQuery("(max-width: 500px)");

  return (
    <span className={styles.tooltip}>
      <AiOutlineInfoCircle style={{ width: "13px", height: "13px" }} />
      <span
        className={styles.info}
        id={`tooltip-${text}`}
        style={{
          transform: matches ? "translateX(-40%)" : "",
        }}
      >
        {text}
      </span>
    </span>
  );
};

export default Tooltip;
