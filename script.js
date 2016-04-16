$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results[1] || 0;
}

console.log($.urlParam('topic'));

var topic = decodeURIComponent($.urlParam('topic').replace(/\+/g, '%20'));

console.log(topic);

$(".topic").html(topic);

$('.menu .item').tab('change tab', 'sanders');

$('.ui.dropdown').dropdown();