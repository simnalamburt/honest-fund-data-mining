var data = {};

data.location = {};
if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(pos){
        data.location.latitude = pos.coords.latitude;
        data.location.longitude = pos.coords.longitude;
    });
}

// mine keystroke by onkeydown event
data.keystroke = {};
data.keystroke.time = [];
data.keystroke.key = [];
data.keystroke.id = [];
document.onkeydown = function(evt){
    data.keystroke.time.push(evt.timeStamp);
    data.keystroke.key.push(evt.keyCode);
    data.keystroke.id.push(evt.target.id);
};

// mine scroll by onscroll event
data.scroll = {};
data.scroll.time = [];
data.scroll.pos = [];
var prevPos = -64;
var prevTime = 0;
document.onscroll = function(evt){
    if(Date.now() - prevTime > 1000 &&
       Math.abs(prevPos - window.scrollY) > 32){
        data.scroll.time.push(evt.timeStamp);
        data.scroll.pos.push(window.scrollY);
        prevPos = window.scrollY;
        prevTime = Date.now();
    }
};

// mine highlight and click by onmouseup event
data.highlight = [];
data.click = {};
data.click.time = [];
data.click.id = [];
document.onmouseup = function(evt){
    var text;
    if(window.getSelection){
        text = window.getSelection().toString();
    }else if(document.selection && document.selection.type !== "Control"){
        text = document.selection.createRange().text;
    }
    if(text.length !== 0){
        data.highlight.push(text.substring(0, 32));
    }
    if(evt.target.id.length !== 0){
        data.click.time.push(evt.timeStamp);
        data.click.id.push(evt.target.id);
    }
};
data.monitor = {
    width: screen.width,
    height: screen.height
};
data.window = {
    width: window.innerWidth,
    height: window.innerHeight
};
window.onbeforeunload = function(){
    data.timestamp_exit = Date.now();
    var contact = document.getElementById("contact");
    if(contact){
        data.contact = contact.value;
    }
    $.ajax({
        method: 'POST',
        url: '/data',
        contentType: 'application/json',
        data: JSON.stringify(data),
        async: false
    });
};
