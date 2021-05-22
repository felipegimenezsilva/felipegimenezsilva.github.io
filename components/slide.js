AFRAME.registerComponent('slide_content',{
	schema:
	{ 
		json : 
		{ 
			type : "string" , 
			default : "{}",
		},
	},
	init : function () 
	{
		
		var data = this.data;
		var el = this.el;
		json = JSON.parse(data.json)		
		data.actual_slide = 0 ;
		content = document.createElement('a-entity');
		
		// creating background of content and buttons
		slide_background = document.createElement('a-plane')
		slide_background.setAttribute("id","content_background")
		slide_background.setAttribute("height",json.size.height)
		slide_background.setAttribute("width",json.size.width)
		slide_background.setAttribute("position","0 "+(-json.size.height*0.5-0.6)+" 0")
		slide_background.setAttribute("color","#000000")
		slide_background.setAttribute("opacity","0.8")
		slide_background.setAttribute("transparent",false)
		
		// change title bar
		window_title = el.parentElement.querySelector("a-text")
		window_title.setAttribute("value",json.slides[data.actual_slide].title)
		
		// show first content text TODO
		first_content = json.slides[0] ;
		
		image_content = document.createElement('a-image');
		image_content.setAttribute("position","0 0 0.02");
		
		text_content = document.createElement('a-text');
		text_content.setAttribute("position","0 0 0.2");
		text_content.setAttribute("value","first slide")
		text_content.setAttribute("width","12")
		text_content.setAttribute("align","center");
		
		if (first_content.type == "text")
		{
			text_content.setAttribute("value",first_content.value)
			text_content.setAttribute("width",first_content.size)
			text_content.setAttribute("visible",true)
			image_content.setAttribute("visible",false)
		}
		else if (first_content.type == "image")
		{
			image_content.setAttribute("src",first_content.url)
			image_content.setAttribute("width",first_content.width)
			image_content.setAttribute("height",first_content.height)
			image_content.setAttribute("visible",true);
			text_content.setAttribute("visible",false)
		}
		
		slide_background.appendChild(text_content)	
		slide_background.appendChild(image_content)
		
		// left button to next content slide
		left = document.createElement('a-plane')
		left.setAttribute("id","left_button")
		left.setAttribute("height",1)
		left.setAttribute("width",1)
		left.setAttribute("position","-1 "+(-json.size.height*0.5+0.5)+" 0.03")
		left.setAttribute("color","#000000")
		left.setAttribute("opacity","0.8")
		left.setAttribute("transparent",true)
		
		
		left_text = document.createElement("a-text");
		left_text.setAttribute("value","<");
		left_text.setAttribute("align","center");
		left_text.setAttribute("width",12);
		left_text.setAttribute("position","0 0 0.2")
		
		left.appendChild(left_text)
		slide_background.appendChild(left)
		
		// right button to previus content slide
		right = document.createElement('a-plane')
		right.setAttribute("id","right_button")
		right.setAttribute("height",1)
		right.setAttribute("width",1)
		right.setAttribute("position","1 "+(-json.size.height*0.5+0.5)+" 0.03")
		right.setAttribute("color","#000000")
		right.setAttribute("opacity","0.8")
		right.setAttribute("transparent",true)
		
		right_text = document.createElement("a-text");
		right_text.setAttribute("value",">");
		right_text.setAttribute("align","center");
		right_text.setAttribute("width",12);
		right_text.setAttribute("position","0 0 0.2")
		
		right.appendChild(right_text)
		slide_background.appendChild(right)
		
		num = document.createElement('a-plane')
		num.setAttribute("height",1)
		num.setAttribute("width",1)
		num.setAttribute("position","0 "+(-json.size.height*0.5+0.5)+" 0.03")
		num.setAttribute("color","#000000")
		num.setAttribute("opacity","0.8")
		num.setAttribute("transparent",true)
		
		slide_number = document.createElement('a-text')
		slide_number.setAttribute("id","slide_counter")
		slide_number.setAttribute('size',8)
		slide_number.setAttribute('position',"0 0 0.2")
		slide_number.setAttribute('align','center')
		slide_number.setAttribute('value',"1/"+json.slides.length)
		
		num.appendChild(slide_number)
		slide_background.appendChild(num)
		content.appendChild(slide_background)
		el.appendChild(content)
	},
	update : function ()
	{
		var data = this.data;
		var el = this.el;
		
		function update_content()
		{
			content = el.querySelector("a-entity");			
			content = content.querySelector("a-plane");	
			text_content = content.querySelector("a-text");
			image_content = content.querySelector("a-image");
			content_data = json.slides[data.actual_slide]
			
			if (content_data.type == "text")
			{
				image_content.setAttribute("visible",false);
				text_content.setAttribute("visible",true);
				text_content.setAttribute("value",content_data.value);
				text_content.setAttribute("width",content_data.size);
			}
			else if (content_data.type == "image")
			{
				text_content.setAttribute("visible",false);
				image_content.setAttribute("visible",true);
				image_content.setAttribute("src",content_data.url);
				image_content.setAttribute("width",content_data.width);
				image_content.setAttribute("height",content_data.height);
			}
			
			slide_number = el.querySelector("#slide_counter")
			slide_number.setAttribute("value",(data.actual_slide+1)+"/"+json.slides.length)
			window_title = el.parentElement.querySelector("a-text")
			window_title.setAttribute("value",json.slides[data.actual_slide].title)
		}
		
		function enter(element)
		{
			element.setAttribute("color","#007bff");	
		}
		
		function leave(element)
		{
			element.setAttribute("color","#000000");
		}
		
		function click(increment)
		{
			next = data.actual_slide + increment
			if (next < 0 ) { next = json.slides.length -1 };
			if (next >= json.slides.length) { next = 0 };
			data.actual_slide = next ;
			update_content();
		}
		
		buttons = el.querySelector("a-entity").querySelector("a-plane")
		buttons = buttons.querySelectorAll("a-plane");
		
		left = buttons[0]
		right= buttons[1]
		
		left.addEventListener('mouseenter', function() {enter(left);})
		left.addEventListener('mouseleave', function() {leave(left);})
		left.addEventListener('click', function() { click(-1);} )
		right.addEventListener('mouseenter', function() {enter(right);})
		right.addEventListener('mouseleave', function() {leave(right);})
		right.addEventListener('click', function() {click(1);})
		
		// Auto change slide
		window.addEventListener('VideoTimelapse', (e) => {
		  	if(el.parentElement){
		  	data.actual_slide = e.detail
		  	update_content()
		  	}
		})
		
	},
})

