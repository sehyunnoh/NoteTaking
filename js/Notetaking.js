let data = [];
let noteCnt;
let selectedNote;
let mode = "Add";
if(localStorage.data){
    makeHistory();
}

window.addEventListener("DOMContentLoaded", function() {
if(sessionStorage.getItem("name") != null){
  $("#header").html(sessionStorage.getItem("name")+"'s Note");
}

  changeButton("Add");
    
  // Save button. data will be stored to localstorage.
  $("#save").click(function() {
    if(localStorage.data){
        data = JSON.parse(localStorage.data);
    }

    if(!$("#title").val() || !$("#date").val() || !$("#contents").val()){
        alert("empty field is not allowed");
        return false;
    }

    const titleVal = $("#title").val();
    const dateVal = $("#date").val();
    const contentsVal = $("#contents").val();
    const colorVal = $("#color").val();

    data.push({
      title: titleVal,
      date: dateVal,
      contents: contentsVal,
      color: colorVal
    });

    localStorage.setItem("data", JSON.stringify(data));
    addNote(titleVal, dateVal, contentsVal, colorVal);
  });

  // Search button
  $("#btnSearch").click(function(){
    makeHistory($("#txtSearch").val());
  });

  // All button
  $("#btnAll").click(function(){
    makeHistory();
    $("#txtSearch").val('');
  })

  // + button 
  $("#new").click(function(){
    changeButton("Add");
    refresh();
  })

  // Edit button
  $("#edit").click(function(){
    const titleVal = $("#title").val();
    const dateVal = $("#date").val();
    const contentsVal = $("#contents").val();
    const colorVal = $("#color").val();
    
    let tmp = {
      title: titleVal,
      date: dateVal,
      contents: contentsVal,
      color: colorVal
    };
    
    data = JSON.parse(localStorage.data);
    data[selectedNote] = tmp;
    localStorage.setItem("data", JSON.stringify(data));
    makeHistory();
    changeButton("Add");
    refresh();
  });

  // Delete button
  $("#delete").click(function(){
    changeButton("Add");
    refresh();
    data = JSON.parse(localStorage.data);
    data.splice(selectedNote,1);
    localStorage.setItem("data", JSON.stringify(data));
    makeHistory();
  });

});

// add one note data
function addNote(title, date, contents, color){
    $("ul").append(
        "<li id='note"+noteCnt+"' class='list-group-item d-flex justify-content-between' onClick='displayData(\""+noteCnt+"\")' >" +
          "<div style='background: "+color+"; width:20px'></div>" +
          "<div>" +
          "<h6 class='my-0'>"+contentsLengthAdjust(title)+"</h6>" +
          "<small>"+contentsLengthAdjust(contents)+"</small>" +
          "</div>" +
          "<span class='text-muted'>"+date+"</span>" +
          "</li>"
      );

      $("#noteCnt").text(noteCnt++);
}

// display note history
function makeHistory(search) {
  data = JSON.parse(localStorage.data);
  noteCnt=data.length;
  var displayCnt = 0;
  $("ul").empty();

  for (let i = 0; i < data.length; i++) {
    if(search){
        var tmpSearch = new RegExp(".*"+search+".*", "i");
        if(!tmpSearch.test(data[i]['title'])){
            continue;
        }
    }

    $("ul").append(
      "<li id='note"+i+"' class='list-group-item d-flex justify-content-between' onClick='displayData(\""+i+"\")'>" +
        "<div style='background: "+data[i]['color']+"; width:20px'></div>" +
        "<div>" +
        "<h6 class='my-0'>"+contentsLengthAdjust(data[i]['title'])+"</h6>" +
        "<small>"+contentsLengthAdjust(data[i]['contents'])+"</small>" +
        "</div>" +
        "<span class='text-muted'>"+data[i]['date']+"</span>" +
        "</li>"
    );

    displayCnt++;
  }

  $("#noteCnt").text(displayCnt);
}

// if contents too long, cut the length at the preview display
function contentsLengthAdjust(contents){
    return contents.length > 35 ? contents.substr(0,31)+"..." : contents;
}

// when select the note
function displayData(noteId){
  selectedNote = Number(noteId);
  mode = "Edit";
  data = JSON.parse(localStorage.data);
  var tmp = {}
  tmp = data[Number(noteId)];

  $('ul').find('li').each(function(){
    $(this).removeClass("selected");
  });

  $("#note"+noteId).addClass("selected");

  $("#title").val(tmp.title);
  $("#date").attr("value", tmp.date);
  $("#contents").val(tmp.contents);
  $("#color").val(tmp.color);

  changeButton(mode);
}

// button change dynamically
function changeButton(mode){
  if(mode == "Edit"){
    $("#save").addClass("hide");
    $("#new").removeClass("hide");
    $("#edit").removeClass("hide");
    $("#delete").removeClass("hide");
  }else if(mode == "Add"){
    $("#save").removeClass("hide");
    $("#new").addClass("hide");
    $("#edit").addClass("hide");
    $("#delete").addClass("hide");
  }
}

// refresh function
function refresh(){
  $("#title").val('');
  $("#date").val('');
  $("#contents").val('');
  $("#color").val('#000000');

  $('ul').find('li').each(function(){
    $(this).removeClass("selected");
  });
}