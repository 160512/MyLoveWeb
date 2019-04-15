var OnlyRun = true;//单次循环
var fnCyclical = setTimeout(cyclicalFunction, 500);//设定定时器，开始执行

function cyclicalFunction() {//循环函数
    clearTimeout(fnCyclical);//清除定时器

    oNowDate = new Date();//获取当前时间
    setTopTime(oNowDate);//设置顶部时间

    if (OnlyRun == true) {//只执行一次判断
        setCurriculumFormat();//格式化课表
        loadCurriculumXML();//读取课表XML显示课表

        

        OnlyRun = false;//改变控制变量
    }

    setCoursesOoT(getWeeks(oNowDate));//判断单双周
    setCourseWithinWeek(getWeeks(oNowDate));//判断课程时间是否在周次内
    setNowLesson(oNowDate);//选择课表 判断夏冬季作息时间

    fnCyclical = setTimeout(cyclicalFunction, 500);//设定定时器，循环执行
}

//设置顶部时间
function setTopTime(oNowDate) {
    var iNowYear = oNowDate.getYear() + 1900;//获取年份
    var iNowMonth = oNowDate.getMonth() + 1;//获取月份
    var iNowDay = oNowDate.getDate();//获取日期

    var aWeekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];//创建星期数组
    var iNowWeek = oNowDate.getDay();//获取星期数

    var iNowHour = oNowDate.getHours();//获取小时
    var iNowMinute = oNowDate.getMinutes();//获取分钟
    var iNowSecond = oNowDate.getSeconds();//获取秒

    if (iNowHour < 10) {//判断小时是否小于10
        iNowHour = '0' + iNowHour;//加上字符0
    }
    if (iNowMinute < 10) {//判断分钟是否小于10
        iNowMinute = '0' + iNowMinute;//加上字符0
    }
    if (iNowSecond < 10) {//判断秒数是否小于10
        iNowSecond = '0' + iNowSecond;//加上字符0
    }

    var iCutWeeks = getWeeks(oNowDate);//获取周次

    //输出信息
    document.getElementById('timeShow').innerHTML = '当前时间&nbsp' + iNowYear + '年' + iNowMonth + '月' + iNowDay + '日' + aWeekday[iNowWeek] + '&nbsp' + iNowHour + ':' + iNowMinute + ':' + iNowSecond + '&nbsp' + '本学期第' + iCutWeeks + '周';
}

//获取周次
function getWeeks(oNowDate) {
    var oStartDate = new Date(2019, 2, 18);//学期起始时间
    oStartDate.setMonth(oStartDate.getMonth() - 1);//月份差值-1
    var oCutDate = oNowDate - oStartDate;//实际日期差
    var iCutDay = Math.floor(oCutDate / (3600 * 24 * 1000));//转换天数
    var iCutWeeks = parseInt(iCutDay / 7) + 1;//计算差日期
    return iCutWeeks;//返回周次
}

//获取课程标签e.g'#class11'
function getClassTag(iWeek, iLesson) {
    var sClassTag = '#class' + iWeek + iLesson;//制作标签
    return sClassTag;//返回值
}

//获取教室标签e.g'#room11'
function getRoomTag(iWeek, iLesson) {
    var sRoomTag = '#room' + iWeek + iLesson;//制作标签
    return sRoomTag;//返回值
}

function setCurriculumFormat() {//格式化表格
    for (var iWeek = 1; iWeek <= 7; iWeek++) {//选择课程教室并清空显示_周次选择
        for (var iLesson = 1; iLesson <= 5; iLesson++) {//选择课程教室并清空显示_节次选择
            var sClassTag = getClassTag(iWeek, iLesson);//获取课程标签
            var sRoomTag = getClassTag(iWeek, iLesson);//获取教室标签

            $(sClassTag).css('display', 'none');//设置标签不显示
            $(sRoomTag).css('display', 'none');
        }
    }
}

