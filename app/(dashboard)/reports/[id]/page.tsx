import { getReportById } from "@/app/actions/reports";
import ReportViewClient from "./ReportViewClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = await getReportById(id);

  if (!report) {
    notFound();
  }

  return <ReportViewClient report={report} />;
}
