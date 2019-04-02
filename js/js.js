//启动设置
var onlyRun = 0;
var start = null;
start = setTimeout(topTime, 500);//开始执行
//顶部时间
function topTime() {
    clearTimeout(start);//清除定时器

    //读取课表xml
    if (onlyRun == 0) {
        ReadCurriculumXML();
    }
    

    nowDate = new Date();

    var nowYear = nowDate.getYear() + 1900;
    var nowMonth = nowDate.getMonth() + 1;
    var nowDay = nowDate.getDate();
    var Weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

    var nowWeek = nowDate.getDay();
    var nowHour = nowDate.getHours();
    var nowMinute = nowDate.getMinutes();
    var nowSecond = nowDate.getSeconds();

    if (nowHour < 10) {
        nowHour = "0" + nowHour;
    }
    if (nowMinute < 10) {
        nowMinute = "0" + nowMinute;
    }
    if (nowSecond < 10) {
        nowSecond = "0" + nowSecond;
    }
    //计算周期
    var startDate = new Date(2019, 2, 18);//学期起始时间
    startDate.setMonth(startDate.getMonth() - 1);
    var differenceDate = nowDate - startDate;
    var cDay = Math.floor(differenceDate / (3600 * 24 * 1000));
    var weeks = parseInt(cDay / 7) + 1;

    //输出信息
    document.getElementById("timeShow").innerHTML = "当前时间&nbsp" + nowYear + "年" + nowMonth + "月" + nowDay + "日" + Weekday[nowWeek] + "&nbsp" + nowHour + ":" + nowMinute + ":" + nowSecond + "&nbsp" + "本学期第" + weeks + "周";

    //选择课表 判断夏冬季作息时间
    curriculumSwitch(nowDate);

    //单独执行一次
    if (onlyRun == 0) {
        //格式化课表
        curriculumFormat();
        //判断单双周
        coursesSwitch(weeks);
        //判断课程时间是否在周次内
        classSwitchTime(weeks);

        onlyRun = 1;
    }
    //设定定时器，循环执行
    start = setTimeout(topTime, 500);
}

