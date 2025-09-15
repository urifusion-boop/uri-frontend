import { AuthService } from "@/api/AuthService";
import CustomButton from "@/components/atoms/CustomButton";
import Spinner from "@/components/loaders/Spinner";
import { containsNumber, containsSymbol } from "@/configs/rules.config";
import useCustomTheme from "@/hooks/theme.hook";
import { useToggle } from "@/hooks/utils.hook";
import { useAuth } from "@/providers/AuthProvider";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import CustomRadio from "../../components/atoms/CustomRadio";
import InputField from "../../components/atoms/Input";

const ChangePassword = () => {
  const router = useRouter();
  const { themeColors } = useCustomTheme();
  const { show, toggleShow } = useToggle();
  const [loading, setLoading] = useState(false);
  const { logoutUser, userProfile } = useAuth();

  const [password, setPassword] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);

  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const submit = async () => {
    if (password.password.trim().length < 8)
      return toast.error("Password too short");

    if (!containsNumber(password.password))
      return toast.error("Password must contain a number");

    if (!containsSymbol(password.password))
      return toast.error("Password must contain a symbol");

    if (password.password !== password.confirmPassword)
      return toast.error("confirm password not correct");
    setLoading(true);

    const response = await AuthService.changePasswordApi({
      currentPassword: password.currentPassword,
      newPassword: password.password,
      userId: userProfile.userId!,
    });

    if (response) {
      if (response.responseCode === 200) {
        toast.success(response.responseMessage);
        logoutUser ? logoutUser() : router.push("/login");
      } else {
        toast.error(response.responseMessage);
      }
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        maxWidth: "500px",
        width: "100%",
        margin: "auto",
        borderRadius: "12px",
        backgroundColor: "#fff",
        py: "24px",
        boxShadow: "-1px -1px 10px 2px #0000000D",
        px: "28px",
      }}
    >
      <Typography
        sx={{
          fontSize: "clamp(1.375rem, 1.3232rem + 0.221vw, 1.5rem)",
          fontWeight: 600,
          color: "#404040",
          mb: "6px",
        }}
      >
        Change Password
      </Typography>

      <Box sx={{ width: "100%" }}>
        <InputField
          label="Current Password"
          placeholder="Enter Password"
          value={password.currentPassword}
          onChange={(e) =>
            setPassword({ ...password, currentPassword: e.target.value })
          }
          mt={1}
          rightIcon
          type={show ? "text" : "password"}
          icon={
            !show ? (
              <AiOutlineEyeInvisible
                color={themeColors.placeholder}
                style={{ width: 24, height: 24 }}
                className="pointer"
                onClick={toggleShow}
              />
            ) : (
              <AiOutlineEye
                color={themeColors.placeholder}
                style={{ width: 24, height: 24 }}
                className="pointer"
                onClick={toggleShow}
              />
            )
          }
        />
        <InputField
          label="New Password"
          placeholder="Enter Password"
          required
          value={password.password}
          onChange={(e) =>
            setPassword({ ...password, password: e.target.value })
          }
          mt={1}
          type={showNewPassword ? "text" : "password"}
          rightIcon
          icon={
            !showNewPassword ? (
              <AiOutlineEyeInvisible
                color={themeColors.placeholder}
                style={{ width: 24, height: 24 }}
                className="pointer"
                onClick={toggleShowNewPassword}
              />
            ) : (
              <AiOutlineEye
                color={themeColors.placeholder}
                style={{ width: 24, height: 24 }}
                className="pointer"
                onClick={toggleShowNewPassword}
              />
            )
          }
        />
        <Box sx={{ overflow: "hidden" }}>
          <Box sx={{ float: "left" }}>
            <CustomRadio
              disabled
              label="At least 8 characters"
              checked={
                typeof password.password === "string" &&
                password.password.trim().length >= 8
              }
              value=""
              fontSize={10}
            />
          </Box>
          <Box sx={{ float: "left" }}>
            <CustomRadio
              disabled
              label="At least 1 symbol"
              checked={
                typeof password.password === "string" &&
                containsSymbol(password.password)
              }
              value=""
              fontSize={10}
            />
          </Box>
          <Box sx={{ float: "left" }}>
            <CustomRadio
              disabled
              label="At least 1 number"
              checked={
                typeof password.password === "string" &&
                containsNumber(password.password)
              }
              value=""
              fontSize={10}
            />
          </Box>
        </Box>
        <InputField
          label="Confirm Password"
          placeholder="Confirm Password"
          value={password.confirmPassword}
          required
          type={showConfirmPassword ? "text" : "password"}
          onChange={(e) => {
            setPassword((prev) => ({
              ...prev,
              confirmPassword: e.target.value,
            }));
          }}
          mt={1}
          rightIcon
          icon={
            !showConfirmPassword ? (
              <AiOutlineEyeInvisible
                color={themeColors.placeholder}
                style={{ width: 24, height: 24 }}
                className="pointer"
                onClick={toggleShowConfirmPassword}
              />
            ) : (
              <AiOutlineEye
                color={themeColors.placeholder}
                style={{ width: 24, height: 24 }}
                className="pointer"
                onClick={toggleShowConfirmPassword}
              />
            )
          }
        />
        <Box mt={"16px"} maxWidth={"300px"}>
          <CustomButton mode="primary" onClick={submit}>
            {loading ? <Spinner color="#fff" /> : "Update"}
          </CustomButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ChangePassword;
