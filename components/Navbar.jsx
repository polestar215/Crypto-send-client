import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import logo from "../public/assets/logo.png";
import Image from "next/image";
import { TransactionContext } from "../context/TransactionContext";
import React, { useContext } from "react";

const NavBarItem = ({ title, classProps }) => {
  return <li className={`mx-4 cursor-pointer ${classProps}`}>{title}</li>;
};

function Navbar() {
  const [toggleMenu, setToggleMenu] = React.useState(false);
  const { currentAccount, connectWallet } = useContext(TransactionContext);

  return (
    <nav className="w-full flex justify-around items-center p-4">
      <div className="relative max-w-[50px] md:flex-[0.5] flex-initial justify-center items-center">
        <Image
          src={logo}
          alt="logo"
          layout="responsive"
          width={40}
          height={40}
          className="cursor-pointer"
        />
      </div>
      <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
        {currentAccount ? (
          <li>Connected : {currentAccount}</li>
        ) : (
          <li
            onClick={connectWallet}
            className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]"
          >
            Connect Wallet
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
