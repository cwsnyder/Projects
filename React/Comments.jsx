import React, { useState } from 'react';
import CommentCard from './CommentCard';
import AddEditComment from './AddEditComment';
import debug from 'sabio-debug';
import PropTypes from 'prop-types';
import commentService from '../../services/commentService';

const _logger = debug.extend('Comments');

function Comments(props) {
    const [entityData, setEntityData] = useState({
        isToggled: false,
        isReplying: false,
    });

    const [commentData, setCommentData] = useState({
        arrayOfComments: [],
        commentComponents: [],
    });

    const entityType = props.entityTypeId;
    const entityId = props.entityId;

    const getComments = () => {
        commentService.getCommentByEntityId(entityType, entityId).then(onGetSuccess).catch(onGetError);
    };

    _logger('comments props', props);

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

    const mapComment = (aComment) => {
        _logger('commentMap', aComment);
        return (
            <CommentCard
                key={aComment.id}
                comment={aComment}
                refresh={getComments}
                entityTypeId={props.entityTypeId}
                entityId={props.entityId}
                currentUser={props.currentUser}></CommentCard>
        );
    };

    const onIsToggled = () => {
        setEntityData((prevState) => {
            const sp = { ...prevState };
            sp.isToggled = !prevState.isToggled;
            return sp;
        });
        if (entityData.isToggled !== true) {
            getComments();
        }
    };

    const onIsReplying = () => {
        setEntityData((prevState) => {
            const sp = { ...prevState };
            sp.isReplying = !prevState.isReplying;
            return sp;
        });
    };

    return (
        <React.Fragment>
            <div
                className="body-container mx-auto mb-5"
                style={{ width: 800, borderStyle: 'solid', borderWidth: 0.25 }}>
                <h3 className="text-center mb-3 mt-3" style={{ color: 'green' }}>
                    Comments
                </h3>
                {
                    <div className="mx-n2 p-2">
                        {
                            <AddEditComment
                                refresh={getComments}
                                entityTypeId={props.entityTypeId}
                                entityId={props.entityId}
                                replyButton={onIsReplying}
                                currentUser={props.currentUser}
                                parentId={0}></AddEditComment>
                        }
                    </div>
                }

                <div className="row">
                    <div className="text-center mt-2 mb-2">
                        {!entityData.isToggled ? (
                            <button className="btn btn-lg" style={{ color: 'brown' }} onClick={onIsToggled}>
                                View All Comments
                            </button>
                        ) : (
                            <button className="btn btn-lg" onClick={onIsToggled} style={{ color: 'brown' }}>
                                Close Comments
                            </button>
                        )}
                    </div>
                </div>

                {entityData.isToggled ? (
                    <div className="comment-container">
                        <div className="mx-n2 me-2 p-2 mt-3">{commentData.commentComponents}</div>
                    </div>
                ) : null}
            </div>
        </React.Fragment>
    );
}

Comments.propTypes = {
    currentUser: PropTypes.shape({
        id: PropTypes.number,
        roles: PropTypes.arrayOf(PropTypes.string),
        email: PropTypes.string,
        isLoggedIn: PropTypes.bool,
    }),
    entityTypeId: PropTypes.number.isRequired,
    entityId: PropTypes.number.isRequired,
};

export default Comments;
