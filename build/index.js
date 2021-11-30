/*
 * @File: index.js
 * @Desc: import top level deps
 * @Author: JingyuanZhang
 * @Date: 2021-11-16 23:43:22
 * @LastEditTime: 2021-11-16 23:43:22
 */


import dagre from '../source/dagre';
import base from '../source/base';
import text from '../source/text';
import json from '../source/json';
import python from '../source/python';
import protobuf from '../source/protobuf';
import flatbuffers from '../source/flatbuffers';
import zip from '../source/zip';
import gzip from '../source/gzip';
import tar from '../source/tar';
import grapher from '../source/view-grapher';
import sidebar from '../source/view-sidebar';
import numpy from '../source/numpy';
import view from '../source/view';
import host from '../source/index';



window['dagre'] = dagre;
window['base'] = base;
window['text'] = text;
window['json'] = json;
window['python'] = python;
window['protobuf'] = protobuf;
window['flatbuffers'] = flatbuffers;
window['zip'] = zip;
window['gzip'] = gzip;
window['tar'] = tar;
window['grapher'] = grapher;
window['sidebar'] = sidebar;
window['numpy'] = numpy;
window['view'] = view;




host.BrowserHost.prototype.request = (file, encoding, base) => {
    if (encoding === 'utf-8' && file.endsWith('.json')) {
        const meta = file.split('.').shift();
        const res = JSON.stringify(window[meta]);
        console.log(`[request meta]: ${meta}`);
        return new Promise((resolve, reject) => {
            resolve(res);
        });
    }
};

host.BrowserHost.prototype.require = factoryPath => {
    const factoryId = factoryPath.split('./').pop();
    console.log(`[require factory]: ${factoryId}`);
    const res = window[factoryId];
    return new Promise((resolve, reject) => {
        resolve(res);
    });
};


// 目前仅打包了 paddle 模型可视化，所以覆盖掉源码中的 _filter 方法
// 不覆盖的话，会拿到原始支持 json 格式的所有模型，然后遍历加载模型库，但此时除了 paddle 之外的模型库都未打包进来
// 后期打包更多模型，仅需放开 filter 条件即可
view.ModelFactoryService.prototype._filter = context => {
    const self = window.__view__._modelFactoryService;
    const identifier = context.identifier.toLowerCase().split('/').pop();
    self._extensions = self._extensions.filter(ext => ext.id === './paddle');
    const list = self._extensions.filter(entry =>
        (typeof entry.extension === 'string' && identifier.endsWith(entry.extension)) ||
        (entry.extension instanceof RegExp && entry.extension.exec(identifier)));
    return Array.from(new Set(list.map(entry => entry.id)));
}