//console.log();
//读取加载课表XML
function loadCurriculumXML() {
    $.ajax({
        url: 'https://160512.github.io/MyLoveWeb/XML/Curriculum.xml',//发送请求的地址
        dataType: 'xml',//预期服务器返回的数据类型
        type: 'GET', //请求方式
        timeout: 2000,//设置请求超时时间
        error: function (xml) {//请求失败时调用此函数
            alert('!!!加载XML文件出错!!!联系老公！！！');
        },
        success: function (xml) {//请求成功后的回调函数
            $(xml).find('Week').each(function (i) {//查找所有Week节点并遍历
                var iWeekNumber = $(this).attr('week');//获取周次
                $(this).find('class').each(function (j) {//查找当前周次所有class节点并遍历

                    //var class_id = $(this).children('class');//获得子节点
                    var iClassNumber = $(this).attr('class');//获取节次
                    var iStartWeekNumber = $(this).attr('startWeek');//获取开始周次
                    var iEndWeekNumber = $(this).attr('endWeek');//获取结束周次
                    var sOoTSwitch = $(this).attr('OoT');//获取单双周或者全周
                    var sRoom = $(this).attr('room');//获取教室
                    var sClassName = $(this).text();//获取课程

                    switch (sOoTSwitch) {//获取修改单双周
                        case 'O':
                            var sOoTText = '单周';
                            break;
                        case 'T':
                            var sOoTText = '双周';
                            break;
                        case 'A':
                            var sOoTText = '周';
                            break;
                        case 'L':
                            var sOoTText = '临时';
                            break;
                    }

                    //制作标签
                    var sClassTag = getClassTag(iWeekNumber, iClassNumber);
                    var sRoomTag = getRoomTag(iWeekNumber, iClassNumber);

                    if (sClassName == 'NULL') {//没有课程
                        $(sClassTag).text(sClassName);
                        $(sRoomTag).text(sRoom);
                    } else {//有课程
                        //e.g.<p id="class25">选修食品<span class="startweek">4</span>-<span class="endweek">12</span>周<p id="room25">@北阶104</td>
                        $(sClassTag).html(sClassName + '<span class=\"startweek\">' + iStartWeekNumber + '</span>-<span class=\"endweek\">' + iEndWeekNumber + '</span>' + sOoTText);
                        $(sRoomTag).text('@' + sRoom);

                        $(sClassTag).css('display', 'block');//显示列表
                        $(sRoomTag).css('display', 'block');//显示列表
                    }
                });
            });
        }
    });
}

//判断是否含有'单''双'周关键字
function hasClassTagString(sClassTag) {
    var sClassText = $(sClassTag).text();//读取class标签内容
    if (sClassText.indexOf('单') != -1) {//判断单周
        return 1;
    }
    else if (sClassText.indexOf('双') != -1) {//判断双周
        return 2;
    }
    else {//全周
        return 0;
    }
}

//判断单双周课程清除非当前周次课程
function setCoursesOoT(iCutWeek) {
    if (iCutWeek % 2 == 0) {//当前是双周
        for (var iWeekNumber = 1; iWeekNumber <= 7; iWeekNumber++) {//遍历课程表_周次
            for (var iLessonNumber = 1; iLessonNumber <= 5; iLessonNumber++) {//遍历课程表_节次
                var sClassTag = getClassTag(iWeekNumber, iLessonNumber);//制作标签
                var iReturnValue = hasClassTagString(sClassTag);//获取判断返回值
                if (iReturnValue == 1) {//判断返回值
                    var sRoomTag = getRoomTag(iWeekNumber, iLessonNumber);//隐藏单周课程
                    $(sClassTag).css("display", "none");
                    $(sRoomTag).css("display", "none");
                }
            }
        }
    } else {//当前是单周
        for (var iWeekNumber = 1; iWeekNumber <= 7; iWeekNumber++) {//遍历课程表_周次
            for (var iLessonNumber = 1; iLessonNumber <= 5; iLessonNumber++) {//遍历课程表_节次
                var sClassTag = getClassTag(iWeekNumber, iLessonNumber);//制作标签
                var iReturnValue = hasClassTagString(sClassTag);//获取判断返回值
                if (iReturnValue == 2) {//判断返回值
                    var sRoomTag = getRoomTag(iWeekNumber, iLessonNumber);
                    $(sClassTag).css("display", "none");//隐藏双周课程
                    $(sRoomTag).css("display", "none");
                }
            }
        }
    }
}

//判断课程时间是否在周次内
function setCourseWithinWeek(iCutWeek) {
    for (var iWeekNumber = 1; iWeekNumber <= 7; iWeekNumber++) {//遍历课程表_周次
        for (var iLessonNumber = 1; iLessonNumber <= 5; iLessonNumber++) {//遍历课程表_节次
            var sClassTag = getClassTag(iWeekNumber, iLessonNumber);//制作class标签
            var sGetClassTagText = $(sClassTag).text();//读取class标签内容
            var iStartWeek = $(sClassTag).children(".startweek").text();//读取ID对应span.startweek标签的内容
            var iEndWeek = $(sClassTag).children(".endweek").text();//读取ID对应span.endweek标签的内容
            //console.log(iStartWeek);
            if (sGetClassTagText != "NULL") {//判断class标签有课程
                if (iStartWeek <= iCutWeek && iCutWeek <= iEndWeek) {//判断是否在周次内
                    //在周次内不执行
                } else {//不在周次内隐藏
                    var sRoomTag = getRoomTag(iWeekNumber, iLessonNumber);
                    $(sClassTag).css("display", "none");
                    $(sRoomTag).css("display", "none");
                }
            }
        }
    }
}

