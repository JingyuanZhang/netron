
function getPaddleFormatType(value) {
    const type = Array.isArray(value)
        ? 'arrayType'
        : Number.isInteger(value)
            ? 'intType'
            : typeof value;
    let formatType = '';
    switch(type) {
        case 'arrayType':
            const sample = value[0];
            if (Number.isInteger(sample)) {
                formatType = 'ints'; // INTS
            }
            else if (typeof sample === 'number') {
                formatType = 'floats';
            }
            else if (typeof sample === 'string') {
                formatType = 'strings';
            }
            else if (typeof sample === 'boolean') {
                formatType = 'booleans';
            }
            break;
        case 'intType':
            formatType = 'int';
            break;
        default:
            formatType = type; // string boolean number
    }
    return formatType;
}

function createJsProgram(block, int64, JsAttributeType) {
    const program = {};
    program.format = 'PaddlePaddle';
    block.vars = Object.values(block.vars);
    block.idx = 0;

    const variables = new Set();
    // format vars
    for (const variable of block.vars) {
        if (variable.persistable) {
            variables.add(variable.name);
        }

        const dims = variable.shape.map(item => {
            return int64(item, item >= 0 ? 0 : -1);
        });
        variable.type = {
            type: 7,
            lod_tensor: {
                lod_level: 0,
                tensor: {
                    data_type: 5,
                    dims
                }
            }
        };
        variable.attrs = [];
    }

    // format inputs 、outputs 、attrs
    for (const op of block.ops) {
        // mock paddle input 0
        if (op.type === 'feed' || op.type === 'fetch') {
            op.attrs['col'] = 0;
        }
        const inputs = [];
        Object.keys(op.inputs).forEach(key => {
            inputs.push({
                parameter: key,
                arguments: op.inputs[key]
            })
        });
        op.inputs = inputs;
        const outputs = [];
        Object.keys(op.outputs).forEach(key => {
            outputs.push({
                parameter: key,
                arguments: op.outputs[key]
            });
        });
        op.outputs = outputs;

        const attrs = [];
        Object.keys(op.attrs).forEach(key => {
            const value = op.attrs[key];
            const formatType = getPaddleFormatType(value);
            const formatTypeInfo = JsAttributeType[formatType];
            if (formatTypeInfo) {
                attrs.push({
                    type: formatTypeInfo.code,
                    name: key,
                    [formatTypeInfo.value]: value
                });
            }
        });
        op.attrs = attrs;
    }

    program.desc = {
        blocks: [block]
    };
    program.vars = Array.from(variables).sort();
    return program;
}


export default createJsProgram;