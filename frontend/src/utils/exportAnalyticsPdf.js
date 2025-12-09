import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

export default async function exportAnalyticsPdfFromElement({
	element,
	view,
	sprint,
}) {
	if (!element) return;

	const doc = new jsPDF("p", "mm", "a4");

	const title =
		view === "global"
			? "Global Analytics Report"
			: `Sprint Analytics Report (${
					sprint?.name || sprint?._id || "Unknown sprint"
			  })`;

	// Header
	doc.setFontSize(16);
	doc.text(title, 10, 15);

	doc.setFontSize(11);
	doc.text(`Mode: ${view === "global" ? "Global" : "Sprint"}`, 10, 23);

	if (view === "sprint" && sprint) {
		doc.text(`Sprint: ${sprint.name}`, 10, 30);
	}

	// ---- capture charts as an image ----
	// html2canvas-pro has the same API as html2canvas
	const canvas = await html2canvas(element, {
		scale: 2,
		useCORS: true,
		logging: false,
	});

	const imgData = canvas.toDataURL("image/png");
	const imgProps = doc.getImageProperties(imgData);

	const pageWidth = doc.internal.pageSize.getWidth();
	const pageHeight = doc.internal.pageSize.getHeight();

	const marginX = 10;
	const marginTop = 35;
	const availableWidth = pageWidth - marginX * 2;
	const imgHeight = (imgProps.height * availableWidth) / imgProps.width;

	let renderHeight = imgHeight;
	if (imgHeight > pageHeight - marginTop - 10) {
		renderHeight = pageHeight - marginTop - 10;
	}

	doc.addImage(
		imgData,
		"PNG",
		marginX,
		marginTop,
		availableWidth,
		renderHeight
	);

	const fileName =
		view === "global"
			? "analytics-global.pdf"
			: `analytics-sprint-${(sprint?.name || sprint?._id || "unknown")
					.toString()
					.replace(/\s+/g, "-")
					.toLowerCase()}.pdf`;

	doc.save(fileName);
}
