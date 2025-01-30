import React from "react";
import { TypeAnimation } from "react-type-animation";
import config from "../../config.json";

// import { Logo } from "./logo";

export const SignInBanner = ({ children }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2  h-screen bg-[#f7f6f3]">
      <div className="bg-gray-900 p-4 h-[50vh] md:h-auto">
        {/* <Logo height={50} width={200} /> */}
        <div className="p-4">
          <img src="/images/logo.png" alt="" className="sm:w-36 w-32" />
        </div>
        <div className="h-full flex items-center px-8 md:px-16 -translate-y-16">
          <div className="flex flex-row items-center w-full">
            <div className="font-firaSans  text-white leading-none sm:text-3xl text-xl">
              <p className="py-2 text-sky-600 font-bold sm:text-5xl text-4xl">
                {config.appName},
              </p>
              <TypeAnimation
                deletionSpeed={50}
                speed={20}
                style={{
                  whiteSpace: "pre-line",
                  height: "48px",
                  display: "block",
                }}
                sequence={[`Your Personal AI Assistant.`, 1000, ""]}
                repeat={Infinity}
              />
              {/* <p className="text-lg leading-loose text-white pl-4">BridgeTower GenAI Solutions</p> */}
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};
