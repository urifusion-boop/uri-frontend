import { Box, Grid } from "@mui/material";

interface StepperProps {
  index: number;
  step: number;
}

const Stepper = ({ index, step }: StepperProps) => {
  return (
    <Grid item xs={3}>
      <Box
        height={"6px"}
        width={"100%"}
        bgcolor={step >= index ? "#cd1b78" : "#E0DEF7"}
        borderRadius={"4px"}
      ></Box>
    </Grid>
  );
};

export default Stepper;
