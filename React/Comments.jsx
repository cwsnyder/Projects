import React, { useState, useEffect } from 'react';
import CommentCard from './CommentCard';
import AddEditComment from './AddEditComment';
import debug from 'sabio-debug';
import PropTypes from 'prop-types';
import commentService from '../../services/commentService';
import avatar3 from '../../assets/images/users/avatar-3.jpg';
import avatar4 from '../../assets/images/users/avatar-4.jpg';

const _logger = debug.extend('Comments');

function Comment(props) {
    const [user] = useState({ id: 1, avatar: avatar3 });
    const [postData, setPostData] = useState({
        id: 2,
        author: {
            id: 1,
            name: 'Thelma Fridley',
            avatar: avatar4,
        },
        postedOn: 'about 1 hour ago',
        content:
            '<div class="font-16 text-center fst-italic text-dark"><i class="mdi mdi-format-quote-open font-20"></i> Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa.</div>',
        totalLikes: '28',
        totalComments: '',
        isLiked: true,
        isToggled: false,
        isReplying: false,
        comments: [
            {
                id: 1,
                content: 'Nice work, makes me think of The Money Pit.',
                postedOn: '3 hours ago',
                author: {
                    id: 2,
                    name: 'Jeremy Tomlinson',
                    avatar: avatar3,
                },
                isLiked: true,
            },
        ],
        engagement: true,
    });

    const [commentData, setCommentData] = useState({
        arrayOfComments: [],
        commentComponents: [],
    });

    const reply = commentData.arrayOfComments;

    _logger('comment form state', props);

    _logger('comment reply', reply);

    useEffect(() => {
        renderComments();
    }, []);

    const renderComments = () => {
        commentService.getCommentByEntityId(1, 11).then(onGetSuccess).catch(onGetError);
    };

    const onGetSuccess = (response) => {
        _logger('Get Success response', response);
        let commentArray = response.data.items;
        setCommentData((prevState) => {
            const cd = { ...prevState };
            cd.arrayOfComments = commentArray;
            cd.commentComponents = commentArray.map(mapComment);
            return cd;
        });
    };

    const onGetError = (error) => {
        _logger('GetCreatedBy Error', error);
    };

    const createMarkup = (text) => {
        return { __html: text };
    };

    const mapComment = (aComment) => {
        _logger('aComment', aComment);
        return (
            <CommentCard
                key={aComment.id}
                comment={aComment}
                refresh={renderComments}
                currentUser={props.currentUser}></CommentCard>
        );
    };

    const onIsToggled = () => {
        setPostData((prevState) => {
            const sp = { ...prevState };
            sp.isToggled = !prevState.isToggled;
            return sp;
        });
    };

    const onIsReplying = (e) => {
        _logger('reply button hit', e);
        setPostData((prevState) => {
            const sp = { ...prevState };
            sp.isReplying = !prevState.isReplying;
            return sp;
        });
    };

    return (
        <React.Fragment>
            <div className="border border-light rounded p-2 mb-3">
                <div className="d-flex">
                    <img className="me-2 rounded-circle" src={postData.author.avatar} alt="" height="32" />
                    <div>
                        <h5 className="m-0">{postData.author.name}</h5>
                        <p className="text-muted">
                            <small>{postData.postedOn}</small>
                        </p>
                    </div>
                </div>

                <div dangerouslySetInnerHTML={createMarkup(postData.content)}></div>
                <div className="row">
                    <div className="col-2 mt-2">
                        {!postData.content ? null : (
                            <button className="btn btn-sm btn-link text-muted" onClick={onIsReplying}>
                                <i className="reply"></i> Reply
                            </button>
                        )}
                    </div>
                    <div className="col-2 mt-2">
                        {postData.comments ? (
                            <button className="btn btn-sm btn-link text-muted" onClick={onIsToggled}>
                                <i className="reply"></i> View Comments
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>

            {postData.isReplying ? (
                <div className="mx-n2 p-2 bg-light">
                    {user && (
                        <AddEditComment
                            refresh={renderComments}
                            replyButton={onIsReplying}
                            parentId={0}></AddEditComment>
                    )}
                </div>
            ) : null}

            {postData.isToggled ? (
                <div className="comment-container">
                    <div className="mx-n2 p-2 mt-3 bg-light">{commentData.commentComponents}</div>
                </div>
            ) : null}
        </React.Fragment>
    );
}

Comment.propTypes = {
    currentUser: PropTypes.shape({
        id: PropTypes.number,
        roles: PropTypes.arrayOf(PropTypes.string),
        email: PropTypes.string,
        isLoggedIn: PropTypes.bool,
    }),
};

export default Comment;
