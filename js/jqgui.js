(function( $ ){
		/**
		 * Command line prompt plugin. Emulates simple linux style command line prompt
		 */
		$.fn.jqgui = function( custom ) {

				$this = $(this);

				var settings = $.extend( {
					// The file system json object to act as the file tree
					"fileTree" : {},
				}, custom);


				var buildView= function(fileTree) {
						$("#fileSystem ul").empty();
						for(i in fileTree)
						{
								if(i != "_files")
								{
										$("#fileSystem ul").append("<li class='folder' data-name='"+i+"'><p>"+i+"</p></li>");
								}
						}
						for(j in fileTree._files)
						{
								if(j[0] != ".")
								{
										$("#fileSystem ul").append("<li class='file' data-name='"+i+"'><p>"+j+"</p></li>");
								}
						}
						
						$("#fileSystem ul li").attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false);
						$("#fileSystem ul li.folder").on("dblclick", function(e) {
								var position = $(this).children("p").text();
								$(".inputBox").val($(".inputBox").val() + position + "/");
								buildView(fileTree[position]);
						});
						$("#fileSystem ul li.file").on("dblclick", function(e) {
								var position = $(this).children("p").text();
								$(this).removeClass("selected");
								if(fileTree._files[position].execute)
								{
										fileTree._files[position].execute();
								}
								
						});
						$("#fileSystem ul li").on("click", function(e) {
								if(e.shiftKey == false)
								{
									 var heldDown = false;
									 if(navigator.platform.match(/win/gi))
									 {
											 heldDown = e.ctrlKey;
									 }
									 else
									 {
											 heldDown = e.metaKey;
									 }
				
										if(!heldDown)
										{
												$(".selected").removeClass("selected");
														
										}
										if($(this).hasClass('selected'))
										{
												$(this).removeClass('selected')        
										}        
										else
										{
												$(this).addClass('selected');        
										}
								}
								else
								{
										$from = $lastSelected;
										$to = $(this);
										
										var firstIndex = $('#fileSystem ul li').index($from);
										var lastIndex = $('#fileSystem ul li').index($to);
										
										var $selected = $from;
														
										if(firstIndex < lastIndex)
										{
												for(x = $('#fileSystem ul li').index($from); x <= $('#fileSystem ul li').index($to); x++)
												{
														$selected.addClass("selected");
														$selected = $selected.next();
												}
										}
										else
										{
												for(x = $('#fileSystem ul li').index($from); x >= $('#fileSystem ul li').index($to); x--)
												{
														$selected.addClass("selected");
														$selected = $selected.prev();
												}
										}
								}
								$lastSelected = $(this);
						});
				
				}
		
				$this.html('<ul class="controls"><li class="back"></li><li class="forward"></li></ul><input type="text" disabled="disabled" class="inputBox" value="/" /><div id="fileSystem"><ul></ul></div>')

				buildView(settings.fileTree);
				
				
				$("body").on("click", function(e) {
						if( !$( event.target ).is( "li" ) )
						{
								$(".selected").removeClass("selected");
						}
				});
				$(".controls .back").on("click", function() {
					 var position = $(".inputBox").val();
					 if(position != "/")
					 {
							 var broken = position.split("/");
							 broken.pop();
							 broken.pop();
													
							 if(broken.length > 1)
							 {
									 $(".inputBox").val(broken.join("/") + "/");
									 var newLocation = settings.fileTree;
									 broken.shift();
									 for(i in broken)
									 {
											newLocation = newLocation[broken[i]];
									 }
									 buildView(newLocation);            
							 }
							 else
							 {
									 buildView(settings.fileTree);
									 $(".inputBox").val("/");
							 }
					 }           
				});
				$this.bind("contextmenu",function(e){
						if(e.toElement);
						$this.append('<div id="menu"><ul><li><a href="#" id="newFolder">New Folder</a></li></ul></div>');
						$("#menu").css({"left" : e.clientX, "top" : e.clientY});
						$("#newFolder").on("click", function(e) {
							 e.preventDefault();
							 $("#fileSystem ul").append("<li class='folder'><p><input type='text' /></p></li>");
								$("#fileSystem ul li input[type=text]").val("untitled folder").focus().select().blur(function(e) {
									 $(this).parent().text($(this).val());
									 var position = $(".inputBox").val();
									 if(position != "/")
									 {
											 var broken = position.split("/");
											 broken.pop();
											 broken.shift();
											 var newLocation = settings.fileTree;
											 for(i in broken)
											 {
													newLocation = newLocation[broken[i]];
											 }
											 newLocation[$(this).val()] = {};
											 buildView(newLocation);   
									 }
									 else
									 {
											 settings.fileTree[$(this).val()] = {};
											 buildView(settings.fileTree);
									 }
								});
						});
						return false;
				});
				$this.bind("click",function(e){
						$("#menu").remove();
				});
		};
})( jQuery );