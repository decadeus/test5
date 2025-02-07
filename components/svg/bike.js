const Bike = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      style={{ width: "100%", height: "100%" }}
    >
      <rect width="100" height="100" fill="white" />
      <rect x="0" y="0" width="100" height="100" fill="none" stroke="black" strokeWidth="1" />
      <circle cx="35" cy="64" r="10" fill="white" stroke="black" strokeWidth="3" />
      <circle cx="65" cy="64" r="10" fill="white" stroke="black" strokeWidth="3" />
      <circle cx="65" cy="63" r="2" fill="white" stroke="black" strokeWidth="3" />
      <circle cx="45" cy="38" r="2" fill="white" stroke="black" strokeWidth="3" />
     <polyline points="35,64 42,45 60,45 67,64" fill="none" stroke="black" strokeWidth="3" />
     <line x1="42" y1="45" x2="45" y2="38" stroke="black" strokeWidth="3"/>
     
     <polyline points="20,30 50,20 80,30" fill="none" stroke="black" strokeWidth="3" />
      
     <polyline points="40,47 58,63 68,63" fill="none" stroke="black" strokeWidth="3" />

      
     

      <text x="25" y="90" fontSize="10" fill="black">Bike room</text>
    </svg>
  );
};

export default Bike;
