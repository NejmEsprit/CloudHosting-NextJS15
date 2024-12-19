"use client";
import Link from "next/link";
import { GrTechnology } from "react-icons/gr";
import module from "./header.module.css";
import { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { IoIosClose } from "react-icons/io";

interface NavbarProps {
  isAdmin: boolean;
}

const Navbar = ({ isAdmin }: NavbarProps) => {
  const [toggle, setToggle] = useState(false);
  return (
    <nav className={module.navbar}>
      <div className="">
        <Link href="/" className={module.logo}>
          CLOUD
          <GrTechnology />
          HOSTING
        </Link>
        <div className={module.menu}>
          {toggle ? (
            <IoIosClose onClick={() => setToggle((prev) => !prev)} />
          ) : (
            <AiOutlineMenu onClick={() => setToggle((prev) => !prev)} />
          )}
        </div>
      </div>
      <div
        className={module.navLinksWrapper}
        style={{
          clipPath:
            (toggle && "polygon(0 0, 100% 1%, 100% 100%, 0 100%)") || "",
        }}
      >
        <ul className={module.navLinks}>
          <Link
            onClick={() => setToggle(false)}
            className={module.navLink}
            href="/"
          >
            Home
          </Link>
          <Link
            onClick={() => setToggle(false)}
            className={module.navLink}
            href="/articles?pageNumber=1"
          >
            Articles
          </Link>
          <Link
            onClick={() => setToggle(false)}
            className={module.navLink}
            href="/about"
          >
            About
          </Link>
          {isAdmin && (
            <Link
              onClick={() => setToggle(false)}
              className={module.navLink}
              href="/admin"
            >
              Admin Dashboard
            </Link>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
