/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import commentService from '../../services/commentService';
import { Link } from 'react-router-dom';
import debug from 'sabio-debug';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import avatar3 from '../../assets/images/users/avatar-3.jpg';

const _logger = debug.extend('AddEditComment');
const basicSchema = Yup.object().shape({
    subject: Yup.string().max(25),
    text: Yup.string().max(1500).required('Is Required'),
});

function AddEditComment(props) {
    const [commentFormData, setCommentFormData] = useState({
        id: 0,
        subject: '',
        text: '',
        parentId: 0,
        entityTypeId: 1,
        entityId: 11,
    });

    _logger('Add/Edit Comment Props', { props });

    const commentData = props.comment;
    const replying = props.cardData;

    useEffect(() => {
        if (commentData) {
            setCommentFormData((prevState) => {
                let cd = { ...prevState };
                if (replying.isEditing) {
                    cd = { ...commentData };
                } else {
                    cd.parentId = commentData.id;
                }
                return cd;
            });
        }
    }, []);

    _logger('CommentFormData', { commentFormData });

    const onSubmitComment = (values) => {
        if (values.id > 0) {
            values.parentId = values.id;
        }

        _logger('Formik values', values);

        if (values.id === 0) {
            commentService.addComment(values).then(onAddCommentSuccess).catch(onAddCommentError);
        } else {
            commentService.updateComment(values.id, values).then(onUpdateCommentSuccess).catch(onUpdateCommentError);
        }
    };

    const onAddCommentSuccess = (response) => {
        props.isReplying();

        _logger('onAddCommentSuccess', { response });
        toast.success('Comment added successfully');
        return props.commentRefresh;
    };

    const onAddCommentError = (error) => {
        _logger('onAddCommentError', { error });
        toast.warning('Error posting comment');
    };

    const onUpdateCommentSuccess = (response) => {
        props.editButton();

        _logger('onUpdateCommentSuccess', { response });

        return props.commentRefresh;
    };

    const onUpdateCommentError = (error) => {
        _logger('onUpdateCommentError', { error });
    };

    return (
        <React.Fragment>
            <div className="form-container">
                <div className="d-flex mt-1" style={{ marginLeft: 25 }}>
                    <Link to="#" className="pe-2">
                        <img src={avatar3} height="32" className="rounded-circle" alt="" />
                    </Link>
                    <div className="container">
                        <div className="col"></div>
                        <Formik
                            enableReinitialize={true}
                            initialValues={commentFormData}
                            onSubmit={onSubmitComment}
                            validationSchema={basicSchema}>
                            <Form>
                                {commentFormData?.parentId === 0 ? (
                                    <div className="col-4 form-group">
                                        <Field
                                            type="text"
                                            className="form-control"
                                            name="subject"
                                            placeholder="Subject"
                                        />
                                    </div>
                                ) : null}
                                <div className="col-6">
                                    <Field
                                        component="textarea"
                                        className="form-control"
                                        rows="3"
                                        name="text"
                                        placeholder="Comment"
                                    />
                                </div>
                                <div className="col mt-2" style={{ marginLeft: '44%' }}>
                                    <button type="submit" className="btn btn-primary">
                                        Send
                                    </button>
                                </div>
                            </Form>
                        </Formik>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default AddEditComment;
