// import { Logo } from "./logo";

export const SignInBanner = ({ children }) => {
  return (
    <div className="grid sm:grid-cols-5 grid-cols-1 bg-gradient-to-b from-loginbg-start to-loginbg-end h-screen">
      <div className="sm:col-span-2 col-span-1">
        <div className="font-extrabold font-serif text-3xl pl-6 pt-6 text-primary">
          <img src="/images/logo.png" alt="" className="h-12" />
        </div>
        {children}
      </div>
      <div className="p-4 pl-0  md:h-auto sm:col-span-3 col-span-1 hidden sm:flex justify-center">
        {/* <div
          style={{ backgroundImage: "url('images/login-bg.png')" }}
          className="rounded-3xl h-[96vh] w-full bg-cover"
        ></div> */}
        <img
          src="images/login-bg.png"
          alt=""
          className="rounded-3xl h-[95vh]"
        />
      </div>
    </div>
  );
};
