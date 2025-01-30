import React from "react";

const FullScreenLogoLoader = () => {
  return (
    <div className="fixed inset-0 bg-white/80 bg-opacity-75 flex justify-center items-center z-50">
      <div className="animate-zoom">
        <img src="/images/logo.png" alt="Logo" className="animate-pulse w-40" />
      </div>
    </div>
  );
};

export default FullScreenLogoLoader;
