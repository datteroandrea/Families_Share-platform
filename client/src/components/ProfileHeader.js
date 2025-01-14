import React from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { withSnackbar } from "notistack";
import PropTypes from "prop-types";
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";
import OptionsModal from "./OptionsModal";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";
import ConfirmDialog from "./ConfirmDialog";
import ExpandedImageModal from "./ExpandedImageModal";
import Log from "./Log";

class ProfileHeader extends React.Component {
  state = {
    optionsModalIsOpen: false,
    confirmDialogIsOpen: false,
    action: "",
    imageModalIsOpen: false,
    friendstate: "me"
  };

  componentDidMount() {
    let friendstate;
    const { match, profile } = this.props;
    const { profileId } = match.params;
    if (profile.friends_id.includes(JSON.parse(localStorage.getItem("user")).id)) {
      friendstate = "friend";
    } else if (profile.pending_friend_requests_id.includes(JSON.parse(localStorage.getItem("user")).id)) {
      friendstate = "request_sent";
    } else if (profileId === JSON.parse(localStorage.getItem("user")).id) {
      friendstate = "me";
    } else {
      friendstate = "";
    }
    this.setState({
      friendstate
    });
  }

  handleImageModalOpen = () => {
    const target = document.querySelector(".ReactModalPortal");
    disableBodyScroll(target);
    this.setState({ imageModalIsOpen: true });
  };

  handleImageModalClose = () => {
    clearAllBodyScrollLocks();
    this.setState({ imageModalIsOpen: false });
  };

  handleClose = () => {
    this.setState({ optionsModalIsOpen: false });
  };

  handleEdit = () => {
    const { history } = this.props;
    const { pathname } = history.location;
    const parentPath = pathname.slice(0, pathname.lastIndexOf("/"));
    const newPath = `${parentPath}/edit`;
    history.push(newPath);
  };

  handleOptions = () => {
    const { optionsModalIsOpen } = this.state;
    this.setState({ optionsModalIsOpen: !optionsModalIsOpen });
  };

  handleExport = () => {
    const { match, enqueueSnackbar, language } = this.props;
    const { profileId: userId } = match.params;
    const texts = Texts[language].profileHeader;
    axios
      .post(`/api/users/${userId}/export`)
      .then(response => {
        enqueueSnackbar(texts.exportSuccess, { variant: "info" });
        Log.info(response);
      })
      .catch(error => {
        Log.error(error);
      });
  };

  handleDelete = () => {
    const { match, history } = this.props;
    const { profileId: userId } = match.params;
    axios
      .delete(`/api/users/${userId}`)
      .then(response => {
        Log.info(response);
        if (window.isNative)
          window.ReactNativeWebView.postMessage(
            JSON.stringify({ action: "googleLogout" })
          );
        localStorage.removeItem("user");
        history.push("/");
      })
      .catch(error => {
        Log.error(error);
      });
  };

  handleSuspend = () => {
    const { match, language, enqueueSnackbar, history } = this.props;
    const { profileId: userId } = match.params;
    const texts = Texts[language].profileHeader;
    axios
      .post(`/api/users/${userId}/suspend`)
      .then(response => {
        enqueueSnackbar(texts.suspendSuccess, { variant: "info" });
        setTimeout(() => {
          Log.info(response);
          localStorage.removeItem("user");
          history.push("/");
        }, 2000);
      })
      .catch(error => {
        Log.error(error);
        enqueueSnackbar(texts.error, { variant: "error" });
      });
  };

  handleBackNav = () => {
    const { history } = this.props;
    history.goBack();
  };

  handleConfirmDialogOpen = action => {
    this.setState({
      confirmDialogIsOpen: true,
      optionsModalIsOpen: false,
      action
    });
  };

  handleConfirmDialogClose = choice => {
    const { action } = this.state;
    if (choice === "agree") {
      switch (action) {
        case "delete":
          this.handleDelete();
          break;
        case "export":
          this.handleExport();
          break;
        case "suspend":
          this.handleSuspend();
          break;
        default:
      }
    }
    this.setState({ confirmDialogIsOpen: false });
  };

