/*
 * @File: wrapper-loader.js
 * @Desc: wrapper netron source
 * @Author: JingyuanZhang
 * @Date: 2021-11-16 23:43:22
 * @LastEditTime: 2021-11-16 23:43:22
 */

module.exports = function(source) {
    const fileNPathArr = this.resourcePath.split('.')[0].split('/');
    const fileName = fileNPathArr.pop();
    const localDir = fileNPathArr.pop();

    if (localDir === 'source' && fileName === 'index') {
        return `
    ${source}

    if (typeof module !== 'undefined' && typeof module.exports === 'object') {
        module.exports.BrowserHost = host.BrowserHost;
    }

        `;
    }
    else if (fileName === 'paddle') {
        return `
        (function(protobuf, flatbuffers) {
            ${source}
        })(protobuf, flatbuffers);
        `;
    }

    return source;
}