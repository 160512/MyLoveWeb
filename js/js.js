//顶部时间
var t = null;
t = setTimeout(time, 500);//开始执行

function time() {
    clearTimeout(t);//清除定时器

    dt = new Date();

    var y = dt.getYear() + 1900;
    var mm = dt.getMonth() + 1;
    var d = dt.getDate();
    var weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

    var day = dt.getDay();
    var h = dt.getHours();
    var m = dt.getMinutes();
    var s = dt.getSeconds();

    if (h < 10) {
        h = "0" + h;
    }
    if (m < 10) {
        m = "0" + m;
    }
    if (s < 10) {
        s = "0" + s;
    }

    var sDate = new Date(2019, 2, 18);//学期起始时间
    sDate.setMonth(sDate.getMonth() - 1);
    var cDate = dt - sDate;


    var cDay = Math.floor(cDate / (3600 * 24 * 1000));

    var weeks = parseInt(cDay / 7) + 1;


    document.getElementById("timeShow").innerHTML = "当前时间&nbsp" + y + "年" + mm + "月" + d + "日" + weekday[day] + "&nbsp" + h + ":" + m + ":" + s + "&nbsp" + "本学期第" + weeks + "周";

    /*
    选择父系Css
    $('#room11').parent('.class').css("backgroundColor","#FFCCCC");
    */


    var ch = dt.getHours();
    var cm = dt.getMinutes();













    t = setTimeout(time, 500); //设定定时器，循环执行 
}