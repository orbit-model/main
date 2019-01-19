
console.log('attr 0');
export default function attrGenerator(options?: { transform?: string, defaultValue?: any }) {
  console.log('attrGenerator', options);

  setTimeout(()=>{
    console.log('setTimeout');
  }, 1);

  return function attr(target: any, key: string) {
    console.log('attrGenerator-attr', target, "key", key, "options", options);

    console.log('typeof', typeof target, target.constructor.name);

  }
}
