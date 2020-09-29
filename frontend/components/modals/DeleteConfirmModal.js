import React from "react";
import { ModalWrapper, Reoverlay } from "reoverlay";

import { CustomButton } from "../common";

const DeleteConfirmModal = ({ item, itemType, onDelete }) => {
  const closeModal = () => {
    Reoverlay.hideModal();
  };

  return (
    <ModalWrapper contentContainerClassName="mx-10">
      <div className="m-5 mx-10">
        <div className="flex flex-col">
          <div className="mb-3 text-gray-500">
            <span>
              Are you sure you want to delete {itemType}{" "}
              <span className="text-blue-500 font-semibold">{item.name}</span>?
            </span>
          </div>
          <div className="flex flex-row justify-center">
            <CustomButton onClick={onDelete} text="Delete" />
            <CustomButton onClick={closeModal} text="Cancel" />
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default DeleteConfirmModal;