  handleAddFriend = () => {
    const { match } = this.props;
    const { profileId } = match.params;
    axios
      .post("/api/friends/" + profileId + "/addfriend?user_id=" + JSON.parse(localStorage.getItem("user")).id)
      .then(() => { this.setState({ friendstate: "request_sent" }) });

  };

  handleRemoveFriend = () => {
    const { match } = this.props;
    const { profileId } = match.params;
    axios
      .post("/api/friends/" + profileId + "/removefriend?user_id=" + JSON.parse(localStorage.getItem("user")).id)
      .then(() => { this.setState({ friendstate: "" }) });
  };

  render() {

    const { language, history, photo, name } = this.props;
    const texts = Texts[language].profileHeader;
    const {
      optionsModalIsOpen,
      confirmDialogIsOpen,
      action,
      imageModalIsOpen,
      friendstate
    } = this.state;
    let confirmDialogTitle;
    switch (action) {
      case "delete":
        confirmDialogTitle = texts.deleteDialogTitle;
        break;
      case "export":
        confirmDialogTitle = texts.exportDialogTitle;
        break;
      case "suspend":
        confirmDialogTitle = texts.suspendDialogTitle;
        break;
      default:
    }
    const options = [
      {
        label: texts.delete,
        style: "optionsModalButton",
        handle: () => {
          this.handleConfirmDialogOpen("delete");
        }
      },
      // {
      //   label: texts.suspend,
      //   style: "optionsModalButton",
      //   handle: () => {
      //     this.handleConfirmDialogOpen("suspend");
      //   }
      // },
      {
        label: texts.export,
        style: "optionsModalButton",
        handle: () => {
          this.handleConfirmDialogOpen("export");
        }
      }
    ];
    return (
      <div id="profileHeaderContainer">
        <div className="row no-gutters" id="profileHeaderOptions">
          <div className="col-2-10">
            <button
              type="button"
              className="transparentButton center"
              onClick={() => history.goBack()}
            >
              <i className="fas fa-arrow-left" />
            </button>
          </div>
          <div className="col-6-10" />
          {friendstate === "me" ? (
            <React.Fragment>
              <div className="col-1-10">
                <button
                  type="button"
                  className="transparentButton center"
                  onClick={this.handleEdit}
                >
                  <i className="fas fa-pencil-alt" />
                </button>
              </div>
              <div className="col-1-10">
                <button
                  type="button"
                  className="transparentButton center"
                  onClick={this.handleOptions}
                >
                  <i className="fas fa-ellipsis-v" />
                </button>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className="col-1-10">
                {friendstate === "friend" ? (
                  <button
                    type="button"
                    className="transparentButton center"
                    onClick={this.handleRemoveFriend}
                  >
                    <i className="fas fa-user-slash" />
                  </button>
                ) : ""}
                {friendstate === "" ? (

                  <button
                    type="button"
                    className="transparentButton center"
                    onClick={this.handleAddFriend}
                  >
                    <i className="fas fa-user-plus" />
                  </button>
                ) : <div />}
              </div>
            </React.Fragment>
          )}
        </div>
        <img
          className="profilePhoto horizontalCenter"
          alt="user's profile"
          src={photo}
          onClick={this.handleImageModalOpen}
        />
        <h1 className="horizontalCenter">{name}</h1>
        <ExpandedImageModal
          isOpen={imageModalIsOpen}
          handleClose={this.handleImageModalClose}
          image={photo}
        />
        <OptionsModal
          isOpen={optionsModalIsOpen}
          handleClose={this.handleClose}
          options={options}
        />
        <ConfirmDialog
          title={confirmDialogTitle}
          isOpen={confirmDialogIsOpen}
          handleClose={this.handleConfirmDialogClose}
        />
      </div>
    );
  }
}

ProfileHeader.propTypes = {
  history: PropTypes.object,
  name: PropTypes.string,
  photo: PropTypes.string,
  language: PropTypes.string,
  match: PropTypes.object,
  enqueueSnackbar: PropTypes.func
};

export default withRouter(withLanguage(withSnackbar(ProfileHeader)));
