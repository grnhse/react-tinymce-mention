import { initializePlugin } from '../plugin';
import mentionReducer from '../reducers/mentionReducer';
import simpleDataSource from '../reducers/__tests__/fixtures/simple';
import initializeRedux from '../utils/initializeRedux';
import initializeEditor from './fixtures/initializeEditor';
import { testExports } from '../plugin';

// FIXME Rewrite intern tests

import {
  query,
  select,
} from '../actions/mentionActions';


const {
  _typedMention,
  _focus,
  _loadMentions,
  _shouldSelectOrMove,
  _updateMentionText,
  _normalizeEditorInput,
  _isValidDelimiter,

  _removeMentionFromEditor,
  _handleEditorBackspace,
} = testExports;

fdescribe('TinyMCE Plugin', () => {
  var store, tinymce, editor;

  const dataSource = simpleDataSource.sort().map(source => {
    return {
      searchKey: source,
      displayLabel: source
    };
  });

  beforeEach((done) => {
    jasmine.addMatchers({
      toDeepEqual: function() {
        return {
          compare: function(actual, expected) {
            return {
              pass: isEqual(actual, expected)
            };
          }
        };
      }
    });

    store = initializeRedux({ mention: mentionReducer }, {
      mention: {
        asyncDataSource: false,
        dataSource: dataSource,
        highlightIndex: 0,
        mentions: [],
        query: ''
      }
    });

    tinymce = initializeEditor();
    initializePlugin(store, dataSource, '@');

    setTimeout(() => {
      editor = tinymce.activeEditor;
      done();
    }, 10);
  });

  afterEach(() => {
    store = null;
    editor = null;
  });

  describe('#typedMention', function() {
    beforeEach(function() {
      _typedMention.clear();
    });

    it('should update', function() {
      var val = _typedMention.update('hey');
      expect(_typedMention.value).toEqual('hey');
      expect(val).toEqual('hey');

      _typedMention.update('hey you');
      expect(_typedMention.value).toEqual('heyhey you');
    });

    it('should backspace', function() {
      _typedMention.update('hey');
      _typedMention.backspace();
      expect(_typedMention.value).toEqual('he');
      _typedMention.backspace();
      expect(_typedMention.value).toEqual('h');
      _typedMention.update('ey');
      expect(_typedMention.value).toEqual('hey');
    });
  });

  describe('#focus', function() {

    it('should toggle', function() {
      expect(_focus.toggle()).toEqual(true);
      expect(_focus.toggle()).toEqual(false);
    });
  });

  describe('#loadMentions', function() {
    const dataSource = ['a', 'b', 'c'];

    it('should load datasources that are Promises', function(done) {
      const promiseDataSource = {
        then(resolve) {
          resolve(dataSource);
        }
      };

      _loadMentions(promiseDataSource, ({ resolvedDataSource }) => {
        expect(resolvedDataSource).toEqual(dataSource);
        done();
      });
    });

    it('should load datasources that are arrays', function() {
      _loadMentions(dataSource, ({ resolvedDataSource }) => {
        expect(resolvedDataSource).toEqual(dataSource);
      });
    });
  });

  describe('#shouldSelectOrMove', function() {
    it('should update typed mention on BACKSPACE', function() {

    });

    it('should select mention on TAB', function() {

    });

    it('should select mention on ENTER', function() {

    });

    it('should move highlight on DOWN', function() {

    });

    it('should move highlight on UP', function() {

    });

    it('should exit on ESC', function() {

    });
  });

  it('#shouldUpdateOnMention', function() {

  });

  it('should #normalizeEditorInput', function() {

  });

  it('#isValidDelimiter should validate if delimiter is in defaults', function() {

  });


  // _removeMentionFromEditor
  it('should remove mention from the Editor', () => {
    store.dispatch(query('eric'));
    store.dispatch(select());

    var mentionNode = document.createElement('strong');
    const node = document.createTextNode('@eric kong');
    mentionNode.appendChild(node);
    expect(_removeMentionFromEditor(mentionNode)).toEqual('eric kong');

    store.dispatch(query('tim'));
    store.dispatch(select());

    var mentionNode2 = document.createElement('p');
    const node2 = document.createTextNode('@timothy meaney');
    mentionNode2.appendChild(node2);
    expect(_removeMentionFromEditor(mentionNode2)).toEqual('timothy meaney');
  });

  // _handleEditorBackspace
  xit('should handle backspace presses & reset the current query', () => {
    var mentionNode = document.createElement('strong');
    const node = document.createTextNode('@eric kong');
    mentionNode.appendChild(node);
    mentionNode.className = 'mention';
    editor.selection = mentionNode;
    editor.selection.getNode = function() {
      return editor.selection.innerHTML.substring(1);
    };
    editor.selection = editor.selection.getNode();
    editor.setContent(editor.selection);

    _handleEditorBackspace({keyCode: 8});
    expect(editor.selection.textContent).toEqual('');
  });
});
