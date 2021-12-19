const SUPPORT_MENU = 'Model Support Detail';

function clickSupportMenu() {
    const host = window.__view__._host;
    const eventHandler = () => {
        window.removeEventListener('keydown', eventHandler);
        host._document.body.removeEventListener('click', eventHandler);
        window.__view__.show('default');
    };
    window.addEventListener('keydown', eventHandler);
    host._document.body.addEventListener('click', eventHandler);
    window.__view__.show('checking default');
}

        
function getMaxTextureSize() {
    const _document = window.__view__._host._document;
    var gl = _document.createElement('canvas').getContext('webgl2');
    if (!gl) {
        return;
    }
    return gl.getParameter(gl.MAX_TEXTURE_SIZE)
}


function checkModelSupport(model) {
    const host = window.__view__._host;
    const paddlejsOps = paddlejs && paddlejs.webglBackend && paddlejs.webglBackend.ops || [];
    const menuList = host._menu._items;
    const {
        graphs = []
    } = model;
    const supportSummaryDom = host._document.querySelector('.model-check .support-summary');
    if (graphs.length !== 1) {
        supportSummaryDom.innerText = `Failed to get model graph~!`;
    }
    else {
        const modelOps = graphs[0].nodes;
        const unsupportedOps = Array.from(new Set(modelOps
            .filter(op => {
                const type = op.type && op.type.name;
                return type && !paddlejsOps[type] && type !== 'feed' && type !== 'fetch'
            })
            .map(op => op.type.name)
        ));

        const supportContent = unsupportedOps.length > 0
            ? unsupportedOps.reduce((acc, cur) => acc += `<span>${cur}</span>`, 'unsupported ops: ')
            : 'Ops are all supported';

        
        supportSummaryDom.innerHTML = supportContent;

        const opsListDom = host._document.querySelector('.model-check .ops-list');
        opsListDom.innerHTML = Array.from(new Set(modelOps.map(op => op.type && op.type.name)))
            .reduce((acc, cur) => acc += `<span>${cur}</span>`, 'model ops: ');

        const layersNumDom = host._document.querySelector('.model-check .layers-num');
        layersNumDom.innerHTML = `model layer num is ${modelOps.length}`;

        const maxTextureSizeDom = host._document.querySelector('.model-check .max-texture-size');
        maxTextureSizeDom.innerText = `webgl max texture size is ${getMaxTextureSize()}`;
    }

    const checkMenu = menuList.find(item => item.label === SUPPORT_MENU);
    if (!checkMenu) {
        menuList.push({
            label: SUPPORT_MENU,
            click: clickSupportMenu
        });
    }

}

export default checkModelSupport;