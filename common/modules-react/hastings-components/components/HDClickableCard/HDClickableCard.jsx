import React from 'react';
import PropTypes from 'prop-types';
// import './HDClickableCard.scss';

const HDClickableCard = ({
    title,
    paragraphs,
    remove,
    edit,
    onDeleteClick,
    onEditClick,
    children
}) => {
    return (
        <div className="hastings-card">
            <div className="clickable-title-paragraph">
                {title && <div className="clickable-card-title">{title}</div>}
                {paragraphs && paragraphs.length && paragraphs.map(
                    (paragraph) => (<div key={paragraph.id} className="clickable-card-paragraph">{paragraph || ''}</div>)
                )}
            </div>
            {remove && <div className="clickable-card-delete" onClick={onDeleteClick} role="presentation"><i>&#9998;</i></div>}
            {edit && <div className="clickable-card-edit" onClick={onEditClick} role="presentation"><i>&#9998;</i></div>}
            {children}
        </div>
    );
};

HDClickableCard.propTypes = {
    title: PropTypes.string,
    paragraphs: PropTypes.arrayOf(PropTypes.string),
    remove: PropTypes.bool,
    edit: PropTypes.bool,
    children: PropTypes.node,
    onDeleteClick: PropTypes.func,
    onEditClick: PropTypes.func,
};

HDClickableCard.defaultProps = {
    title: null,
    paragraphs: [],
    remove: false,
    edit: false,
    children: null,
    onDeleteClick: () => {
    },
    onEditClick: () => {
    }
};

export default HDClickableCard;

// Sample code
// <HDClickableCard
//     title="Body modifications"
//     paragraphs={['Body modifications']}
//     remove
//     edit
//     onDeleteClick={this.handleDelete}
//     onEditClick={this.handleEdit}
//     />
