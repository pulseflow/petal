import noDiscouragedWords from './rules/best-practices/no-discouraged-words.js';
import { ESLintUtils } from '@typescript-eslint/utils';

const rules = {
	'no-discouraged-words': noDiscouragedWords,
};

export default {
	rules,
};
