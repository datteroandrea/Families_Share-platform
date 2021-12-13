import React from "react";
import PropTypes from "prop-types";
import withLanguage from "./LanguageContext";
import BackNavigation from "./BackNavigation";
import axios from "axios";
import Log from "./Log";
import LoadingSpinner from "./LoadingSpinner";

const styles = {
    add: {
        position: "absolute",
        right: 0,
        bottom: 0,
        height: "5rem",
        width: "5rem",
        borderRadius: "50%",
        border: "solid 0.5px #999",
        backgroundColor: "#ff6f00",
        zIndex: 100,
        fontSize: "2rem"
    },
    post: {
        width: "70%",
        margin: "auto",
    },
};

const getGroup = groupId => {
    return axios
        .get(`/api/groups/${groupId}`)
        .then(response => {
            console.log(response.data);
            return response.data;
        })
        .catch(error => {
            Log.error(error);
            return {};
        });
};

class CreatePost extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            group: {},
            fetchedGroup: false
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

    handleCreatePost() {

    }

    async componentDidMount() {
        const { match } = this.props;
        const { groupId } = match.params;
        const group = await getGroup(groupId);

        this.setState({ group: group, fetchedGroup: true })
    }

    render() {
        const { fetchedGroup } = this.state;
        const { group } = this.state;
        return fetchedGroup ? (
            <React.Fragment>
                <BackNavigation title={group.name} fixed onClick={() => this.handleGoBack()} />
                <div class="row no-gutters" style={styles.post}>
                    <input
                        style={styles.title}
                        type="text"
                        name="name"
                        className="createPostTitleInput form-control"
                        required
                    />
                    <textarea
                        style={styles.textarea}
                        rows="1"
                        name="description"
                        className="createPostDescriptionInput form-control"
                        required
                    />
                    <button
                        onClick={this.handleCreatePost}
                        type="button"
                        className="findOutMore createButton"
                    >
                        Create Post
                    </button>
                </div>

            </React.Fragment>
        ) : (
            <LoadingSpinner />
        );
    }
}


CreatePost.propTypes = {
    group: PropTypes.object,
    userIsAdmin: PropTypes.bool,
    history: PropTypes.object
};

export default withLanguage(CreatePost);