//选择课表
function curriculumSwitch(nowDate){
    /*
        选择父系Css
        $('#room11').parent('.class').css("backgroundColor","#FFCCCC");
        */

    //获取当前时间
    //.setHours(hour,min,sec,millisec)
    //获取周次
    var day = nowDate.getDay();
    //获取时间
    var nowTime = new Date();
    nowTime.setHours(nowDate.getHours(), nowDate.getMinutes());

    //设置冬季作息时间
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


    //转换夏季作息时间
    //判断时间处于夏季作息时间
    var nowMonth = nowDate.getMonth() + 1;
    if (nowMonth >= 5 && nowMonth < 10) {
        //设置夏季下午课程时间
        SchoolTime3rd.setHours(14, 40);
        BreakTime3rd.setHours(16, 20);
        SchoolTime4th.setHours(16, 30);
        BreakTime4th.setHours(18, 10);
        //修改表格作息时间
        $('#APreparationTime').html('14:30');
        $('#Time5th').html('14:40-15:25');
        $('#Time6th').html('15:35-16:20');
        $('#Time7th').html('16:30-17:15');
        $('#Time8th').html('17:25-18:10');
    }


    //判断时间
    var nowClass = 0;
    if (SchoolTime1st <= nowTime && nowTime <= BreakTime1st) {
        nowClass = 1;
    }
    if (SchoolTime2nd <= nowTime && nowTime <= BreakTime2nd) {
        nowClass = 2;
    }
    if (SchoolTime3rd <= nowTime && nowTime <= BreakTime3rd) {
        nowClass = 3;
    }
    if (SchoolTime4th <= nowTime && nowTime <= BreakTime4th) {
        nowClass = 4;
    }
    if (SchoolTime5th <= nowTime && nowTime <= BreakTime5th) {
        nowClass = 5;
    }
    //判断星期
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

//修改课表清空格式化NULL内容
function curriculumFormat() {
    //选择课程教室
    for (var week = 1; week <= 7; week++) {
        for (var course = 1; course <= 5; course++) {
            var classReturn = "#class" + week + course;
            var roomReturn = "#room" + week + course;
            //判断是非为NULL
            //var classText = document.getElementById(classReturn);
            var classText = $(classReturn).text();
            if (classText == "NULL") {
                $(classReturn).css("display", "none");
            }
            //var roomText = document.getElementById(roomReturn);
            var roomText = $(roomReturn).text();
            if (roomText == "NULL") {
                $(roomReturn).css("display", "none");
            }
        }
    }
}

//判断单双周课程
function coursesSwitch(weeks) {
    //判断单双周
    if (weeks % 2 == 0) {
        //双周
        //遍历课程classXX
        for (var week = 1; week <= 7; week++) {
            for (var course = 1; course <= 5; course++) {
                //制作ID
                var courseReturn = "#class" + week + course;
                var roomReturn = "#room" + week + course;
                //读取ID对应P标签的内容
                var classText = $(courseReturn).text();
                //判断是否有相反的"单周"内容
                if (classText.indexOf("单") != -1) {
                    $(courseReturn).css("display","none");
                    $(roomReturn).css("display", "none");
                }
            }
        }
    } else {
        //单周
        //遍历课程classXX
        for (var week = 1; week <= 7; week++) {
            for (var course = 1; course <= 5; course++) {
                //制作ID
                var courseReturn = "#class" + week + course;
                var roomReturn = "#room" + week + course;
                //读取ID对应P标签的内容
                var classText = $(courseReturn).text();
                //判断是否有相反的"双周"内容
                if (classText.indexOf("双") != -1) {
                    $(courseReturn).css("display", "none");
                    $(roomReturn).css("display", "none");
                }
            }
        }
    }
}

//判断课程时间是否在周次内
function classSwitchTime(weeks) {
    //遍历课程classXX
    for (var week = 1; week <= 7; week++) {
        for (var course = 1; course <= 5; course++) {
            //制作ID
            var courseReturn = "#class" + week + course;
            var roomReturn = "#room" + week + course;
            //读取ID对应span.startweek标签的内容
            var s = $(courseReturn).text();
            var startWeek = $(courseReturn).children(".startweek").text();
            var endWeek = $(courseReturn).children(".endweek").text();
            if (s != "NULL") {
                if (startWeek <= weeks && weeks <= endWeek) {

                } else {
                    $(courseReturn).css("display", "none");
                    $(roomReturn).css("display", "none");
                }
            }
        }
    }
}

//读取课表XML
function ReadCurriculumXML() {
    $.ajax({
        url: "https://160512.github.io/MyLoveWeb/XML/Curriculum.xml",
        dataType: 'xml',
        type: 'GET',
        timeout: 2000,
        error: function (xml) {
            alert("!!!加载XML文件出错!!!联系老公！！！");
        },
        success: function (xml) {
            //console.log();

            $(xml).find("Week").each(function (i) {//查找所有Week节点并遍历
                var weekNumber = $(this).attr("week");//获取周次
                $(xml).find("class").each(function (j) {//查找所有class节点并遍历

                    //var class_id = $(this).children("class");//获得子节点
                    var classNumber = $(this).attr("class");//获取节次
                    var startWeekNumber = $(this).attr("startWeek");//获取开始周次
                    var endWeekNumber = $(this).attr("endWeek");//获取结束周次
                    var OoTSwitch = $(this).attr("OoT");//获取单双周或者全周
                    var room = $(this).attr("room");//获取教室
                    var className = $(this).text();//获取课程

                    //获取修改单双周
                    switch (OoTSwitch) {
                        case 'O':
                            var OoTText = "单周";
                            break;
                        case 'T':
                            var OoTText = "双周";
                            break;
                        case 'A':
                            var OoTText = "周";
                            break;
                        case 'L':
                            var OoTText = "临时";
                            break;
                    }

                    console.log("第" + weekNumber + "周，第" + classNumber + "节" + startWeekNumber + "-" + endWeekNumber + OoTText + "在" + room + "上" + className);
                });
            });
        }
    });
}

