import React from 'react';
import * as messages from './HDCoverSummary.messages';

export default function HDCoverSummary() {
    return (
        <>
            <ul className="pad-inl-start-sm">
                <li>{messages.coverSummaryList1Item1}</li>
                <li>{messages.coverSummaryList1Item2}</li>
                <li>{messages.coverSummaryList1Item3}</li>
            </ul>
            <p>{messages.coverSummaryParagraph2}</p>
            <ul className="pad-inl-start-sm">
                <li>{messages.coverSummaryList2Item1}</li>
                <li>{messages.coverSummaryList2Item2}</li>
                <li>{messages.coverSummaryList2Item3}</li>
            </ul>
            <p>
                {messages.coverSummaryParagraph31}
                <span className="font-bold">
                    {' '}
                    {messages.coverSummaryParagraph3Mobile}
                    {' '}
                </span>
                {messages.coverSummaryParagraph32}
            </p>
        </>
    );
}

HDCoverSummary.propTypes = {};
