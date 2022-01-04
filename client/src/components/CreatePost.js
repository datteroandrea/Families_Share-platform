import React from "react";
import PropTypes from "prop-types";
import withLanguage from "./LanguageContext";
import BackNavigation from "./BackNavigation";
import axios from "axios";
import Log from "./Log";
import LoadingSpinner from "./LoadingSpinner";
import Texts from "../Constants/Texts";

const getGroup = groupId => {
    return axios
        .get(`/api/groups/${groupId}`)
        .then(response => {
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
            content: '',
            tag: 'game'
        };

        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleContentChange = this.handleContentChange.bind(this);
        this.handleContentChange = this.handleContentChange.bind(this);
        this.handleTagChange = this.handleTagChange.bind(this);
        this.handleCreatePost = this.handleCreatePost.bind(this);
    }

    handleGoBack() {
        const { history } = this.props;
        const { group_id } = this.state.group
        history.replace("/groups/" + group_id + "/board");
    };

    handleTitleChange(event) {
        this.setState({ title: event.target.value });
    }

    handleContentChange(event) {
        this.setState({ content: event.target.value });
    }

    handleTagChange(event) {
        alert("Cambiato in " + event.target.value)
        this.setState({ tag: event.target.value });
    }

    handleCreatePost(event) {
        const title = this.state.title;
        const content = this.state.content;
        const tag = this.state.tag;
        const group_id = this.state.group.group_id;
        alert("creo post con tag " + tag)
        axios
            .post(
                "/api/groups/" + group_id + "/noticeboard/posts/create", {
                title: title,
                text: content,
                tag: tag
            })
        this.handleGoBack();

        /*.post(
            "/api/groups/"+group_id+"/noticeboard/posts/create", {
                title: title,
                text: content
            }
        ).then(
            response => {
                alert("Sono nel then");
                Log.info(response);
                this.handleGoBack();
          }
        ).catch(
            error => {
                alert("Sono nell'errore");
                Log.error(error);
          }
        );*/
    }

    async componentDidMount() {
        const { match } = this.props;
        const { groupId } = match.params;
        const group = await getGroup(groupId);

        this.setState({ group: group, fetchedGroup: true })
    }

    render() {
        const { fetchedGroup } = this.state;
        const { language } = this.props;
        const texts = Texts[language].createPost;
        const tags = Texts[language].postTag;

        return fetchedGroup ? (
            <React.Fragment>
                <BackNavigation title={texts.main} fixed onClick={() => this.handleGoBack()} />
                <form className="row no-gutters post" onSubmit={this.handleCreatePost}>
                    <input
                        type="text"
                        name="title"
                        className="createPostTitleInput form-control"
                        placeholder={texts.title}
                        onChange={this.handleTitleChange}
                        required
                    />
                    <textarea
                        type="text"
                        name="content"
                        className="createPostDescriptionInput form-control"
                        placeholder={texts.content}
                        onChange={this.handleContentChange}
                        required
                    />
                    <select
                        className="createPostTypeSelect form-control"
                        onChange={this.handleTagChange}
                    >
                        {tags.map((tag) => (
                        <option value={tag.value}>{tag.label}</option>
                        ))}
                    </select>

                    <input
                        type="submit"
                        value={texts.create}
                        className="findOutMore createButton"
                    />
                </form>

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