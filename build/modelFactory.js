/*
 * @File: modelFactory.js
 * @Desc: support model lib, including paddle
 * @Author: JingyuanZhang
 * @Date: 2021-11-16 23:43:22
 * @LastEditTime: 2021-11-16 23:43:22
 */

import paddle from '../source/paddle';
import '../source/paddle-schema';
import '../source/paddle-proto';
import paddleMetadata from '../source/paddle-metadata.json';



// register paddle 
window['paddle'] = paddle;
window['paddle-metadata'] = paddleMetadata;

