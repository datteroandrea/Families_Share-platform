import React from "react";
import PropTypes from "prop-types";
import LazyLoad from "react-lazyload";
import UserListItem from "./UserListItem";
import withLanguage from "./LanguageContext";

const UserList = ({ userIds }) => {
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
                  <UserListItem userId={userIds[index]} />
                </li>
              ))}
            </LazyLoad>
          );
        })}
      </ul>
    </div>
  );
};

UserList.propTypes = {
  userIds: PropTypes.array
};

export default withLanguage(UserList);
