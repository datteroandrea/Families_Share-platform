import React from "react";
import PropTypes from "prop-types";
import LazyLoad from "react-lazyload";
import RequestListItem from "./RequestListItem";
import withLanguage from "./LanguageContext";

const RequestList = ({ userIds }) => {
  const { length } = userIds;
  const blocks = [...Array(Math.ceil(length / 4)).keys()];
  return (
    <div className="suggestionsContainer">
      <ul>
        {blocks.map((block, blockIndex) => {
          let indexes;
          if (length <= 4) {
            indexes = [...Array(length).keys()];
          } else {
            indexes = [
              ...Array(
                (block + 1) * 4 <= length ? 4 : length - block * 4
              ).keys()
            ].map(x => block * 4 + x);
          }
          return (
            <LazyLoad key={blockIndex} height={350} once offset={150}>
              {indexes.map(index => (
                <li key={index} style={{ margin: "1rem 0" }}>
                  <RequestListItem userId={userIds[index]}/>
                </li>
              ))}
            </LazyLoad>
          );
        })}
      </ul>
    </div>
  );
};

RequestList.propTypes = {
  userIds: PropTypes.array
};

export default withLanguage(RequestList);
