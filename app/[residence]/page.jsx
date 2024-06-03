import React from "react";
import Front from "./front/page";

function page({ params }) {
  return (
    <div>
     <div className="bg-blue-300">
        <Front />
      </div>
      pagr {params.residence}
    </div>
  );
}

export default page;