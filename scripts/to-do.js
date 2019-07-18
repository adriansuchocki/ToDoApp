var taskNameVal = "";
var taskPriorityVal = "";
var rowClassColor = "";
var rowTable = "";
const sortSpan = "<span class=\"fui-triangle-up-small\"></span>";

$( document ).ready(function() {
  for (var i = 0; i < localStorage.length; i++) {
    taskNameVal = localStorage.key(i);
    taskPriorityVal = localStorage.getItem(taskNameVal);
    switch(taskPriorityVal){
      case 'High':
        rowClassColor = "table-danger";
        break;
      case 'Mid':
        rowClassColor = "table-warning";
        break;
      case 'Low':
        rowClassColor = "table-success";
        break;
    }
    rowTable = "<tr class='" + rowClassColor + "'><td>" + taskNameVal + "</td><td>" + taskPriorityVal + "</td><td scope=\"row\"><button type=\"button\" class=\"btn btn-block btn-sm btn-default\" >Delete</button></td></tr>";
    $('tbody').append(rowTable);
  }
});

function addTask() {
  if (checkValidation()) {
    taskNameVal = $("#taskName").val();
    taskPriorityVal = $("#taskPriority option:selected").text();
    if (localStorage.getItem(taskNameVal) == null) {
      localStorage.setItem(taskNameVal, taskPriorityVal);
      switch(taskPriorityVal){
        case 'High':
          rowClassColor = "table-danger";
          break;
        case 'Mid':
          rowClassColor = "table-warning";
          break;
        case 'Low':
          rowClassColor = "table-success";
          break;
      }
      rowTable = "<tr class='" + rowClassColor + "'><td>" + taskNameVal + "</td><td>" + taskPriorityVal + "</td><td scope=\"row\"><button type=\"button\" class=\"btn btn-block btn-sm btn-default\" >Delete</button></td></tr>";
      $('tbody').append(rowTable);
    } else {
      alert('Task exist');
    }
  }
}

function checkValidation(){
  const taskValue = $("#taskName").val();
  const errorTaskName = "<div class=\"form-error col-sm\"><small class=\"text-danger\">Must be minimum 3 characters.</small></div>";
  $("#taskName").removeClass('is-invalid');
  $('.form-error').remove();
  if(taskValue.length < 3){
    $("#taskName").addClass('is-invalid');
    $("#colTaskName").append(errorTaskName);
    return false;
  }
  return true;
}

$('.table tbody').on('click', '.btn', function(){
  let currow = $(this).closest('tr');
  let taskNameVal = currow.find('td:eq(0)').text();
  currow.remove();
  localStorage.removeItem(taskNameVal);
})

function sortTable(column, type) {

  var order = $('.table thead tr>th:eq(' + column + ')').data('order');
  order = order === 'ASC' ? 'DESC' : 'ASC';
  $('.table thead tr>th:eq(' + column + ')').data('order', order);

  $('.table tbody tr').sort(function(a, b) {

    a = $(a).find('td:eq(' + column + ')').text();
    b = $(b).find('td:eq(' + column + ')').text();

    return order === 'ASC' ? a.localeCompare(b) : b.localeCompare(a);
  }).appendTo('.table tbody');
}

$('#taskNameCol').click(function() {
  sortTable(0, 'text');
  if($('#taskNameCol').has('span').length == 0) {
    $("#taskNameCol").append(sortSpan);
  } else {
    let sortClass = $('#taskNameCol > span');
    if (sortClass.attr('class') == 'fui-triangle-down-small') {
      sortClass.removeClass();
      sortClass.addClass('fui-triangle-up-small');
    } else {
      sortClass.removeClass();
      sortClass.addClass('fui-triangle-down-small');
    }
  }
  $('#taskPriorityCol > span').remove();
});
$('#taskPriorityCol').click(function() {
  sortTable(1, 'text');
  if($('#taskPriorityCol').has('span').length == 0) {
    $("#taskPriorityCol").append(sortSpan);
  } else {
    let sortClass = $('#taskPriorityCol > span');
    if (sortClass.attr('class') == 'fui-triangle-down-small') {
      sortClass.removeClass();
      sortClass.addClass('fui-triangle-up-small');
    } else {
      sortClass.removeClass();
      sortClass.addClass('fui-triangle-down-small');
    }
  }
  $('#taskNameCol > span').remove();
});
