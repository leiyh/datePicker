# datePicker
移动端日期选择

这是一个基于Hammer.js的的日期选择器！此日期选择器提供了一种简单的方法，可以创建单个和多个查看的日历，支持年月日时分的选择


## 快速开始
下载最新版本和Hammer.js

	<!-- 引入文件 -->
	<link rel="stylesheet" href="css/datePicker.css">
	<script src="js/hammer.min.js"></script>
	<script src="js/datePicker.js"></script>
	<!-- html代码 -->
	<input type="text" readonly="readonly" placeholder="请选择年月日" id="datePicker">
	<!-- js代码 -->
	<script>
	  //返回值为当前对象
		var date = new DatePicker({
			el: document.querySelector('#datePicker'),      //绑定元素
			title: '请选择日期',       //标题，默认请选择年月日             
			max: 2050,                //最大年份，默认2020
			min: 1990,                //最小年份，默认1900
			split: '-',               //年月份分隔符,默认/
			type: 'date',             //选择类型，date表示选择年月日，time表示选择时分，dateTime表示年月日时分，默认date
			confirm: function(value) {          //确定按钮的回调，参数为当前选择的值
				console.log(value, '确定');
			},
			cancel: function() {                //取消按钮的回调，没有参数
				console.log('取消');
			}
		});
	<script>

<img src="https://github.com/leiyh/datePicker/blob/master/examples/date.png">
	
<img src="https://github.com/leiyh/datePicker/blob/master/examples/time.png">
	
<img src="https://github.com/leiyh/datePicker/blob/master/examples/dateTime.png">
