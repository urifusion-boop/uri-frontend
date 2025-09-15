import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa6";
import { useEffect, useState } from "react";

import { KeywordTrackerService } from "../../api/KeywordTrackerService";
import { TrackerDto } from "../../models/dtos/TrackerDto";
import toast from "react-hot-toast";
import { useAuth } from "../../providers/AuthProvider";
import { useRouter } from "next/router";

export const useTrackerName = (trackerType: string, currentTracker: TrackerDto | null, setCurrentTracker: (tracker: TrackerDto) => void) => {
  const { pathname, query, push, reload } = useRouter();

  const { userDetails } = useAuth();

  const [open, setOpen] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTracker, setSelectedTracker] = useState(query.trackerId);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [selectedCountries, setSelectedCountries] = useState<{ code: string; label: string }[]>([]);
  const [keywords, setKeywords] = useState<string[]>(["keyword 1", "keyword 2", "keyword 3"]);

  const [openNewTracker, setOpenNewTracker] = useState(false);
  const [newTracker, setNewTracker] = useState<TrackerDto>({
    keywords: [""],
    excluded: [],
  } as TrackerDto);

  const [openUpdateTracker, setOpenUpdateTracker] = useState(false);
  const [updatedTracker, setUpdatedTracker] = useState(currentTracker);

  const addKeyword = () => setKeywords((prev) => [...prev, ""]);

  const deleteKeyword = (index: number) => setKeywords((prev) => prev.filter((_, i) => i !== index));

  const platforms = [
    { name: "Facebook", icon: FaFacebook },
    { name: "Twitter", icon: FaTwitter },
    { name: "Instagram", icon: FaInstagram },
    { name: "LinkedIn", icon: FaLinkedin },
    { name: "YouTube", icon: FaYoutube },
  ];

  const trackers = [
    { id: 0, name: "My Tracker" },
    { id: 12, name: "Your Tracker" },
    { id: 14, name: "Our Tracker" },
    { id: 91, name: "Their Tracker" },
    { id: 18, name: "The Tracker" },
  ];

  const paths = pathname.split("/");

  const trackerSectionName = paths[paths.length - 1];

  const trackerName = trackers.find((tracker) => tracker.id === Number(query.trackerId))?.name;

  useEffect(() => {
    if (!currentTracker) return;
    setUpdatedTracker(currentTracker);
  }, [currentTracker]);

  const updateTracker = async () => {
    if (!updatedTracker) return;

    const response = await KeywordTrackerService.updateTrackerApi({
      ...updatedTracker,
    });

    if (response.status) {
      toast.success("Tracker updated successfully.");
      setCurrentTracker(updatedTracker);
    } else toast.error(response.responseMessage);
  };

  const createTracker = async () => {
    const response = await KeywordTrackerService.createTrackerApi({
      user_id: userDetails?.userId,
      name: newTracker.name,
      keywords: newTracker.keywords,
      platforms: newTracker.platforms,
      tracker_type: trackerType,
      locations: newTracker.locations,
    });

    if (response.status) {
      toast.success("Tracker created successfully.");

      const trackerData = response.responseData;
      push(`/tracker/${trackerData?.tracker_id}/overview`);

      setNewTracker({
        keywords: [""],
      } as TrackerDto);
    } else toast.error(response.responseMessage);
  };

  return {
    open,
    setOpen,
    openDialog,
    setOpenDialog,
    selectedTracker,
    setSelectedTracker,
    selectedPlatform,
    setSelectedPlatform,
    selectedCountries,
    setSelectedCountries,
    keywords,
    setKeywords,
    addKeyword,
    deleteKeyword,
    platforms,
    trackers,
    trackerName,
    push,
    trackerSectionName,

    openNewTracker,
    setOpenNewTracker,
    openUpdateTracker,
    setOpenUpdateTracker,
    newTracker,
    setNewTracker,
    updatedTracker,
    setUpdatedTracker,
    createTracker,
    updateTracker,
  };
};
