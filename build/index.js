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

host.BrowserHost.prototype.require = factoryPath=> {
    const factoryId = factoryPath.split('./').pop();
    console.log(`[require factory]: ${factoryId}`);
    const res = window[factoryId];
    return new Promise((resolve, reject) => {
        resolve(res);
    });
};
