import React from "react";
import Front from "./front/page";

function page({ params }) {
  return (
    <div>
      <div>
        <Front />
      </div>
      pagr {params.residence}
    </div>
  );
}

export default page;