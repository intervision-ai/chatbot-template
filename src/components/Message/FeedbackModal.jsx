import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

const FeedbackModal = ({
  isOpen,
  onClose,
  onSubmit,
  helpText = "",
  placeholderText = "Please provide some more details about the issue.",
}) => {
  const [selectedIssue, setSelectedIssue] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ type: selectedIssue, details });
    setSelectedIssue("");
    setDetails("");
    onClose();
  };

  const issues = [
    { value: "ui_bug", label: "UI bug" },
    { value: "harmful_content", label: "Harmful content" },
    { value: "overactive_refusal", label: "Overactive refusal" },
    { value: "incomplete_request", label: "Did not fully follow my request" },
    { value: "incorrect", label: "Not factually correct" },
    { value: "incomplete_response", label: "Incomplete response" },
    { value: "other", label: "Other" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black text-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card rounded-3xl p-6 max-w-lg w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[var(--text)]">Feedback</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[var(--text)] transition-colors"
          >
            <X size={20} className="text-primary" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[var(--subText)] mb-2">
              What type of issue do you wish to report? (optional)
            </label>
            <select
              value={selectedIssue}
              onChange={(e) => setSelectedIssue(e.target.value)}
              className="w-full bg-background text-[var(--subText)] rounded-xl p-4"
            >
              <option value="">Select...</option>
              {issues.map((issue) => (
                <option key={issue.value} value={issue.value}>
                  {issue.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-[var(--subText)] mb-2">
              Please provide details: (optional)
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full bg-background text-[var(--subText)] rounded-xl p-4  min-h-[100px]"
              placeholder={placeholderText}
            />
          </div>

          <div className="text-[var(--subText)] mb-4">
            {helpText}
            {/* <a href="#" className="text-blue-400 hover:underline">
              Learn More
            </a> */}
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant={"outline"}
              onClick={onClose}
              className="px-4 py-2 text-[var(--subText)] hover:bg-gray-800  hover:text-white rounded-md transition-colors"
            >
              Cancel
            </Button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
