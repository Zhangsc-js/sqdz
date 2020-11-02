// rem适配
export function setRem() {
  var whdef = 16/1920;// 表示1920的设计图,使用100PX的默认值
  var bodyWidth = document.body.clientWidth;// 当前窗口的宽度
  var rem = bodyWidth * whdef;// 以默认比例值乘以当前窗口宽度,得到该宽度下的相应FONT-SIZE值
  // document.getElementById('index').style.fontSize = rem + 'px';
  document.getElementsByTagName('html')[0].style.fontSize = rem + 'px';
}
window.addEventListener('load', setRem);
window.addEventListener('resize', setRem);
