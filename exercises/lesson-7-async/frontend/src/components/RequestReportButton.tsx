import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";

const REQUEST_REPORT_MUTATION = gql`
  mutation RequestReport($startDate: String, $endDate: String) {
    requestExpenseReport(startDate: $startDate, endDate: $endDate) {
      reportId
      status
    }
  }
`;

interface RequestReportData {
  requestExpenseReport : {
    reportId : number,
    status : string
  }
}

export function RequestReportButton() {
  const [requestReport, { loading }] = useMutation(REQUEST_REPORT_MUTATION);

  const handleRequest = async () => {
    try {
      const { data } = await requestReport({
        variables: {
          // Optional: specify date range
          // startDate: new Date('2025-01-01'),
          // endDate: new Date('2025-12-31'),
        },
      });


      toast.success("Report generation started!", {
        description: `Report ID: ${(data as RequestReportData).requestExpenseReport.reportId}`,
      });
    } catch (error) {
      toast.error("Failed to request report");
      console.error(error);
    }
  };

  return (
    <button
      onClick={handleRequest}
      disabled={loading}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
    >
      {loading ? "Requesting..." : "Generate PDF Report"}
    </button>
  );
}
