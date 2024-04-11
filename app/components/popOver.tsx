import React, { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";

interface PopoverProps {
  content: JSX.Element;
}

const Popover: React.FC<PopoverProps> = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const togglePopover = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        isOpen 
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);


  return (
    <div className="relative inline-block">
      <button
        onClick={()=>{togglePopover(); setShowResults(true)}}
      >
        <BsThreeDots color="gray" size='20' />
      </button>

      {isOpen&&showResults && (
        <div className="absolute z-10 left-0  p-2 bg-primary text-red-600  border-gray-300 rounded-md shadow-lg">
          {content}
        </div>
      )}
    </div>
  );
};

export default Popover;
