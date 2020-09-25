import React, { useContext, useState } from "react";
import Select from "react-select";
import { ModalWrapper, Reoverlay } from "reoverlay";
import tzIds from "tz-ids";

import { TimezoneContext } from "../../context";
import { CustomButton } from "../common";

const timezoneOptions = (arr) => {
  const options = [];
  arr.map((str) => options.push({ label: str, value: str }));
  return options;
};

const renderSelect = (currentTimezone, options, setTempTimezone) => {
  const handleChange = (option) => {
    option !== null ? setTempTimezone(option.value) : setTempTimezone("");
  };

  return (
    <Select
      id="timezone"
      name="timezone"
      //value={options.find((option) => option.value === item)}
      onChange={handleChange}
      options={options}
      closeMenuOnSelect={true}
      placeholder={"Select a timezone"}
      defaultValue={
        currentTimezone
          ? options.find((option) => option.value === currentTimezone)
          : ""
      }
      //styles={styles}
      isClearable={true}
      //error={form.errors[field.name]}
    />
  );
};

const SetTimezoneModal = () => {
  const [tempTimezone, setTempTimezone] = useState("");
  const { displayTimezone, setDisplayTimezone } = useContext(TimezoneContext);

  const closeModal = () => {
    Reoverlay.hideModal();
  };

  const setTimezone = () => {
    setDisplayTimezone(tempTimezone);
    Reoverlay.hideModal();
  };

  return (
    <ModalWrapper contentContainerClassName="mx-10">
      <div className="m-5 mx-10">
        <div className="flex flex-col">
          <div className="mb-3 text-gray-500">
            <p className="mb-3">
              The Earth is round – don't struggle to figure out if you'll be
              awake, in class or at work when an event airs!
            </p>
            <p>
              Select your local timezone and all event date/times will be
              displayed correctly for you
            </p>
          </div>
          <div className="mb-3">
            {renderSelect(
              displayTimezone,
              timezoneOptions(tzIds),
              setTempTimezone
            )}
          </div>
          <div className="flex flex-row justify-center">
            <CustomButton onClick={setTimezone} text="Set Timezone" />
            <CustomButton onClick={closeModal} text="Cancel" />
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default SetTimezoneModal;
