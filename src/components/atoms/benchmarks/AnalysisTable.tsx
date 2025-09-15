import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FaHandBackFist } from "react-icons/fa6";
import { BsWindowStack } from "react-icons/bs";
import useTheme from "@/hooks/theme.hook";
import { RxCaretDown } from "react-icons/rx";
import { CiSearch } from "react-icons/ci";
import { MdMoreHoriz } from "react-icons/md";
import { IoCaretDownCircle } from "react-icons/io5";
import { PiFileTextDuotone, PiTextAUnderlineLight } from "react-icons/pi";
import RatingStars from "./StarComponent";
import { HiPlus } from "react-icons/hi2";

export const AnalysisTable = () => {
  const { themeColors } = useTheme();

  const tableData = [
    {
      product: "Your product",
      market_awareness: 5,
      ability_to_execute: 2,
      product_breadth: 3,
      product_quality: 5,
      icon: <PiFileTextDuotone />,
    },
    {
      product: "Competitor 3",
      market_awareness: 2,
      ability_to_execute: 3,
      product_breadth: 5,
      product_quality: 1,
      // icon: <PiFileTextDuotone />
    },
    {
      product: "Competitor 2",
      market_awareness: 4,
      ability_to_execute: 3,
      product_breadth: 3,
      product_quality: 2,
      // icon: <PiFileTextDuotone />
    },
    {
      product: "Competitor 1",
      market_awareness: 2,
      ability_to_execute: 4,
      product_breadth: 1,
      product_quality: 4,
      // icon: <PiFileTextDuotone />
    },
    {
      product: "Competitor X",
      market_awareness: 2,
      ability_to_execute: 3,
      product_breadth: 2,
      product_quality: 4,
      icon: <FaHandBackFist />,
    },
  ];
  return (
    <Box sx={{ gap: 2, display: "grid", width: "100%" }}>
      <Typography variant="h4" fontWeight={600}>
        {" "}
        <FaHandBackFist color={themeColors.primary} /> Competitor Analysis
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <BsWindowStack />
          <Typography>
            Scorecard View <RxCaretDown cursor={"pointer"} />{" "}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Typography>Filter</Typography>
          <Typography> Sort </Typography>

          <IconButton>
            {" "}
            <CiSearch />{" "}
          </IconButton>
          <IconButton>
            {" "}
            <MdMoreHoriz />{" "}
          </IconButton>

          <ButtonGroup
            variant="contained"
            aria-label="Button group with a nested menu"
          >
            <Button> New </Button>
            <Button
              size="small"
              aria-label="select merge strategy"
              aria-haspopup="menu"
            >
              <RxCaretDown size={20} />
            </Button>
          </ButtonGroup>
        </Box>
      </Box>
      <TableContainer>
        <Table
          sx={{
            border: "1px solid lightgray",
            color: "#000",
            "& td, & th": {
              borderRight: "1px solid lightgray",
              borderColor: "lightgray",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#000" }}>
                {" "}
                <PiTextAUnderlineLight /> Product
              </TableCell>
              <TableCell sx={{ color: "#000" }}>
                {" "}
                <IoCaretDownCircle cursor={"pointer"} /> Market Awareness
              </TableCell>
              <TableCell sx={{ color: "#000" }}>
                {" "}
                <IoCaretDownCircle cursor={"pointer"} /> Ability to execute
              </TableCell>
              <TableCell sx={{ color: "#000" }}>
                {" "}
                <IoCaretDownCircle cursor={"pointer"} /> Product breadth
              </TableCell>
              <TableCell sx={{ color: "#000" }}>
                {" "}
                <IoCaretDownCircle cursor={"pointer"} /> Product quality
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow key={index} sx={{ padding: 2 }}>
                <TableCell sx={{ color: "#000", fontWeight: 600, padding: 2 }}>
                  {" "}
                  {row.icon} {row.product}
                </TableCell>
                <TableCell sx={{ color: "#000" }}>
                  {" "}
                  {<RatingStars rating={row.market_awareness} />}{" "}
                </TableCell>
                <TableCell sx={{ color: "#000" }}>
                  {" "}
                  {<RatingStars rating={row.ability_to_execute} />}{" "}
                </TableCell>
                <TableCell sx={{ color: "#000" }}>
                  {" "}
                  {<RatingStars rating={row.product_breadth} />}{" "}
                </TableCell>
                <TableCell sx={{ color: "#000" }}>
                  {" "}
                  {<RatingStars rating={row.product_quality} />}{" "}
                </TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ padding: 2 }}>
              <TableCell>
                {" "}
                <Button sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {" "}
                  <HiPlus /> New{" "}
                </Button>{" "}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
