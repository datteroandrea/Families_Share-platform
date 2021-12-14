import React from "react";
import PropTypes from "prop-types";
import withLanguage from "./LanguageContext";
import BackNavigation from "./BackNavigation";
import axios from "axios";
import Log from "./Log";
import LoadingSpinner from "./LoadingSpinner";
import Texts from "../Constants/Texts";

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
            fetchedGroup: false,
            title: '',
            content: ''
        };

        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleContentChange = this.handleContentChange.bind(this);
        this.handleCreatePost = this.handleCreatePost.bind(this);
    }

    handleGoBack() {
        const { history } = this.props;
        if (history.length === 1) {
            history.replace("/myfamiliesshare");
        } else {
            history.goBack();
        }
    };


    handleTitleChange(event) {
        this.setState({title: event.target.value});
    }

    handleContentChange(event) {
        this.setState({content: event.target.value});
    }

    handleCreatePost(event) {
        const title = this.state.title;
        const content = this.state.content;
        const group_id = this.state.group.group_id;
        axios
            .post(
                "/api/groups/"+group_id+"/noticeboard/posts/create", {
                    title: title,
                    text: content
                }
            ).then(
                response => {
                    Log.info(response);
                    this.handleGoBack();
              }
            ).catch(
                error => {
                    Log.error(error);
              }
            );;
    }

    async componentDidMount() {
        const { match } = this.props;
        const { groupId } = match.params;
        const group = await getGroup(groupId);

        this.setState({ group: group, fetchedGroup: true})
    }

    render() {
        const { fetchedGroup } = this.state;
        const { group } = this.state;
        const { language } = this.props;
        const texts = Texts[language].createPost;
        return fetchedGroup ? (
            <React.Fragment>
                <BackNavigation title={texts.main} fixed onClick={() => this.handleGoBack()} />
                <div class="row no-gutters" style={styles.post}>
                    <form onSubmit={this.handleCreatePost}>                 
                        <input
                            style={styles.title}
                            type="text"
                            name="title"
                            className="createPostTitleInput form-control"
                            placeholder={texts.title}
                            onChange={this.handleTitleChange}
                            required
                        />
                        <textarea
                            style={styles.textarea}
                            type="text"
                            name="content"
                            className="createPostDescriptionInput form-control"
                            placeholder={texts.content}
                            onChange={this.handleContentChange}
                            required
                        />
                        <input
                            type="submit"
                            value={texts.create}
                            className="findOutMore createButton"
                        />
                    </form>
                </div>

            </React.Fragment>
        ) : (
            <LoadingSpinner />
        );
    }
}


CreatePost.propTypes = {
    language: PropTypes.string,
    group: PropTypes.object,
    userIsAdmin: PropTypes.bool,
    history: PropTypes.object
};

export default withLanguage(CreatePost);