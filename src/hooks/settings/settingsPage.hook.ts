import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { UserService } from "@/api/UserService";
import { CreativeProfileService } from "@/api/CreativeProfileService";
import { CreativeProfileDto } from "../../models/dtos/CreativeProfileDto";
import { UserDto } from "../../models/dtos/UserDto";
import { useQuery } from "@tanstack/react-query";

const tabButtons: any = [
  {
    label: "Change Password",
    value: "changePassword",
  },
  {
    label: "Delete Account",
    value: "deleteAccount",
  },
];

export const useSettingsPageHook = () => {
  const router = useRouter();
  const { userDetails, userProfile } = useAuth();
  const [modalState, setModalState] = useState("AddNote");
  const [creativeProfile, setCreativeProfile] = useState<CreativeProfileDto>(
    {} as CreativeProfileDto
  );
  const [activeTab, setActiveTab] = useState("changePassword");
  const [editProfile, setEditProfile] = useState(false);
  const [loaded] = useState(false);

  const navigate = useCallback(
    (route: string) => {
      router.push(route);
    },
    [router]
  );

  const { data: creativeData } = useQuery({
    queryKey: ["creative-data", userDetails, userProfile, router.query.id],
    queryFn: async () => {
      const id = String(router.query.id ?? "");
      if (id) {
        const result = await UserService.getByUserIdApi(id);
        if (result.status) {
          const profile =
            await CreativeProfileService.getProfileByUserIdApi(id);
          if (profile.status)
            setCreativeProfile(profile.responseData as CreativeProfileDto);

          return result.responseData as UserDto;
        }
        if (result.status) return result.responseData;
        else return null;
      } else {
        setCreativeProfile(userProfile);
        return userDetails;
      }
    },
    enabled: !!userDetails?.userId,
  });
  return {
    navigate,
    loaded,
    creativeData,
    creativeProfile,
    setCreativeProfile,
    tabButtons,
    activeTab,
    setActiveTab,
    modalState,
    setModalState,
    editProfile,
    setEditProfile,
  };
};
