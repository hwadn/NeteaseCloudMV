// 节流
function throttle(fn, wait){
	let timeId = null;
	return function(){
		let event = arguments[0];
		if(timeId) return;
		timeId = setTimeout(function(){
			fn(event);
			timeId = null;
		}, wait);
	};
}
// 模块模式，点击时单例模式，只观察点击的那一个
function DragControl(){
	// 点击目标
	let current = null;
	// 偏差修缮
	let diffX = 0;
	let diffY = 0;
	// 可拖动元素列表
	const elements = [];
	// 全局监听点击事件，若点击的元素可拖动
	const handlers = {
		// 按下
		mousedown(event){
			if(elements.indexOf(event.target) != -1){
				// 抓取元素
				current = event.target;
				// 相对浏览器初始位置，防止首次点击跳动
				let rectObj = current.getBoundingClientRect();
				// 鼠标距离元素左上角位置
				let left = rectObj.left;
				let top = rectObj.top;
				diffX = event.clientX - left;
				diffY = event.clientY - top;
			}
		},
		// 移动，节流
		mousemove : throttle(function(event){
			// 已点下了
			if(current !== null){
				// 元素跟随鼠标位置
				current.style.left = (event.clientX - diffX) + 'px';
				current.style.top = (event.clientY - diffY) + 'px';
			}
		}, 20),
		// 弹起
		mouseup(){
			// 拖动结束，释放元素
			current = null;
		}
	};
	// 设置在哪个元素里拖动
	function setMouseEvent(fatherEle){
		fatherEle.addEventListener('mousedown',handlers.mousedown);
		// 拖动。节流
		fatherEle.addEventListener('mousemove',handlers.mousemove);
		// 拖动结束
		fatherEle.addEventListener('mouseup',handlers.mouseup);
	}
	// 移除拖动监听
	function removeMouseEvent(fatherEle){
		fatherEle.removeEventListener('mousedown',handlers.mousedown);
		// 拖动。节流
		fatherEle.removeEventListener('mousemove',handlers.mousemove);
		// 拖动结束
		fatherEle.removeEventListener('mouseup',handlers.mouseup);
	}
	// 公共调用接口
	return {
		// 加入可拖动列表
		addElement: function(fatherEle, ele){
			if(elements.length == 0){
				// 设置拖放区域父元素
				setMouseEvent(fatherEle);
			}
			// 当前元素
			elements.push(ele);
		},
		// 移除可拖动元素
		removeElement: function(fatherEle, ele){
			let index = elements.indexOf(ele);
			if(index != -1){
				elements.splice(index, 1);
			}
			// 无要拖放的元素，清楚事件
			if(elements.length == 0){
				removeMouseEvent(fatherEle);
			}
		},
	};
}

export default DragControl();