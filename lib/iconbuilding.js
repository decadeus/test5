// projectIcons.js
import { IoGameControllerOutline } from "react-icons/io5";
import { PiPersonSimpleSwimDuotone } from "react-icons/pi";
import { IoIosFitness } from "react-icons/io";
import { BiHandicap } from "react-icons/bi";
import { MdOutlineDirectionsBike } from "react-icons/md";
import { BiCctv } from "react-icons/bi";
import { BiDoorOpen } from "react-icons/bi";

// Array of project icons and their labels
export const projectIcons = [
  { key: "swim", icon: PiPersonSimpleSwimDuotone, label: "Swim" },
  { key: "child", icon: IoGameControllerOutline, label: "Child" },
  { key: "fitness", icon: IoIosFitness, label: "Fitness" },
  { key: "disabled", icon: BiHandicap, label: "Disabled" },
  { key: "bike", icon: MdOutlineDirectionsBike, label: "Bike" },
  { key: "cctv", icon: BiCctv, label: "CCTV" },
  { key: "entrance", icon: BiDoorOpen, label: "Entrance" },
];
