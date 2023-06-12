/*
枚举数据的使用、绑定是比较常见的，针对Element UI组件进行简单封装一下，让枚举数据的使用、绑定更轻松。

新建一个管理枚举数据的JS文件：enums.js
定义一个枚举工厂构造函数EnumFactory，用来封装枚举结构的基础方法，详见注释。
工厂方法中通过 Object.defineProperty(obj, prop, descriptor) 添加属性/方法，该方法添加的默认是不能被枚举、修改的。
申明项目中公共枚举数据，并导出。
枚举元数据结构：
支持 {key , text} 结构：{ male: '男', female: '女', other: '其他' }
也支持 {key :{text, value }}结构：{ male: { text: '男', value: 1 }, female: { text: '女', value: 2 } }
 */
//枚举构造器，提供的属性：
// keys：枚举的key集合[key]
// texts：枚举的文本text集合[text]
// values：枚举的数值value集合[value]
// entries：枚举的key、text、value集合[{key,text,value}]
// tableFormater：element中表格绑定枚举数据文本的formatter函数
function EnumFactory(enumObj) {
    //复制（继承）enumObj
    Object.assign(this, enumObj);

    // keys：枚举的key集合[key]
    Object.defineProperty(this, 'keys', {
        value: Object.keys(enumObj)
    });
    //处理texts、values、entries
    let values = [], texts = [], entries = [];
    const vobjs = Object.values(enumObj);
    if (typeof vobjs[0] === 'string') {
        texts = vobjs;
        vobjs.forEach((item, index) => {
            entries.push({key: this.keys[index], text: texts[index]});
        })
    } else {
        vobjs.forEach((item, index) => {
            texts.push(item.text);
            values.push(item.value);
            entries.push({key: this.keys[index], text: item.text, value: item.value});
        })
    }

    // texts：枚举的文本text集合[text]
    Object.defineProperty(this, 'texts', {value: texts});

    // values：枚举的数值value集合[value]
    Object.defineProperty(this, 'values', {value: values});

    // entries：枚举的key、text、value集合[{key,text,value}]
    Object.defineProperty(this, 'entries', {value: entries});

    // tableFormater：element中表格绑定枚举数据文本的formatter函数
    Object.defineProperty(this, 'tableFormater', {
        value: function (r, c, value) {
            return entries.filter(v => v.key === value || v.value === value)[0]?.text || 'notfound';
        }
    });

    //枚举定义的数据都是常量，不可修改，冻结一下
    Object.freeze(this);
}

//********************** 定义项目公共枚举 ********************** */

//性别枚举：key、text模式
// const enumSex = new EnumFactory({ male: '男', female: '女', other: '其他' });
//性别枚举：key、text、value模式
const planDesignType = new EnumFactory({type1: {text: 'OTN业务', value: 1}, type2: {text: '网元业务', value: 2}});
//**********************  export  ********************** */
export {planDesignType}

//test
console.log(planDesignType.keys);
console.log(planDesignType.texts);
console.log(planDesignType.values);
console.log(JSON.stringify(planDesignType.entries));
