
console.log('hallo');
export default function attrGenerator(options?: { transform?: string, defaultValue?: any }) {
  console.log('attrGenerator', options);
  return function attr(target: any, key: string) {
    console.log('attrGenerator-attr', target, "key", key, "options", options);
  }
}
