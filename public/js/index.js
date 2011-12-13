function clear_blink(oldTitle) {
				clearInterval(g_timeout_id);
				g_timeout_id = null;
				document.title = oldTitle;
				document.onmousemove = null;
				document.onkeydown = null;
			}
			function blink_info(msg) {
				var oldTitle = document.title;
				if (typeof(g_timeout_id) != "undefined" && g_timeout_id) {
					clearInterval(g_timeout_id);
				}
				g_timeout_id = setInterval(function() {
					document.title = document.title == msg ? ' ' : msg;
					msg=msg.substr(1)+msg.charAt(0);	
				}, 100);
				document.onmousemove = function() { clear_blink(oldTitle); };
				document.onkeydown = function() { clear_blink(oldTitle); };
			}
			$(document).ready(function(){
				var socket=io.connect('http://127.0.0.1:8000');
				var box=null;
				var name=prompt("你想叫什么？","请在这里输入");

				if(box){
					box.chatbox("option","boxManager").toggleBox();
				}
				else
				box=$("#chatbox").chatbox({id:"chatbox",title:"To Admin",user:"client",hidden:"True",offset:200,
					messageSent:function(id,user,msg){
						socket.emit('from client',{id:name,msg:msg});
						box.chatbox("option","boxManager").addMsg(name,msg);
					}
				});
				socket.emit('new user',name);
				socket.on('from server',function(data){
					var user=data['id'];
					var msg=data['msg'];
					blink_info(user+'来消息了');
					box.chatbox("option","boxManager").addMsg(user,msg);
				});
			});
