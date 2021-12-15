import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Skeleton } from "antd";
import * as path from "lodash.get";
import TimeAgo from "./TimeAgo";
import Avatar from "./Avatar";
import ConfirmDialog from "./ConfirmDialog";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import Log from "./Log";

class PostHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDialogIsOpen: false,
      deleteId: "",
      fetchedOwner: false,
      owner: {}
    };
  }

  componentDidMount() {
    const { ownerId } = this.props;
    axios
      .get(`/api/users/${ownerId}/profile`)
      .then(response => {
        this.setState({ fetchedOwner: true, owner: response.data });
      })
      .catch(error => {
        Log.error(error);
        this.setState({
          fetchedOwner: true,
          owner: { image: { path: "" }, family_name: "", given_name: "" }
        });
      });
  }

  componentWillReceiveProps(props) {
    const { userId } = this.props;
    if (userId !== props.userId) {
      this.setState({ fetchedProfile: false });
      axios
        .get(`/api/users/${props.userId}/profile`)
        .then(response => {
          this.setState({ fetchedProfile: true, profile: response.data });
        })
        .catch(error => {
          Log.error(error);
          this.setState({
            fetchedProfile: true,
            profile: { image: { path: "" }, family_name: "", given_name: "" }
          });
        });
    }
  }

  handleDelete = () => {
    const { groupId, handleRefresh } = this.props;
    const { deleteId } = this.state;
    axios
      .delete(`/api/groups/${groupId}/noticeboard/posts/${deleteId}/delete`)
      .then(response => {
        Log.info(response);
        handleRefresh();
      })
      .catch(error => {
        Log.error(error);
      });
  };

  handleEdit = (postId) => {
    const { groupId, history, handleRefresh } = this.props;
    
    console.log("Post: " + JSON.stringify(postId));
    console.log("History: " + JSON.stringify(history));
    // Da fare: bruttissimo dovremmo sistemarlo con history
    // ma per qualche ragione mi viene fuori che history = null
    // quindi per il momento lo faccio così
    document.location.href += `/posts/${postId}/edit`
  };

  handleConfirmDialogClose = choice => {
    if (choice === "agree") {
      this.handleDelete();
    }
    this.setState({ deleteId: "", confirmDialogIsOpen: false });
  };

  handleConfirmDialogOpen = id => {
    this.setState({ deleteId: id, confirmDialogIsOpen: true });
  };

  render() {
    const { language, createdAt, postId, userIsAdmin, title } = this.props;
    const texts = Texts[language].announcementHeader;
    const { owner, confirmDialogIsOpen, fetchedOwner } = this.state;
    const userId = JSON.parse(localStorage.getItem("user")).id;
    return (
      <div id="announcementHeaderContainer">
        <ConfirmDialog
          isOpen={confirmDialogIsOpen}
          title={texts.confirmDialogTitle}
          handleClose={this.handleConfirmDialogClose}
        />
        <div className="row no-gutters" id="timeAgoContainer">
          <TimeAgo date={createdAt} />
        </div>
        {fetchedOwner ? (
          <div className="row no-gutters pb-2">
            <div className="col-2-10">
              <Avatar
                thumbnail={path(owner, ["image", "path"])}
                route={`/profiles/${owner.user_id}/info`}
                className="horizontalCenter"
                disabled={owner.suspended}
              />
            </div>
            <div className="col-6-10">
              <h1 className="verticalCenter">
                {`${owner.given_name} ${owner.family_name}`}
              </h1>
            </div>
            <div className="col-2-10">
              {(userId === owner.user_id || userIsAdmin) && (
                <button
                  type="button"
                  className="transparentButton center"
                  onClick={() => this.handleConfirmDialogOpen(postId)}
                >
                  <i className="fas fa-times" />
                </button>
              )}
              {(userId === owner.user_id || userIsAdmin) && (
                <button
                  type="button"
                  className="transparentButton center"
                  onClick={() => this.handleEdit(postId)}
                >
                  <i className="fas fa-edit" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <Skeleton active avatar paragraph={{ rows: 0 }} />
        )}
      </div>
    );
  }
}

PostHeader.propTypes = {
  groupId: PropTypes.string,
  postId: PropTypes.string,
  ownerId: PropTypes.string,
  createdAt: PropTypes.string,
  handleRefresh: PropTypes.func,
  userIsAdmin: PropTypes.bool,
  language: PropTypes.string
};

export default withLanguage(PostHeader);
