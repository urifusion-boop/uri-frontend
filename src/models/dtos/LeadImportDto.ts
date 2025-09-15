import { ImportTypeEnum } from '../enum-models/ImportTypeEnum';

export interface LeadImportDto {
  formData: FormData;
  userId: string;
}

export interface ImportedLeadsDto {
  importId: string;
  importTitle: string;
  importType: ImportTypeEnum;
  importStatus: string;
  importProgress: number;
  importCreatedAt: string;
  importUpdatedAt: string;
}

export interface LeadImportResponseDto {
  data: ImportedLeadsDto;
  total: number;
  page: number;
  per_page: number;
}

export interface LeadImportConfirmDto {
  userId: string;
  approvalChoice: string;
  importType: ImportTypeEnum;
}

export interface LeadImportStatusDto {
  progress: number;
  status: string;
}
