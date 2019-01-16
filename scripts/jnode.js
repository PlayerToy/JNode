
function createDOMElement(type, content, tags) {
  let element = document.createElement(type);
  if(content) element.innerHTML = content;
  for(let tag in tags) {
    if(tags.hasOwnProperty(tag)) {
      element[tag] = tags[tag];
    }
  }
  return element;
}

async function fetchJSON(path) {
  return fetch(path).then((content) => {
    return content.json();
  }).catch((rejected) => {
    console.log('Could not load JSON: ' + rejected);
  });
}

async function fetchScript(path) {
  return new Promise(function(resolve, reject) {
    let script = createDOMElement('script', null, {'type': 'application/javascript', 'src': path});
    script.addEventListener('load', (event) => {
      resolve(script);
    });
    document.head.appendChild(script);
  });
}

function checkForModule(name) {
  modules.forEach((module) => {
    if(module.name == name) return true;
  });
  return false;
}

let modules = [];
var module = {};
async function require(name) {
  if(!checkForModule(name)) {
    module.info = await fetchJSON('./modules/' + name + '/module.json');
    let script = await fetchScript('./modules/' + name + '/' + module.info.main);
    return module.exports;
  }
}
