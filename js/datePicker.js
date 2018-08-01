/**
 * datePicker.js  -  v1.0.2  -  2018/07/26
 * 依赖 hammer.min.js
 * 2018 lyh
 */
;!function(w, d, h) {
	function DatePicker (obj) {
		this.obj = {
			el: obj.el,
			title: obj.title || '请选择年月日',
			max: obj.max || 2020,
			min: obj.min || 1900,
			split: obj.split || '/',
			type: obj.type || 'date',
			confirm: obj.confirm,
			cancel: obj.cancel
		};

		var date = new Date(),
			show = new h(this.obj.el),
			$this = this;

		this.body = d.querySelector('body');
		this.value = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes()];
		this.box = d.createElement('div');
		
		show.on('tap', function() {
			$this.createBox();
		});
		return this;
	};
	DatePicker.prototype = {
		createBox: function() {
			var box = this.box,
				html = '',
				year = this.createYear(),
				month = this.createMonth(),
				day = this.createDay(),
				hours = this.createHours(),
				minutes = this.createMinutes();
			html += '<div class="picker-panel">';
			html += '<div class="picker-title">';
			html += '<span class="confirm">确定</span>';
			html += '<span class="cancel">取消</span>';
			html += '<h2>'+ this.obj.title +'</h2>';
			html += '</div>';
			html += '<div class="picker-content">';
			html += '<div class="mask-top"></div>';
			html += '<div class="mask-bottom"></div>';
			html += '<div class="wheel-wrapper">';
			if(this.obj.type === 'date') {
				html += year;
				html += month;
				html += day;
			}else if(this.obj.type === 'time') {
				html += hours;
				html += minutes;
			}else{
				html += year;
				html += month;
				html += day;
				html += hours;
				html += minutes;
			}
			html += '</div>';
			html += '</div>';
			html += '</div>';
			box.className = 'picker';
			box.innerHTML = html;
			this.body.appendChild(box);

			var el = box.querySelectorAll('.wheel-scroll'),
				hammer = [],
				btn = box.querySelector('.confirm'),
				cancel = box.querySelector('.cancel');
			for(var i = 0; i < el.length; i++) {
				hammer[i] = new h(el[i]);
				this.wheel(el, hammer[i], i);
			}
			this.confirm(btn);
			this.cancel(cancel);
		},
		createYear: function() {
			var html = '',
				min = this.obj.min,
				max = this.obj.max,
				curr = -(parseInt(this.value[0]) - min) * 36;
			html += '<div class="wheel">';
			html += '<ul class="wheel-scroll" data-px="'+curr+'" style="transition-duration:0ms; transform:translate(0px, '+curr+'px) scale(1) translateZ(0px);">';
			for(var i = min; i <= max; i++) {
				html += '<li class="wheel-item">'+i+'</li>';
			}
			html += '</ul>';
			html += '</div>';
			return html;
		},
		createMonth: function() {
			var html = '',
				min = 1,
				max = 12,
				curr = -(parseInt(this.value[1]) - min) * 36;
			html += '<div class="wheel">';
			html += '<ul class="wheel-scroll" data-px="'+curr+'" style="transition-duration:0ms; transform:translate(0px, '+curr+'px) scale(1) translateZ(0px);">';
			for(var i = min; i <= max; i++) {
				html += '<li class="wheel-item">'+this.formatNumber(i)+'</li>';
			}
			html += '</ul>';
			html += '</div>';
			return html;
		},
		createDay: function() {
			var html = '',
				curr = -(parseInt(this.value[2]) - 1) * 36;
			html += '<div class="wheel">';
			html += '<ul class="wheel-scroll" data-px="'+curr+'" style="transition-duration:0ms; transform:translate(0px, '+curr+'px) scale(1) translateZ(0px);">';
			html += this.dayNumber();
			html += '</ul>';
			html += '</div>';
			return html;
		},
		dayNumber: function(year, month) {
			var html = '',
				min = 1,
				max = 0,
				year = year || this.obj.min,
				month = month || 1;
			switch(month){
				case 1:
				case 3:
				case 5:
				case 7:
				case 8:
				case 10:
				case 12:
					max = 31;
					break;
				case 2:
					max = (year % 4 === 0) ? 29 : 28;
					break;
				case 4:
				case 6:
				case 9:
				case 11:
					max = 30;
					break;
			}
			for(var i = min; i <= max; i++) {
				html += '<li class="wheel-item">'+this.formatNumber(i)+'</li>';
			}
			return html;
		},
		createHours: function() {
			var html = '',
				min = 0,
				max = 23,
				curr = -(parseInt(this.value[3]) - min) * 36;
			html += '<div class="wheel">';
			html += '<ul class="wheel-scroll" data-px="'+curr+'" style="transition-duration:0ms; transform:translate(0px, '+curr+'px) scale(1) translateZ(0px);">';
			for(var i = min; i <= max; i++) {
				html += '<li class="wheel-item">'+this.formatNumber(i)+'</li>';
			}
			html += '</ul>';
			html += '</div>';
			return html;
		},
		createMinutes: function() {
			var html = '',
				min = 0,
				max = 59,
				curr = -(parseInt(this.value[4]) - min) * 36;
			html += '<div class="wheel">';
			html += '<ul class="wheel-scroll" data-px="'+curr+'" style="transition-duration:0ms; transform:translate(0px, '+curr+'px) scale(1) translateZ(0px);">';
			for(var i = min; i <= max; i++) {
				html += '<li class="wheel-item">'+this.formatNumber(i)+'</li>';
			}
			html += '</ul>';
			html += '</div>';
			return html;
		},
		formatNumber: function(num) {
			return (num < 10) ? '0' + num : num;
		},
		wheel: function(element, hammer, n) {
			var el = element[n],
				curr = 0,
				height = 0,
				$this = this,
				li = el.querySelectorAll('li');
			hammer.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL });
			hammer.on('panstart panup pandown panend', function(ev) {
			    if(ev.type === 'panstart') {
			    	curr = parseInt(el.dataset.px);
			    	height = el.offsetHeight;
			    }else if(ev.type === 'panend') {
			    	var num = 0,
			    		beforeYear = $this.value[0],
			    		beforeMonth = $this.value[1],
			    		isReset = false;
			    	if(curr + ev.deltaY > 0) {
			    		num = 0;
			    		el.style.transitionDuration = '400ms';
			    		el.style.transform = 'translate(0px, 0px) scale(1) translateZ(0px)';
			    	}else if(curr + ev.deltaY < 36 - height) {
			    		num = 36 - height;
			    		el.style.transitionDuration = '400ms';
			    		el.style.transform = 'translate(0px, '+(36 - height)+'px) scale(1) translateZ(0px)';
			    	}else {
			    		num = Math.abs(curr + ev.deltaY);
			    		if(num % 36 > 18) {
			    			num = -(num - num % 36 + 36);
			    		}else{
			    			num = -(num - num % 36);
			    		}
			    		el.style.transitionDuration = '400ms';
			    		el.style.transform = 'translate(0px, '+num+'px) scale(1) translateZ(0px)';
			    	}
			    	el.dataset.px = num;
			    	if($this.obj.type === 'time') {
			    		$this.value[n+3] = +(li[Math.abs(num) / 36].innerHTML);
			    	}else{
			    		$this.value[n] = +(li[Math.abs(num) / 36].innerHTML);
			    	}
			    	if(n === 0 && $this.value[1] === 2 && beforeYear !== $this.value[0]) {
			    		if((beforeYear % 4 === 0 && $this.value[0] % 4 !== 0) || (beforeYear % 4 !== 0 && $this.value[0] % 4 === 0)) {
			    			isReset = true;
			    		}
			    	}else if(n === 1 && beforeMonth !== $this.value[1]) {
			    		isReset = true;
			    	}
			    	if(isReset && $this.obj.type === 'date' || $this.obj.type === 'dateTime') {
			    		var ele = element[2],
			    			len = 0,
			    			juli = 0,
			    			currJuli = 0;
			    		ele.innerHTML = $this.dayNumber($this.value[0], $this.value[1]);
			    		len = ele.querySelectorAll('li').length;
			    		juli = Math.abs(parseInt(ele.dataset.px));
			    		currJuli = (len - 1) * 36;
			    		if(juli > currJuli) {
			    			ele.style.transitionDuration = '0ms';
			    			ele.style.transform = 'translate(0px, -'+currJuli+'px) scale(1) translateZ(0px)';
			    			ele.dataset.px = -currJuli;
			    		}
			    	}
			    }else{
			    	el.style.transitionDuration = '0ms';
				    el.style.transform = 'translate(0px, '+ (curr+ev.deltaY) +'px) scale(1) translateZ(0px)';
			    }
			});
		},
		confirm: function(el) {
			var btn = new h(el),
				$this = this;
			btn.on('tap', function(ev) {
				if($this.obj.type === 'date') {
					$this.obj.el.value = $this.value[0] + $this.obj.split + $this.formatNumber($this.value[1]) + $this.obj.split + $this.formatNumber($this.value[2]);
				}else if($this.obj.type === 'time') {
					$this.obj.el.value = $this.formatNumber($this.value[3]) + ':' + $this.formatNumber($this.value[4]);
				}else{
					$this.obj.el.value = $this.value[0] + $this.obj.split + $this.formatNumber($this.value[1]) + $this.obj.split + $this.formatNumber($this.value[2]) + ' ' + $this.formatNumber($this.value[3]) + ':' + $this.formatNumber($this.value[4]);
				}
				if(typeof $this.obj.confirm === 'function') {
					$this.obj.confirm($this.obj.el.value);
				}
				$this.remove();
			});
		},
		cancel: function(el) {
			var btn = new h(el),
				$this = this;
			btn.on('tap', function(ev) {
				if(typeof $this.obj.cancel === 'function') {
					$this.obj.cancel();
				}
				$this.remove();
			});
		},
		remove: function() {
			this.body.removeChild(this.box);
		}
	};
	w.DatePicker = DatePicker;
}(window, document, Hammer);