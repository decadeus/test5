const Disabled = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      style={{ width: "100%", height: "100%" }}
    >
      {/* <rect x="0" y="0" width="100" height="100" fill="none" stroke="black" strokeWidth="1" /> */}
      <g transform="translate(10, 0)">
        <circle cx="35" cy="20" r="7" fill="white" stroke="black" strokeWidth="3" />
        <line x1="35" y1="27" x2="35" y2="50" stroke="black" strokeWidth="3" />
        <line x1="35" y1="32" x2="50" y2="45" stroke="black" strokeWidth="3" />
        <line x1="35" y1="50" x2="55" y2="50" stroke="black" strokeWidth="3" />
        <line x1="55" y1="50" x2="55" y2="65" stroke="black" strokeWidth="3" />
        <circle cx="38" cy="54" r="14" fill="white" stroke="black" strokeWidth="3" />
      </g>
      {/* <text x="30" y="95" fontSize="10" fill="black">Disabled</text> */}
    </svg>
  );
};

export default Disabled;
