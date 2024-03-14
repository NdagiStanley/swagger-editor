import ShortUniqueId from 'short-unique-id';
import Handlebars from 'handlebars';
// import Mustache from 'mustache';

/**
 * Action types.
 */

export const EDITOR_PREVIEW_MUSTACHE_PARSE_STARTED = 'editor_preview_mustache_parse_started';
export const EDITOR_PREVIEW_MUSTACHE_PARSE_SUCCESS = 'editor_preview_mustache_parse_success';
export const EDITOR_PREVIEW_MUSTACHE_PARSE_FAILURE = 'editor_preview_mustache_parse_failure';

/**
 * Action creators.
 */

export const parseStarted = ({ content, contentType, requestId }) => ({
  type: EDITOR_PREVIEW_MUSTACHE_PARSE_STARTED,
  payload: content,
  meta: {
    contentType,
    requestId,
  },
});

export const parseSuccess = ({ parseResult, content, contentType, requestId }) => ({
  type: EDITOR_PREVIEW_MUSTACHE_PARSE_SUCCESS,
  payload: parseResult,
  meta: { content, contentType, requestId },
});

export const parseFailure = ({ error, content, contentType, requestId }) => ({
  type: EDITOR_PREVIEW_MUSTACHE_PARSE_FAILURE,
  payload: error,
  error: true,
  meta: { content, contentType, requestId },
});

/**
 * Async thunks.
 */

// eslint-disable-next-line no-unused-vars
export const parse = ({ content, contentType, parserOptions = {} }) => {
  const uid = new ShortUniqueId({ length: 10 });
  console.log('parse - content:', content?.length, contentType, uid);
  return (system) => {
    const { editorPreviewMustacheActions } = system;
    const requestId = uid();

    editorPreviewMustacheActions.parseStarted({ content, contentType, requestId });

    try {
      // const parseResult = Mustache.parse(content, parserOptions.tags);
      const parseResult = Handlebars.compile(content);
      editorPreviewMustacheActions.parseSuccess({
        parseResult,
        content,
        contentType,
        requestId,
      });
    } catch (error) {
      console.error('Error parsing Mustache template', error, content, contentType, requestId);
      editorPreviewMustacheActions.parseFailure({ error, content, contentType, requestId });
    }
  };
};
