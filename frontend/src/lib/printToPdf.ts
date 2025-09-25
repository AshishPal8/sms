import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const downloadReportAsPDF = async (
  elementRef: React.RefObject<HTMLElement | null>,
  filename: string
) => {
  if (!elementRef.current) {
    console.error("No element found to convert to PDF");
    alert("Unable to find report content to download");
    return;
  }

  try {
    // Create canvas from the HTML element with additional options to handle LAB colors
    const canvas = await html2canvas(elementRef.current, {
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      // Additional options to handle modern CSS colors
      ignoreElements: (element) => {
        // Skip elements that might cause color parsing issues
        const style = window.getComputedStyle(element);
        return style.display === "none" || style.visibility === "hidden";
      },
      onclone: (clonedDoc) => {
        // Fix any LAB color functions in the cloned document
        const styles = clonedDoc.querySelectorAll('[style*="lab("]');
        styles.forEach((el) => {
          const element = el as HTMLElement;
          if (element.style.cssText.includes("lab(")) {
            // Convert LAB colors to fallback colors
            element.style.cssText = element.style.cssText.replace(
              /lab\([^)]+\)/g,
              "#000000"
            );
          }
        });

        // Also check computed styles and convert problematic colors
        const allElements = clonedDoc.querySelectorAll("*");
        allElements.forEach((el) => {
          const element = el as HTMLElement;
          const computedStyle = window.getComputedStyle(element);

          // Check for LAB colors in various properties
          ["color", "backgroundColor", "borderColor"].forEach((prop) => {
            const value = computedStyle.getPropertyValue(prop);
            if (value && value.includes("lab(")) {
              element.style.setProperty(prop, "#000000");
            }
          });
        });
      },
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    // Calculate dimensions to fit A4
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if content is long
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Download the PDF
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF. Please try again.");
  }
};

export const printReportAsPDF = () => {
  const printStyles = `
        @media print {
            body * {
                visibility: hidden;
            }
            .report-container, .report-container * {
                visibility: visible;
            }
            .report-container {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
            }
            .no-print {
                display: none !important;
            }
        }
    `;

  const styleSheet = document.createElement("style");
  styleSheet.innerText = printStyles;
  document.head.appendChild(styleSheet);

  //trigger print dialog
  window.print();

  //cleanup
  setTimeout(() => {
    document.head.removeChild(styleSheet);
  }, 1000);
};

export const generateReportFilename = (reportData: any): string => {
  const timestamp = new Date().toISOString().split("T")[0];

  if (reportData.managers) {
    return `department-report-${timestamp}`;
  } else {
    const name =
      reportData.name?.replace(/\s+/g, "-").toLowerCase() || "employee";
    return `${name}-report-${timestamp}`;
  }
};
