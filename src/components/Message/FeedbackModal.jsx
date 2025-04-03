import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";

const FeedbackModal = ({
  isOpen,
  onClose,
  onSubmit,
  helpText = "",
  feedbackType = "feedback",
  placeholderText = "Please provide some more details about the issue.",
}) => {
  const [selectedIssue, setSelectedIssue] = useState("");
  const [details, setDetails] = useState("");
  const [errors, setErrors] = useState({ type: "", details: "" });
  const [submitting, setSubmitting] = useState(false);
  const [issues, setIssues] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedIssue && details) {
      setSubmitting(true);
      onSubmit({ type: selectedIssue, details }).then(() => {
        setSubmitting(false);
        setSelectedIssue("");
        setDetails("");
        onClose();
      });
    } else {
      setErrors({
        type: !selectedIssue ? "Select issue type!" : "",
        details: !details ? "Enter some feedback text!" : "",
      });
    }
  };

  const responseIssues = [
    { value: "ui_bug", label: "UI bug" },
    { value: "harmful_content", label: "Harmful content" },
    { value: "overactive_refusal", label: "Overactive refusal" },
    { value: "incomplete_request", label: "Did not fully follow my request" },
    { value: "incorrect", label: "Not factually correct" },
    { value: "incomplete_response", label: "Incomplete response" },
    { value: "other", label: "Other" },
  ];
  const generalIssues = [
    { value: "application_error", label: "Application error" },
    { value: "server_error/availability", label: "Server Error/Availability" },
    { value: "response_time", label: "Response time" },
    { value: "authorization", label: "Authorization" },
    { value: "other", label: "Other" },
  ];
  useEffect(() => {
    if (feedbackType === "app") {
      setIssues(generalIssues);
    } else {
      setIssues(responseIssues);
    }
  }, []);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black text-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[var(--background)] rounded-2xl p-6 max-w-lg w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[var(--text)]">
            {feedbackType === "app" ? "Help desk" : "Feedback"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[var(--text)] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[var(--subText)] mb-2">
              What type of issue do you wish to report?
            </label>
            <select
              value={selectedIssue}
              onChange={(e) => {
                setSelectedIssue(e.target.value);
                setErrors({
                  type: !e.target.value ? "Select issue type!" : "",
                  details: !details ? "Enter some feedback text!" : "",
                });
              }}
              className={`w-full bg-[var(--background)] text-[var(--subText)] rounded-md p-2 border ${
                errors.type ? "border-red-500" : " border-gray-700"
              }`}
            >
              <option value="">Select...</option>
              {issues.map((issue) => (
                <option key={issue.value} value={issue.value}>
                  {issue.label}
                </option>
              ))}
            </select>
            <div className="text-red-500"> {errors.type}</div>
          </div>

          <div className="mb-6">
            <label className="block text-[var(--subText)] mb-2">
              Please provide details
            </label>
            <textarea
              value={details}
              onChange={(e) => {
                setDetails(e.target.value);
                setErrors({
                  type: !selectedIssue ? "Select issue type!" : "",
                  details: !e.target.value ? "Enter some feedback text!" : "",
                });
              }}
              className={`w-full bg-[var(--background)] text-[var(--subText)] rounded-md p-2 border ${
                errors.details ? "border-red-500" : " border-gray-700"
              } min-h-[100px]`}
              placeholder={placeholderText}
            />
            <div className="text-red-500"> {errors.details}</div>
          </div>

          <div className="text-[var(--subText)] mb-4">
            {helpText}
            {/* <a href="#" className="text-blue-400 hover:underline">
              Learn More
            </a> */}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[var(--subText)] hover:bg-gray-800  hover:text-white rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#04ADEF] text-white rounded-md transition-colors flex items-center gap-1"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
