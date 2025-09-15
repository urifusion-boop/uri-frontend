import { LeadStatusEnum } from "@/models/enum-models/LeadStatusEnum";

export class StatusColorHelper {
  static getInterestLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  static getStatusColor = (status: string) => {
    switch (status) {
      case LeadStatusEnum.NEW:
        return "bg-blue-100 text-blue-800";
      case LeadStatusEnum.CONTACTED:
        return "bg-purple-100 text-purple-800";
      case LeadStatusEnum.QUALIFIED:
        return "bg-green-100 text-green-800";
      case LeadStatusEnum.UNQUALIFIED:
        return "bg-red-100 text-red-800";
      case LeadStatusEnum.CONVERTED:
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
}