AFRAME.registerComponent('a-slide', {
	schema:{
		name : 
		{ 
			type : 'string' , 
			default : "sample"
		},
		width : 
		{ 
			type : 'int' , 
			default : 5 
		},
		height : 
		{ 
			type : 'int' , 
			default : 5 
		},
		json : {
			type : "string" ,
			default : '{}'
		}
	},
	
	init: function () 
	{
		var el = this.el;
		var data = this.data;
		json = JSON.parse(data.json);
		
		el.setAttribute("position",json.position)
		el.setAttribute("rotation",json.rotation)
		
		// put a "?" at center of box
		interrogation = document.createElement('a-text');
		interrogation.setAttribute("position","0 0 0.1")
		interrogation.setAttribute("value","?");
		interrogation.setAttribute("width",12);
		interrogation.setAttribute("align","center");
		
		bar = document.createElement("a-plane")
		bar.setAttribute("width","1 1 1")
		bar.setAttribute("color","#007bff")
		bar.appendChild(interrogation);	
		el.appendChild(bar);
		
	},
	
	update : function () 
	{
		var data = this.data
  		var el = this.el	
		
		bar = el.querySelector("a-plane")
  		
  		// event when mouse enter in the plane
  		bar.addEventListener('mouseenter', function() {
  			
  			collapse = el.querySelectorAll('a-text')[1];
  			expand = !collapse ;
  			
  			// if "expand" opption is available 
  			if ( expand ) {
	  			
	  			// change color and size of pane
	  			bar.setAttribute("color","#000000")
		  		bar.setAttribute("opacity",0.8)
		  		bar.setAttribute("transparent",true)
		  		bar.setAttribute("width",json.size.width+" 1 1")
		  		
		  		// change "?"(icon) to "title"
		  		text = bar.querySelector('a-text');
		  		text.setAttribute("value",json.title);  
		  		
		  		// includes an "collapse icon" 
		  		collapse = document.createElement('a-text');
		  		collapse.setAttribute("position",(json.size.width/2-0.55)+" 0 0.01");
		  		collapse.setAttribute("width",12);
		  		collapse.setAttribute("value","+");
		  		collapse.setAttribute("align","center");
		  		bar.appendChild(collapse);
	  		}
  		});
  		
  		// event when mouse leave the plane
  		bar.addEventListener('mouseleave', function() {
  			
			collapse = bar.querySelectorAll('a-text')[1];
			
			// if collapse is available
			if (collapse.getAttribute("value") == "+")
			{
				// change color and size of plane
				bar.setAttribute("width","1 1 1");
	  			bar.setAttribute("color","#007bff");
	  			bar.setAttribute("transparent",false);
	  			
				// change "title" to "?" (icon)
		  		text = bar.querySelector('a-text');
		  		text.setAttribute("value","?");
		  		//text = bar.querySelector('a-text');
		  		
		  		// remove "collapse icon"
		  		bar.removeChild(collapse);
			}
  		});
  		
  		// event when user clicks in the plane
  		bar.addEventListener('click', function() {
  			collapse = bar.querySelectorAll('a-text')[1]
  			var value = collapse.getAttribute("value")
  			
  			// expand is available
  			if (value == "+"){
  				
  				bar.setAttribute("color","#007bff");
  				bar.setAttribute("transparent",false);
  				  				
  				// locking events (mouse enter and leave)
  				collapse.setAttribute('value','-');
  				
  				// creating slide components (content and buttons)
  				content = document.createElement('a-entity')
  				content.setAttribute("id","content")
  				content.setAttribute("slide_content","json:"+data.json)
  				el.appendChild(content)	
  			}
  			// collapse is availale
  			else
  			{
  				// change bar color
  				bar.setAttribute("color","#000000");
  				bar.setAttribute("transparent",true);
  				  				
  				// unlocking events (mouse enter and leave)
  				collapse.setAttribute('value','+');
  				
  				// removing content
  				slide_content = el.querySelector("a-entity");
  				el.removeChild(slide_content);
  				
  				// change "slide_title" to "title"
		  		text = bar.querySelector('a-text');
		  		text.setAttribute("value",json.title); 
  			}
  		})		
  		
  		
		// sync video time and slides  
  		// sync video time and slides  
  		video = document.querySelector(json.video_id)
  		
		// The user moved the slider, reset the 'triggered' property back to false
		video.addEventListener('seeked', () => json.slides.forEach(i => {i.triggered = false}))
		
  				// Watch for currentTime changes
		video.addEventListener('timeupdate', () => {
		  // Find the time to be triggered
		  let time = json.slides.find(i => i.second == Math.floor(video.currentTime) && !i.triggered)
		  if (time) {
			// A time was found that hasn't been triggered
			time.triggered = true
			detail = { detail : json.slides.indexOf(time) }
			// Send the event to the window
			window.dispatchEvent(new CustomEvent('VideoTimelapse', detail ))
		  }
		})
		
		
		
	}
});
