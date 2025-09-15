import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface DownloadPDFOptions {
  element: HTMLElement;
  fileName?: string;
  scale?: number;
  paddingY?: number;
  imageWidth?: number;
}

export class PDFHelper {
  static async downloadElementAsPDF(
    options: DownloadPDFOptions
  ): Promise<void> {
    const {
      element,
      fileName = "document.pdf",
      scale = 2,
      paddingY = 20,
      imageWidth = 170,
    } = options;

    try {
      const canvas = await html2canvas(element, {
        scale,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgHeight = (canvas.height * imageWidth) / canvas.width;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const x = (pageWidth - imageWidth) / 2;

      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        x,
        paddingY,
        imageWidth,
        imgHeight
      );

      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw new Error("Failed to download PDF.");
    }
  }
}
