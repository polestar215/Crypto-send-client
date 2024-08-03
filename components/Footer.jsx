import Image from "next/image";
import logo from "../public/assets/logo.png";
import Link from "next/link";
function Footer() {
  return (
    <div className="w-full flex md:justify-center justify-between items-center flex-col p-4 gradient-bg-footer">
      <div className="sm:w-[90%] w-full flex sm:flex-row flex-col justify-between items-center my-4">
        <div className="relative w-[50px] h-[50px] justify-center items-center">
          <Image
            src={logo}
            alt="logo"
            layout="responsive"
            width={40}
            height={40}
          />
        </div>
        <div className="flex  flex-1 justify-evenly items-center flex-wrap sm:mt-0 mt-5 w-full">
          <p className="text-white text-base text-center mx-2 cursor-pointer">
            <Link href="https://www.github.com/Mousticke" passHref={true}>
              <a
                rel="noopener noreferrer"
                target="_blank"
                aria-label="Mousticke"
              >
                Mousticke
              </a>
            </Link>
          </p>
          <p className="text-white text-base text-center mx-2 cursor-pointer">
            <Link
              href="https://www.github.com/Mousticke/crypto-sender-client"
              passHref={true}
            >
              <a
                rel="noopener noreferrer"
                target="_blank"
                aria-label="Github client"
              >
                Github client
              </a>
            </Link>
          </p>
          <p className="text-white text-base text-center mx-2 cursor-pointer">
            <Link
              href="https://www.github.com/Mousticke/crypto-sender-smartcontract"
              passHref={true}
            >
              <a
                rel="noopener noreferrer"
                target="_blank"
                aria-label="Smart Contract Repo"
              >
                Smart Contract Repo
              </a>
            </Link>
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center flex-col mt-4">
        <p className="text-white text-sm text-center">Come Join Us</p>
        <p className="text-white text-sm text-center">mousticke@krypto.com</p>
      </div>
      <div className="sm:w-[90%] w-full h-[0.25px] bg-gray-500 mt-5" />
      <div className="sm:w-[90%] w-full flex justify-between items-center mt-3">
        <p className="text-white text-sm text-center">@Mousticke 2022</p>
        <p className="text-white text-sm text-center">All rights reserved</p>
      </div>
    </div>
  );
}

export default Footer;
