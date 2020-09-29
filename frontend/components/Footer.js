import { useState } from "react";
import Link from "next/link";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faGithub } from "@fortawesome/free-brands-svg-icons";

const links = [
  { route: "/past", description: "Past Events" },
  { route: "/", description: "Home" },
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

export default function Footer() {
  const [showDropdownMenu, toggleDropdownMenu] = useState(false);

  return (
    <footer className="h-20 w-full lg:px-16 px-6 flex flex-wrap items-center bg-white border-b-2 border-gray-300 shadow-sm">
      {/* HOME */}
      <div className="flex-1 flex flex-col justify-start">
        <Link href="/">
          <a className="p-0">
            <span className="font-bold text-md tracking-tight text-blue-400">
              CloudLearning
              <span className="font-bold font-italic text-blue-200">.dev</span>
            </span>
          </a>
        </Link>
        <div className="text-xs text-gray-400">
          Resources for Your Cloud Journey
        </div>
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
                ></a>
              </li>
            </div>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
