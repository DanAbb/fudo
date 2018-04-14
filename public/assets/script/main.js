import 'babel-polyfill';
// Parent constructors are not called in IE. ima.js polyfill with fix this issue.
import 'ima.js-babel6-polyfill';
import 'whatwg-fetch';
import WidgetFactory from './helpers/factory';
import smoothScroll from './helpers/smooth-scroll';

document.addEventListener('DOMContentLoaded', () => {
   smoothScroll();
});