//启动设置
var OnlyRun = 0;
var start = null;
start = setTimeout(topTime, 500);//开始执行
//顶部时间
function topTime() {
    clearTimeout(start);//清除定时器

    if (OnlyRun == 0) {
        //格式化课表
        curriculumFormat();
        //读取课表XML显示课表
        ReadCurriculumXML();

        OnlyRun++; 
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
   
     //判断单双周
     coursesSwitch(weeks);
     //判断课程时间是否在周次内
     classSwitchTime(weeks);
     //选择课表 判断夏冬季作息时间
     curriculumSwitch(nowDate);

    //设定定时器，循环执行
    start = setTimeout(topTime, 500);
}


//格式化表格
function curriculumFormat() {
    //选择课程教室并清空显示
    for (var week = 1; week <= 7; week++) {
        for (var course = 1; course <= 5; course++) {
            var classTag = "#class" + week + course;
            var roomTag = "#room" + week + course;
            //var classText = document.getElementById(classReturn);
            $(classTag).css("display", "none");
            $(roomTag).css("display", "none");
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
                $(this).find("class").each(function (j) {//查找当前周次所有class节点并遍历

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

                    //制作标签
                    var classTag = "#class" + weekNumber + classNumber;
                    var roomTag = "#room" + weekNumber + classNumber;

                    //判断是否有课程
                    if (className == "NULL") {//没有课程
                        $(classTag).text(className);
                        $(roomTag).text(room);
                    } else {//有课程
                        //e.g
                        //<p id="class25">选修食品<span class="startweek">4</span>-<span class="endweek">12</span>周<p id="room25">@北阶104</td>
                        $(classTag).html(className + "<span class=\"startweek\">" + startWeekNumber + "</span>-<span class=\"endweek\">" + endWeekNumber + "</span>" + OoTText);
                        $(roomTag).text("@" + room);

                        //显示列表
                        $(classTag).css("display", "block");
                        $(roomTag).css("display", "block");
                    }
                });
            });
        }
    });
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
                var ClassTag = "#class" + week + course;
                var roomTag = "#room" + week + course;
                //读取ID对应P标签的内容
                var classText = $(ClassTag).text();
                //判断是否有相反的"单周"内容
                if (classText.indexOf("单") != -1) {
                    $(ClassTag).css("display","none");
                    $(roomTag).css("display", "none");
                }
            }
        }
    } else {
        //单周
        //遍历课程classXX
        for (var week = 1; week <= 7; week++) {
            for (var course = 1; course <= 5; course++) {
                //制作ID
                var ClassTag = "#class" + week + course;
                var roomTag = "#room" + week + course;
                //读取ID对应P标签的内容
                var classText = $(ClassTag).text();
                //判断是否有相反的"双周"内容
                if (classText.indexOf("双") != -1) {
                    $(ClassTag).css("display", "none");
                    $(roomTag).css("display", "none");
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
            var ClassTag = "#class" + week + course;
            var roomTag = "#room" + week + course;
            //读取ID对应span.startweek标签的内容
            var s = $(ClassTag).text();
            var startWeek = $(ClassTag).children(".startweek").text();
            var endWeek = $(ClassTag).children(".endweek").text();
            if (s != "NULL") {
                if (startWeek <= weeks && weeks <= endWeek) {

                } else {
                    $(ClassTag).css("display", "none");
                    $(roomTag).css("display", "none");
                }
            }
        }
    }
}

//选择课表
function curriculumSwitch(nowDate) {
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

