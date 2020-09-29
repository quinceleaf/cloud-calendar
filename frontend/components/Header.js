import { useState } from "react";
import Link from "next/link";

import { SiGithub } from "react-icons/si";

const links = [
  { route: "/events", description: "Events" },
  { route: "/tags", description: "Tags" },
  { route: "/organizations", description: "Organizations" },
];

const renderLinks = () => {
  return links.map((link) => {
    return (
      <li key={link.description} className="navlink">
        <Link href={link.route}>
          <a className="inline-block pr-6 lg:pb-0 pb-3 text-lg text-gray-500 hover:text-blue-400">
            {link.description}
          </a>
        </Link>
      </li>
    );
  });
};

export default function Header() {
  const [showDropdownMenu, toggleDropdownMenu] = useState(false);

  return (
    <header
      className={`${
        showDropdownMenu
          ? "h-auto w-full z-10 lg:px-16 px-6 py-3 flex flex-wrap items-center bg-white border-b-2 border-gray-300 shadow-sm bounce"
          : "h-20 w-full z-10 lg:px-16 px-6 flex flex-wrap items-center bg-white border-b-2 border-gray-300 shadow-sm"
      }}`}
    >
      {/* HOME */}
      <div className="flex-1 flex flex-col justify-start">
        <Link href="/">
          <a className="p-0">
            <span className="font-bold text-2xl tracking-tight text-blue-500">
              CloudLearning
              <span className="font-bold font-italic text-blue-300">.dev</span>
            </span>
          </a>
        </Link>
        <div className="text-xs text-gray-500">
          Resources for Your Cloud Journey
        </div>
      </div>

      {/* TOGGLE MENU */}
      <div
        onClick={() => toggleDropdownMenu(!showDropdownMenu)}
        className=" lg:hidden block"
      >
        <svg
          className="fill-current text-gray-500 hover:text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
        >
          <title>menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
        </svg>
      </div>

      {/* BLOG CONTENT LINKS */}
      <div
        className={`${
          showDropdownMenu
            ? "block lg:flex lg:items-center lg:w-auto w-full flex-grow"
            : "hidden lg:flex lg:items-center lg:w-auto w-full flex-grow"
        }}`}
      >
        <nav>
          <ul className="lg:flex items-center justify-between text-base text-gray-700 pt-4 lg:pt-0 navlist">
            {renderLinks()}

            {/* SOCIAL MEDIA LINKS */}
            <div className="flex flex-row">
              <li className="navlink">
                <a
                  className="inline-block pr-6 lg:pb-0 pb-3 text-2xl text-gray-500 hover:text-blue-400"
                  href="https://github.com/quinceleaf/cloud-calendar"
                >
                  <SiGithub />
                </a>
              </li>
            </div>
          </ul>
        </nav>
      </div>
    </header>
  );
}
