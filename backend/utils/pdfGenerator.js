const PDFDocument = require("pdfkit");

async function generatePDF(itinerary) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();

    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));

    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });

    doc.on("error", reject);

    // Title
    doc.fontSize(24).text(itinerary.title, {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(14).text(`Destination: ${itinerary.destination}`);
    doc.text(`Traveler: ${itinerary.travelerName || "N/A"}`);
    doc.text(`Dates: ${itinerary.startDate} → ${itinerary.endDate}`);

    doc.moveDown();

    itinerary.days.forEach((day) => {
      doc.fontSize(18).text(`Day ${day.day}: ${day.title}`);

      doc.fontSize(12).text(day.date);

      doc.moveDown(0.5);

      day.activities.forEach((activity) => {
        doc.text(
          `${activity.time || "--"} | ${activity.type} | ${activity.description}`,
        );

        if (activity.location) {
          doc.text(`Location: ${activity.location}`);
        }

        doc.moveDown(0.3);
      });

      if (day.notes) {
        doc.moveDown(0.5);
        doc.text(`Notes: ${day.notes}`);
      }

      doc.moveDown();
    });

    doc.end();
  });
}

module.exports = generatePDF;
