import { triggerToast } from "@/components/atoms/CustomToast";

const useClipboard = () => {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);

      triggerToast("success", "Copied to clipboard", "bottom-center");
    } catch (err) {
      triggerToast("error", "Failed to copy to clipboard");
    }
  };

  return { copyToClipboard };
};

export default useClipboard;
