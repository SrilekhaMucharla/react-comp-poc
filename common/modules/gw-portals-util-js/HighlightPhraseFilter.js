/**
 * @name HighlightPhraseFilter
 * @description Filter useful in two cases: highlighting queried phrase
 * and providing safe html content.
 *
 * Main responsibility is to look for the string literal given as an
 * argument and provide the 'highlighted' styling to it.
 * E.g. Let's take the phrase: 'Some super loooong phrase'
 * (defined by the 'text' argument) and assume that the user
 * is searching for the 'super' query (given by the 'phrase' argument).
 * By applying this filter with those arguments,
 * you will get the result: 'Some <span class="gw-highlight-phrase-filter_matched">super</span>
 * loooong phrase' which eventually may be injected to the view with the usage of ng-bind-html.
 *
 * On the other hand, it may also just get some text with html tags included
 * and produce sanitized result from it.
 */

import _ from 'lodash';

const htmlTagStart = '.*</?[^>]*';
const htmlTagEnd = '[^<]*>';
const escapableHtmlChars = ['\'', '"', '`', '&', '<', '>'];

const highlight = (phrase, style) => `<span class="${style}">${phrase}</span>`;

export default {
    highlightText: (plainText, phrase, highlightStyle) => {
        let text = plainText;

        if (phrase) {
            const lookaheadPattern = new RegExp(`(${_.escapeRegExp(phrase)})(?!${htmlTagEnd})`, 'gi');
            const lookbehindPattern = new RegExp(`^${htmlTagStart}$`);

            text = text.replace(lookaheadPattern, (matchedPhrase, matchedGroup, offset, str) => {
                // make the actual replacement only after negative lookbehind check
                const lookbehindCandidate = str.substr(0, offset);
                let result = null;

                if (!lookbehindPattern.test(lookbehindCandidate)) {
                    result = highlight(matchedGroup, highlightStyle);
                } else {
                    result = matchedPhrase;
                }

                return result;
            });

            const escapableCharsGuard = escapableHtmlChars.some(
                (character) => phrase.includes(character)
            );
            text = escapableCharsGuard ? text.replace(new RegExp(`(${_.escape(phrase)})`), `${highlight('$1', highlightStyle)}`) : text;
        }

        return text;
    }
};