//选择课表
function setNowLesson(oNowDate) {
    var oNowTime = new Date();//创建时间对象
    oNowTime.setHours(oNowDate.getHours(), oNowDate.getMinutes());//获取时间

    //设置冬季作息时间
    var oSchoolTime1st = new Date();
    var oBreakTime1st = new Date();
    oSchoolTime1st.setHours(7, 50);
    oBreakTime1st.setHours(9, 30);

    var oSchoolTime2nd = new Date();
    var oBreakTime2nd = new Date();
    oSchoolTime2nd.setHours(9, 50);
    oBreakTime2nd.setHours(11, 30);

    var oSchoolTime3rd = new Date();
    var oBreakTime3rd = new Date();
    oSchoolTime3rd.setHours(14, 20);
    oBreakTime3rd.setHours(16, 0);

    var oSchoolTime4th = new Date();
    var oBreakTime4th = new Date();
    oSchoolTime4th.setHours(16, 10);
    oBreakTime4th.setHours(17, 50);

    var oSchoolTime5th = new Date();
    var oBreakTime5th = new Date();
    oSchoolTime5th.setHours(19, 0);
    oBreakTime5th.setHours(20, 40);


    //转换夏季作息时间
    //判断时间处于夏季作息时间
    var iNowMonth = oNowDate.getMonth() + 1;
    if (iNowMonth >= 5 && iNowMonth < 10) {
        //设置夏季下午课程时间
        oSchoolTime3rd.setHours(14, 40);
        oBreakTime3rd.setHours(16, 20);
        oSchoolTime4th.setHours(16, 30);
        oBreakTime4th.setHours(18, 10);
        //修改表格作息时间
        $('#APreparationTime').html('14:30');
        $('#Time5th').html('14:40-15:25');
        $('#Time6th').html('15:35-16:20');
        $('#Time7th').html('16:30-17:15');
        $('#Time8th').html('17:25-18:10');
    }


    //判断时间
    var iNowClass = 0;
    var iNextClass = 0;
    if (oNowTime < oSchoolTime1st) {//第一节课上课前
        iNextClass = 1;
    }
    if (oSchoolTime1st <= oNowTime && oNowTime <= oBreakTime1st) {//第一节课上课上课中
        iNowClass = 1;
        iNextClass = 2;
    }
    if (oBreakTime1st < oNowTime && oNowTime < oSchoolTime2nd) {//第一节课下课后第二节课上课前
        iNextClass = 2;
    }
    if (oSchoolTime2nd <= oNowTime && oNowTime <= oBreakTime2nd) {//第二节课上课中
        iNowClass = 2;
        iNextClass = 3;
    }
    if (oBreakTime2nd < oNowTime && oNowTime < oSchoolTime3rd) {//第二节课下课后第三节课上课前
        iNextClass = 3;
    }
    if (oSchoolTime3rd <= oNowTime && oNowTime <= oBreakTime3rd) {//第三节课上课中
        iNowClass = 3;
        iNextClass = 4;
    }
    if (oBreakTime3rd < oNowTime && oNowTime < oSchoolTime4th) {//第三节课下课后第四节课上课前
        iNextClass = 4;
    }
    if (oSchoolTime4th <= oNowTime && oNowTime <= oBreakTime4th) {//第四节课上课中
        iNowClass = 4;
        iNextClass = 5;
    }
    if (oBreakTime4th < oNowTime && oNowTime < oSchoolTime5th) {//第四节课下课后第五节课上课前
        iNextClass = 5;
    }
    if (oSchoolTime5th <= oNowTime && oNowTime <= oBreakTime5th) {//第五节课上课中
        iNowClass = 5;
    }
    //判断星期
    var iWeekNumber = oNowDate.getDay();//获取周次
    var iNowWeek = 0;
    switch (iWeekNumber) {
        case 0:
            iNowWeek = 7;
            break;
        case 1:
            iNowWeek = 1;
            break;
        case 2:
            iNowWeek = 2;
            break;
        case 3:
            iNowWeek = 3;
            break;
        case 4:
            iNowWeek = 4;
            break;
        case 5:
            iNowWeek = 5;
            break;
        case 6:
            iNowWeek = 6;
            break;
    }

    //制作ID标签 iNowWeek iNowClass
    var sNowClassTag = getClassTag(iWeekNumber, iNowClass);
    var sNextClassTag = getClassTag(iWeekNumber, iNextClass);

    //修改当前课程背景颜色
    $(sNowClassTag).parent('.class').css("backgroundColor", "#CCFF99");
    //修改下一节课课程背景颜色
    if (iNextClass <= 5) {
        $(sNextClassTag).parent('.class').css("backgroundColor", "#FFCCCC");
    }
}
