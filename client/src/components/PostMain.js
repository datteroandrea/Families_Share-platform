import React from "react";
import PropTypes from "prop-types";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";

class PostMain extends React.Component {

  render() {
    const tag_colors = {
      game:   "tag t1",
      school: "tag t2",
      music:  "tag t3",
      sport:  "tag t4",
      buy:    "tag t5",
      sell:   "tag t6",
      other:  "tag t7"
    }

    const { language } = this.props;
    const { body, title, tag } = this.props;
    const tagName = Texts[language].postTag[tag];
    const tag_col = tag_colors[tag];

    return (
      <div id="announcementMainContainer" className="horizontalCenter">
        <div className="row no-gutters">
          <button className={tag_col}> {tagName} </button>
          <h1 className="dont-break-out ml-2 pt-1">{title} </h1>
        </div>
        <div className="row no-gutters pt-2">
          <p>{body}</p>
        </div>
      </div>
   );
  }
}

PostMain.propTypes = {
  language: PropTypes.string,
  title: PropTypes.string,
  body: PropTypes.string,
  tag: PropTypes.string
};

export default withLanguage (PostMain);