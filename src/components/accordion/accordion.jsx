import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

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
              <div className="mb-4 p-3 bg-background rounded-md shadow-inner ">
                <div className="flex items-start gap-2">
                  <div className="text-xs font-semibold text-gray-600 whitespace-nowrap">
                    Meta URI:
                  </div>
                  <Tooltip>
                    <TooltipTrigger className="overflow-hidden">
                      <a
                        href={item.uri}
                        className="text-xs text-blue-500 hover:text-blue-700 hover:underline  truncate block"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.uri}
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>{item.uri}</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              {/* <p className="font-normal break-words">{item.content}</p> */}
              <ExpandableParagraphList paragraphs={[item.text]} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ExpandableParagraphList = ({ paragraphs }) => {
  const [expandedIndexes, setExpandedIndexes] = useState({});
  const [shouldShowButtons, setShouldShowButtons] = useState({});

  useEffect(() => {
    const newShouldShowButtons = {};
    paragraphs.forEach((_, index) => {
      const paraRef = document.getElementById(`paragraph-${index}`);
      if (paraRef) {
        const lineHeight = parseFloat(getComputedStyle(paraRef).lineHeight);
        const maxHeight = 5 * lineHeight; // 5 lines
        if (paraRef.scrollHeight > maxHeight) {
          newShouldShowButtons[index] = true;
        }
      }
    });
    setShouldShowButtons(newShouldShowButtons);
  }, [paragraphs]);

  const toggleExpand = (index) => {
    setExpandedIndexes((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="space-y-6">
      {paragraphs.map((text, index) => (
        <div key={index} className="relative w-full">
          <p
            id={`paragraph-${index}`}
            className={`text-card-foreground ${
              expandedIndexes[index] ? "line-clamp-none" : "line-clamp-5"
            } overflow-hidden transition-all`}
            style={
              !expandedIndexes[index]
                ? {
                    display: "-webkit-box",
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: "vertical",
                  }
                : {}
            }
          >
            {text}
          </p>
          {shouldShowButtons[index] && (
            <div className="flex justify-end">
              <button
                onClick={() => toggleExpand(index)}
                className="mt-2 text-blue-500 hover:underline flex items-center gap-1"
              >
                {expandedIndexes[index] ? "View Less" : "View More"}
                {expandedIndexes[index] ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Accordion;
