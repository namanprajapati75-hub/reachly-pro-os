import { getReportById } from "@/app/actions/reports";
import ReportViewClient from "./ReportViewClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ReportDetailPage({ params }: { params: { id: string } }) {
  const report = await getReportById(params.id);

  if (!report) {
    notFound();
  }

  return <ReportViewClient report={report} />;
}
