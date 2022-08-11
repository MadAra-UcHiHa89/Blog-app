import React from "react";
import Moment from "react-moment";
const DateFormatter = ({ date }) => {
  return (
    <Moment format="DD MMMM YYYY" withTitle>
      {date}
    </Moment>
  );
};

export default DateFormatter;
