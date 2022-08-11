import { useState, CSSProperties } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red"
};

const Loading = () => {
  return (
    <div>
      <ClipLoader
        color="red"
        cssOverride={override}
        loading={true}
        size={150}
      />
    </div>
  );
};

export default Loading;
