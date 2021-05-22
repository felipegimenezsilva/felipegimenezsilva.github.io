AFRAME.registerComponent('video_controls',{
	schema:
	{ 
		video_id : 
		{ 
			type : "string" , 
			default : "",
		},
	},
	init : function () 
	{
		var data = this.data;
		var el = this.el;
		data.playing = false
		
		button = document.createElement("a-circle")
		button.setAttribute("radius",0.5)
		button.setAttribute("id","play_pause")
		button.setAttribute("color","#007bff")
		icon = document.createElement("a-image");
		icon.setAttribute("position","0.1 0.02 0.1")
		icon.setAttribute("id","icon");
		icon.setAttribute("src","#play");
		icon.setAttribute("width",1);
		icon.setAttribute("height",1);
		button.appendChild(icon);
		el.appendChild(button)
		
		video = document.querySelector(data.video_id)
		video.muted = true
		video.onended = () => { 
			data.playing = false;
			icon = button.querySelector("#icon");
			button.removeChild(icon);
			icon = document.createElement("a-image");
			icon.setAttribute("id","icon")
			icon.setAttribute("position","0.1 0.02 0.1")
			icon.setAttribute("src","#play");
			icon.setAttribute("width",1);
			icon.setAttribute("height",1);
			button.appendChild(icon);
		};
		
	},
	update : function ()
	{
		var data = this.data;
		var el = this.el;
		
		button = el.querySelector("#play_pause")
		button.addEventListener('click',() => {
			let video = document.querySelector(data.video_id);
			if(!data.playing){ 
				icon = button.querySelector("#icon");
				button.removeChild(icon);
				icon = document.createElement("a-image");
				icon.setAttribute("id","icon");
				icon.setAttribute("position","0 0 0.1")
				icon.setAttribute("src","#pause");
				icon.setAttribute("width",1);
				icon.setAttribute("height",1);
				button.appendChild(icon);
				video.play();
			}
			else
			{
				icon = button.querySelector("#icon");
				button.removeChild(icon);
				icon = document.createElement("a-image");
				icon.setAttribute("id","icon")
				icon.setAttribute("position","0.1 0.02 0.1")
				icon.setAttribute("src","#play");
				icon.setAttribute("width",1);
				icon.setAttribute("height",1);
				button.appendChild(icon);
				video.pause();
			}
			data.playing = !data.playing;
		})
		
		button.addEventListener('mouseenter',() => {
			button.setAttribute("color","#000000");
			button.setAttribute("opacity",0.8);
			button.setAttribute("transparent",true);
		})
		
		button.addEventListener('mouseleave',() => {
			button.setAttribute("color","#007bff");
			button.setAttribute("transparent",false);
		})
		
	}
});
