name1.onblur = function(){
	var name = this.value.trim(),
		len = name.split(' ').length,
		label_class = "label-name";

	if(len != 2){
		showError(label_class,"Name must have 2 words");
	}else{
		removeError(label_class);
	}

	validate();
}

radius1.onblur = function (){
	var radius = this.value,
		label_class = "label-radius";	

	if(radius < 3 || radius > 5){
		showError(label_class, "Radius must be 3 until 5");
	}else{
		removeError(label_class);
	}

	validate();
}

function showError(label,message){
	var labels = document.createElement('label');
		labels.classList.add(label);
		labels.innerHTML = message;

	var len = document.getElementsByClassName(label).length;
	if(len > 0) return;

	divmessage = document.getElementsByClassName('message')[0];
	divmessage.appendChild(labels);
}
function removeError(label){
	divmessage = document.getElementsByClassName('message')[0];

	var len = document.getElementsByClassName(label).length;

	if(len > 0){
		divmessage.removeChild(document.getElementsByClassName(label)[0]);
	}
}

function validate(){
	var name = name1.value.trim().split(' ').length,
		radius = radius1.value,
		img_len = document.getElementsByClassName('profile').length;

	if(name == 2 && (radius >= 3 && radius <=5) && img_len!=0){
		start.disabled = false;
	}else{
		start.disabled = true;
	}

}

start.onclick = function(e){
	e.preventDefault();
	e.stopPropagation();
	startClick();
}

restart.onclick = function(){
	location.reload();
}

function drag(){
	var divdrop = document.getElementById('drop');
	
	var arrPrevent = ['drag','dragenter','dragover','dragenter','dragleave','drop'];
	var arrDrag = ['dragstart','dragover','dragenter'];
	var arrDrop = ['dragend','dragleave','drop'];

	arrPrevent.forEach(function(event){
		divdrop.addEventListener(event, function(e){
			e.stopPropagation();
			e.preventDefault();
		})
	})	

	arrDrag.forEach(function(event){
		divdrop.addEventListener(event, function(e){
			divdrop.classList.add('ondrag');
		})
	})

	arrDrop.forEach(function(event){
		divdrop.addEventListener(event, function(e){
			divdrop.classList.remove('ondrag');
		})
	})

	divdrop.addEventListener('drop',function(e){
		var droppedFile = e.dataTransfer.files[0];
		previewPhoto(droppedFile);
	})
}

file.onchange = function(){
	previewPhoto(this.files[0]);
}

function previewPhoto(files){
	if(files.type != 'image/jpeg'){
		showError('label-image','Must jpeg image');
	}else{
		removeError('label-image');

		var image = new Image();
		image.classList.add('profile');

		var reader = new FileReader();
		reader.onload = function(e){
			image.src = e.target.result;
			img = e.target.result;
		}

		reader.readAsDataURL(files);

		var divPreview = document.getElementById('preview');

		if(divPreview.hasChildNodes()){
			divPreview.removeChild(divPreview.childNodes[0]);
		}
		divPreview.appendChild(image);
	}
	
	validate();
}
