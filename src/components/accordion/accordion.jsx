import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const Accordion = ({ accordionData = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleAccordion = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null); // Collapse if the same index is clicked again
    } else {
      setActiveIndex(index); // Expand the clicked accordion item
    }
  };

  return (
    <div className="w-full mx-auto space-y-4 overflow-auto h-[90vh] pr-4 sidemenu-scrollbar">
      {accordionData.map((item, index) => (
        <div
          key={index}
          className="rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <button
            onClick={() => toggleAccordion(index)}
            className={`w-full border rounded-lg flex justify-between items-center p-4 text-left text-card-foreground hover:bg-background transition-colors duration-200 focus:outline-none ${
              activeIndex === index ? "bg-background" : "bg-card"
            }`}
            aria-expanded={activeIndex === index}
            aria-controls={`accordion-content-${index}`}
          >
            <span className="text-sm font-semibold text-secondary-foreground max-w-[95%]">
              {item.uri?.split("/")[item.uri?.split("/").length - 1]}
            </span>
            {activeIndex === index ? (
              <ChevronUp className="w-4 h-4 " />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          <div
            id={`accordion-content-${index}`}
            role="region"
            aria-labelledby={`accordion-header-${index}`}
            className={`overflow-y-auto scrollable-thin transition-all duration-300 ease-in-out sidemenu-scrollbar ${
              activeIndex === index
                ? " border-r border-l border-b rounded"
                : "max-h-0"
            }`}
          >
            <div className="p-4 text-sm text-card-foreground">
              <p className="font-normal">{item.text}</p>

              <div className="mt-4 p-3 bg-gray-50 rounded-md shadow-inner">
                <div className="flex items-start gap-2">
                  <span className="text-xs font-semibold text-gray-600">
                    Meta URI:
                  </span>
                  <a
                    href={item.uri}
                    className="text-xs text-blue-500 hover:text-blue-700 hover:underline break-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.uri}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
