//顶部时间
var start = null;
start = setTimeout(topTime, 500);//开始执行

function topTime() {
    clearTimeout(start);//清除定时器

    nowDate = new Date();

    var y = nowDate.getYear() + 1900;
    var mm = nowDate.getMonth() + 1;
    var d = nowDate.getDate();
    var weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

    var day = nowDate.getDay();
    var h = nowDate.getHours();
    var m = nowDate.getMinutes();
    var s = nowDate.getSeconds();

    if (h < 10) {
        h = "0" + h;
    }
    if (m < 10) {
        m = "0" + m;
    }
    if (s < 10) {
        s = "0" + s;
    }
    //计算周期
    var sDate = new Date(2019, 2, 18);//学期起始时间
    sDate.setMonth(sDate.getMonth() - 1);
    var cDate = nowDate - sDate;
    var cDay = Math.floor(cDate / (3600 * 24 * 1000));
    var weeks = parseInt(cDay / 7) + 1;

    //输出信息
    document.getElementById("timeShow").innerHTML = "当前时间&nbsp" + y + "年" + mm + "月" + d + "日" + weekday[day] + "&nbsp" + h + ":" + m + ":" + s + "&nbsp" + "本学期第" + weeks + "周";
    //选择课表
    curriculumSwitch(nowDate);
    //设定定时器，循环执行
    start = setTimeout(topTime, 500);
}


function curriculumSwitch(nowDate){
    /*
        选择父系Css
        $('#room11').parent('.class').css("backgroundColor","#FFCCCC");
        */

    //获取当前时间
    //.setHours(hour,min,sec,millisec)
    var day = nowDate.getDay();
    var nowTime = new Date();
    nowTime.setHours(nowDate.getHours(), nowDate.getMinutes());

    //设置上课下课时间
    var SchoolTime1st = new Date();
    var BreakTime1st = new Date();
    SchoolTime1st.setHours(7, 50);
    BreakTime1st.setHours(9, 30);

    var SchoolTime2nd = new Date();
    var BreakTime2nd = new Date();
    SchoolTime2nd.setHours(9, 50);
    BreakTime2nd.setHours(11, 30);

    var SchoolTime3rd = new Date();
    var BreakTime3rd = new Date();
    SchoolTime3rd.setHours(14, 20);
    BreakTime3rd.setHours(16, 0);

    var SchoolTime4th = new Date();
    var BreakTime4th = new Date();
    SchoolTime4th.setHours(16, 10);
    BreakTime4th.setHours(17, 50);

    var SchoolTime5th = new Date();
    var BreakTime5th = new Date();
    SchoolTime5th.setHours(19, 0);
    BreakTime5th.setHours(20, 40);

    //判断时间
    var nowClass = 0;
    if (SchoolTime1st < nowTime && nowTime < BreakTime1st) {
        nowClass = 1;
    }
    if (SchoolTime2nd < nowTime && nowTime < BreakTime2nd) {
        nowClass = 2;
    }
    if (SchoolTime3rd < nowTime && nowTime < BreakTime3rd) {
        nowClass = 3;
    }
    if (SchoolTime4th < nowTime && nowTime < BreakTime4th) {
        nowClass = 4;
    }
    if (SchoolTime5th < nowTime && nowTime < BreakTime5th) {
        nowClass = 5;
    }

    var nowWeek = 0;
    switch (day) {
        case 0:
            nowWeek = 7;
            break;
        case 1:
            nowWeek = 1;
            break;
        case 2:
            nowWeek = 2;
            break;
        case 3:
            nowWeek = 3;
            break;
        case 4:
            nowWeek = 4;
            break;
        case 5:
            nowWeek = 5;
            break;
        case 6:
            nowWeek = 6;
            break;
    }

    var nowroom = "#class" + nowWeek + nowClass;
    $(nowroom).parent('.class').css("backgroundColor", "#FFCCCC");

}