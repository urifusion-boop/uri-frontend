import { z } from "zod";

const FileSchema = z.object({
  docName: z.string().min(1),
  docType: z.string().min(1),
  publicId: z.string().min(1),
  url: z.string().min(1),
});

export default FileSchema;
