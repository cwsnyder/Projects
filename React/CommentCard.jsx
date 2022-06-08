/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import AddEditComment from './AddEditComment';
import debug from 'sabio-debug';
import commentService from '../../services/commentService';

const _logger = debug.extend('CommentCard');

function CommentCard(props) {
    const [cardData, setCardData] = useState({ isDeleted: 1, isReplying: false, isEditing: false });

    _logger('CommentCard Props', props);

    const aComment = props.comment;
    const user = props.currentUser;
    const commentRefresh = props.renderComments;

    const createMarkup = (text) => {
        return { __html: text };
    };

    const mapReplies = (aComment) => (
        <CommentCard key={aComment.id} comment={aComment} currentUser={props.currentUser}></CommentCard>
    );

    const onDelete = (e) => {
        const id = parseInt(e.target.value);
        _logger('Delete', { cardData });
        commentService.deleteComment(id, cardData.isDeleted).then(onDeleteCommentSuccess).catch(onDeleteCommentError);
    };

    const onDeleteCommentSuccess = (response) => {
        _logger('Delete Comment', response);
    };
    const onDeleteCommentError = (error) => {
        _logger('Delete Comment', error);
    };

    const onIsReplying = (e) => {
        _logger('reply button hit', e);
        setCardData((prevState) => {
            const sp = { ...prevState };
            sp.isReplying = !prevState.isReplying;
            return sp;
        });
    };

    const onIsEditing = (e) => {
        _logger('reply button hit', e);
        setCardData((prevState) => {
            const sp = { ...prevState };
            sp.isEditing = !prevState.isEditing;
            if (prevState.isReplying === true) {
                sp.isReplying = !prevState.isReplying;
            }
            return sp;
        });
    };

    return (
        <React.Fragment>
            <div className="container">
                <div>
                    <div className="d-none">{aComment.id}</div>
                    <h5 className="mt-2">
                        <small className="text-muted">{aComment.dateModified}</small>
                    </h5>
                    <p className="my-1" dangerouslySetInnerHTML={createMarkup(aComment.subject)}></p>
                    <p className="my-1" dangerouslySetInnerHTML={createMarkup(aComment.text)}></p>

                    {aComment.id ? (
                        <div className="row">
                            {aComment.parentId === 0 ? (
                                <button className="col-1 btn btn-sm btn-link text-muted" onClick={onIsReplying}>
                                    <i className="col-1"></i> Reply
                                </button>
                            ) : null}
                            {user.id !== aComment.createdBy ? (
                                <button className="col-1 btn btn-sm btn-link text-muted" onClick={onIsEditing}>
                                    <i className="col-1"></i> Edit
                                </button>
                            ) : null}
                            {user.id !== aComment.createdBy ? (
                                <button
                                    className="col-1 btn btn-sm btn-link text-muted"
                                    value={`${aComment.id}`}
                                    onClick={onDelete}>
                                    <i className="col-1"></i> Delete
                                </button>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </div>
            {cardData.isReplying || cardData.isEditing ? (
                <div className="mx-n2 p-2 bg-light">
                    {props.currentUser && (
                        <AddEditComment
                            refresh={commentRefresh}
                            replyButton={onIsReplying}
                            editButton={onIsEditing}
                            cardData={cardData}
                            comment={aComment}></AddEditComment>
                    )}
                </div>
            ) : null}
            <div className="container">
                <div className="row">
                    <div className="col" style={{ marginLeft: '2%' }}>
                        {aComment.replies?.map(mapReplies)}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default CommentCard;
