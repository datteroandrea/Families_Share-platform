import React from "react";
import PropTypes from "prop-types";
import withLanguage from "./LanguageContext";
import BackNavigation from "./BackNavigation";
import GroupBoardPosts from "./GroupBoardPosts";




class GroupBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleGoBack() {
    const { history } = this.props;
    if (history.length === 1) {
      history.replace("/myfamiliesshare");
    } else {
      history.goBack();
    }
  };


  render() {
    const { group } = this.props;
    const props = this.props;
    const { userIsAdmin } = this.props;
    return (
      <React.Fragment>
        <BackNavigation title={group.name} fixed onClick={() => this.handleGoBack()} />
        <div style={{ position: "relative", top: "5.6rem", paddingBottom: "5.6rem"}}>
          <GroupBoardPosts groupId={group.group_id} userIsAdmin={userIsAdmin} {...props}/>
        </div>
        <div
          className="row no-gutters"
          style={{
            bottom: "8rem",
            right: "7%",
            zIndex: 100,
            position: "fixed"
          }}
        >
        </div>
      </React.Fragment>
    );
  }
}


GroupBoard.propTypes = {
  group: PropTypes.object,
  userIsAdmin: PropTypes.bool,
  history: PropTypes.object
};

export default withLanguage(GroupBoard);