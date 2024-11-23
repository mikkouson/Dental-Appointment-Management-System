import React, { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

interface DateRange {
  start: Date | string;
  end: Date | string;
}

const PageExportButton = ({ dateRange }: { dateRange: DateRange }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    setIsLoading(true);

    try {
      // Initialize PDF with A4 dimensions
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margins = 10; // margins in mm

      // Function to capture and add element to PDF
      const captureElement = async (
        element: HTMLElement,
        yPosition: number
      ) => {
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          windowWidth: element.scrollWidth,
          windowHeight: element.scrollHeight,
        });

        const imgData = canvas.toDataURL("image/png");

        // Calculate dimensions to fit within margins
        const availableWidth = pageWidth - 2 * margins;
        const availableHeight = pageHeight - yPosition - margins; // Available height from yPosition to bottom margin

        // Calculate scaled dimensions
        let imgWidth = availableWidth;
        let imgHeight = (canvas.height * imgWidth) / canvas.width;

        // If height exceeds available space, scale down proportionally
        if (imgHeight > availableHeight) {
          imgHeight = availableHeight;
          imgWidth = (canvas.width * imgHeight) / canvas.height;
        }

        // Center the image horizontally
        const xPos = (pageWidth - imgWidth) / 2;

        pdf.addImage(imgData, "PNG", xPos, yPosition, imgWidth, imgHeight);

        // Return the bottom position of this element
        return yPosition + imgHeight;
      };

      // Get elements to export
      const kpiSection = document.querySelector(
        ".grid.gap-4.md\\:grid-cols-2.lg\\:grid-cols-4"
      ) as HTMLElement;
      const revenueSection = document
        .querySelector(".col-span-4 .recharts-responsive-container")
        ?.closest(".col-span-4") as HTMLElement;
      const recentSalesSection = document
        .querySelector(".RecentSales")
        ?.closest("div") as HTMLElement;
      const patientChartSection = document
        .querySelector(".PatientChart")
        ?.closest(".col-span-4") as HTMLElement;
      const pieChartSection = document
        .querySelector(".PieGraph")
        ?.closest(".col-span-4") as HTMLElement;

      // Page 1: Title, Date, KPIs, and Revenue Chart
      // Add title
      pdf.setFontSize(24);
      pdf.setTextColor(0, 0, 0);
      const title = "Dashboard Report";

      const formattedStart = new Date(dateRange.start).toLocaleDateString();
      const formattedEnd = new Date(dateRange.end).toLocaleDateString();

      const dateRangeText = `From: ${formattedStart} To: ${formattedEnd}`;
      let currentY = pageHeight / 4;
      pdf.text(title, pageWidth / 2, currentY, { align: "center" });

      pdf.setFontSize(14);
      currentY += 10;
      pdf.text(dateRangeText, pageWidth / 2, currentY, { align: "center" });

      // Add KPI section
      if (kpiSection) {
        currentY += 20;
        pdf.setFontSize(16);
        pdf.text("Key Performance Indicators", margins, currentY);
        currentY += 10;
        currentY = await captureElement(kpiSection, currentY);
      }

      // Add Revenue Graph
      if (revenueSection) {
        currentY += 10;
        pdf.setFontSize(16);
        pdf.text("Revenue Analysis", margins, currentY);
        currentY += 10;
        await captureElement(revenueSection, currentY);
      }

      // Page 2: Remaining charts
      pdf.addPage();
      currentY = margins + 5;

      // Add Recent Sales
      if (recentSalesSection) {
        pdf.setFontSize(16);
        pdf.text("Low Stocks Item", margins, currentY);
        currentY += 10;
        currentY = await captureElement(recentSalesSection, currentY);
      }

      // Add Patient Chart
      if (patientChartSection) {
        currentY += 10;
        pdf.setFontSize(16);
        pdf.text("Patient Statistics", margins, currentY);
        currentY += 10;
        currentY = await captureElement(patientChartSection, currentY);
      }

      // Page 2: Remaining charts
      pdf.addPage();
      currentY = margins + 5;

      // Add Pie Graph
      if (pieChartSection) {
        currentY += 10;
        pdf.setFontSize(16);
        pdf.text("Distribution Analysis", margins, currentY);
        currentY += 10;
        await captureElement(pieChartSection, currentY);
      }

      // Save the PDF
      const dateStr = new Date().toISOString().split("T")[0];
      pdf.save(`dashboard-report-${dateStr}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      className="flex items-center gap-2"
      disabled={isLoading}
      size="sm"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      <span className="hidden md:block">
        {isLoading ? "Downloading Report..." : "Download Report"}
      </span>
    </Button>
  );
};

export default PageExportButton;
