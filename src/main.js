import {replace} from './format'
import {set, fetch} from './translations'

const options = {
  locale: '',
};

const translator = function(key, replacements = {}) {

  let locale      = replacements['locale'] || options.locale;
  let translation = fetch(locale, key);

  return replace(translation, replacements)
};

translator.setLocale = function(locale) {
  options.locale = locale;
};

export const translate = translator;

export default {
  install: function(Vue, data) {

    set(data.translations);
    options.locale = data.locale;

    Vue.directive('locale', {
      params: ['key', 'replace'],

      update: function(locale) {
        let translated_substrings = translator(this.params.key, this.params.replace).split('|');

        let children = this.el.children;

        for(let i = 0; i < children.length; i++){
          if (translated_substrings[i]) {
            children[i].innerText = translated_substrings[i];
          }
        }
      }
    });

    Vue.prototype.$t = translator;

    Vue.filter('translate', function(key, replacements = {}) {
      return translator(key, replacements)
    })
  }
}
