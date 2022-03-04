/* eslint-disable */
import _ from "lodash";

/**
 *
 * @param {object} uiProps
 */
export function getFlattenedUiPropsContent(uiProps) {
  if (uiProps.contentRepeat) {
    return uiProps;
  }

  if (!_.isArray(uiProps.content)) {
    return uiProps;
  }

  return uiProps.content.flatMap((item) => getFlattenedUiPropsContent(item));
}
