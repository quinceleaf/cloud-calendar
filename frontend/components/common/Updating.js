import React from "react";

import { MdAutorenew } from "react-icons/md";

const Updating = () => {
  return (
    <div className="flex flex-row text-blue-200 text-sm">
      <div className="mt-1">
        <MdAutorenew />
      </div>
      <div>Updating</div>
    </div>
  );
};

export default Updating;
