var taskNameVal = '';
var taskPriorityVal = '';
var rowClassColor = '';
var rowTable = '';
var selectOpition = '';
const ROW_DANGER = 'table-danger';
const ROW_WARNING = 'table-warning';
const ROW_SUCCESS = 'table-success';
const SORT_ASC = 'fui-triangle-up-small';
const SORT_DESC = 'fui-triangle-down-small';
const SORT_SPAN = 'fui-triangle-right-large';
const DEFAULT_PRIORITY = 'Low';

$( document ).ready(function() {
  for (var i = 0; i < localStorage.length; i++) {
    taskNameVal = localStorage.key(i);
    taskPriorityVal = localStorage.getItem(taskNameVal);
    tableOperation.addRowToTable(taskNameVal, taskPriorityVal);
  }
  $.get( "https://my-json-server.typicode.com/typicode/demo/comments", function( data ) {
    for(var task in data){
      selectOpition = '<option>'+data[task].id+'</option>'
      $('#externalTaskList').append(selectOpition);
    }
  });

  $('#welcomeModal').modal('show');
});

var taskMenu = {};

taskMenu.addTask = function() {
  if (taskMenu.checkValidation()) {
    taskNameVal = $('#taskName').val();
    taskPriorityVal = $('#taskPriority option:selected').text();
    taskMenu.addTaskToTable(taskNameVal, taskPriorityVal, taskMenu.addTaskSuccessfully);
  }
}

taskMenu.addTaskFromList = function(){
  taskNameVal = $('#externalTaskList option:selected').text();
  taskMenu.addTaskToTable(taskNameVal, DEFAULT_PRIORITY, taskMenu.addTaskSuccessfully);
}

taskMenu.addTaskToTable = function(taskName, taskPriority, callback){
  if (localStorage.getItem(taskName) == null) {
    localStorage.setItem(taskName, taskPriority);
    tableOperation.addRowToTable(taskName, taskPriority);
    callback();
  } else {
    alert('Task ' + taskName + ' exist');
  }
}

taskMenu.importTaskToTable = function(taskName, taskPriority){
  if (localStorage.getItem(taskName) == null) {
    localStorage.setItem(taskName, taskPriority);
    tableOperation.addRowToTable(taskName, taskPriority);
  }
}

taskMenu.addTaskSuccessfully = function(){
  alert('Task added successfully');
}

taskMenu.checkValidation = function(){
  const taskValue = $('#taskName').val();
  const errorTaskName = '<div class="form-error col-sm"><small class="text-danger">Must be minimum 3 characters.</small></div>';
  $('#taskName').removeClass('is-invalid');
  $('.form-error').remove();
  if(taskValue.length < 3){
    $('#taskName').addClass('is-invalid');
    $('#colTaskName').append(errorTaskName);
    return false;
  }
  return true;
}

var tableOperation = {};

tableOperation.addRowToTable = function(taskName, priority){
  switch(priority){
    case 'High':
      rowClassColor = ROW_DANGER;
      break;
    case 'Mid':
      rowClassColor = ROW_WARNING;
      break;
    case 'Low':
      rowClassColor = ROW_SUCCESS;
      break;
  }
  rowTable = '<tr class="' + rowClassColor + '"><td>' + taskName + '</td><td>' + priority + '</td><td scope="row"><button type="button" class="btn btn-block btn-sm btn-default" onclick="tableOperation.deleteRow(this)">Delete</button></td></tr>';
  $('tbody').append(rowTable);
}

tableOperation.filterResults = function(){
  const taskFilterNameVal = $('#taskNameFilter').val();
  const taskFilterPriorityVal = $('#taskPriorityFilter option:selected');
  if(taskFilterNameVal.length > 2 && taskFilterPriorityVal.val() > 0){
    tableOperation.filterRows(taskFilterNameVal, taskFilterPriorityVal.text());
  } else if(taskFilterNameVal.length > 2){
    tableOperation.filterRows(taskFilterNameVal, '');
  } else if(taskFilterPriorityVal.val() > 0){
    tableOperation.filterRows('', taskFilterPriorityVal.text());
  } else{
    tableOperation.filterRows('', '');
  }
}

tableOperation.filterRows = function(taskFilterName, taskFilterPriorityVal){
  tableOperation.clearOnlyTable();
  for (var i = 0; i < localStorage.length; i++) {
    taskNameVal = localStorage.key(i);
    taskPriorityVal = localStorage.getItem(taskNameVal);
    if ((taskNameVal.indexOf(taskFilterName) != -1) && taskFilterName != '' && (taskPriorityVal.indexOf(taskFilterPriorityVal) != -1) && taskFilterPriorityVal != ''){
      console.log("Robie");
      tableOperation.addRowToTable(taskNameVal, taskPriorityVal);
    } else if((taskNameVal.indexOf(taskFilterName) != -1) && taskFilterName != '' && taskFilterPriorityVal == ''){
      console.log("Robie2");
      tableOperation.addRowToTable(taskNameVal, taskPriorityVal);
    } else if((taskPriorityVal.indexOf(taskFilterPriorityVal) != -1) && taskFilterPriorityVal != '' && taskFilterName == ''){
      console.log("Robie3");
      tableOperation.addRowToTable(taskNameVal, taskPriorityVal);
    } else if(taskFilterName == '' && taskFilterPriorityVal == ''){
      console.log("Robie4");
      tableOperation.addRowToTable(taskNameVal, taskPriorityVal);
    }
  }
}

tableOperation.deleteRow = function(objButton){
  let rowToDelete = objButton.parentNode.parentNode;
  let taskNameVal = rowToDelete.firstChild.firstChild.nodeValue;
  localStorage.removeItem(taskNameVal);
  rowToDelete.remove();

}

tableOperation.clearTable = function(){
  $('.table tbody').empty();
  localStorage.clear();
}

tableOperation.clearOnlyTable = function(){
  $('.table tbody').empty();
}

tableOperation.sortTable = function(column, type) {

  var order = $('.table thead tr>th:eq(' + column + ')').data('order');
  order = order === 'ASC' ? 'DESC' : 'ASC';
  $('.table thead tr>th:eq(' + column + ')').data('order', order);

  $('.table tbody tr').sort(function(a, b) {

    a = $(a).find('td:eq(' + column + ')').text();
    b = $(b).find('td:eq(' + column + ')').text();

    return order === 'ASC' ? a.localeCompare(b) : b.localeCompare(a);
  }).appendTo('.table tbody');
}

tableOperation.clickOnSort = function(indexColumn, columnNameToSort, columnName){
  tableOperation.sortTable(indexColumn, 'text');
  let sortClass = $('#'+columnNameToSort + ' > span');
  if (sortClass.attr('class') == SORT_DESC) {
    sortClass.removeClass();
    sortClass.addClass(SORT_ASC);
  } else {
    sortClass.removeClass();
    sortClass.addClass(SORT_DESC);
  }
  $('#'+columnName + ' > span').removeClass();
  $('#'+columnName + ' > span').addClass(SORT_SPAN);
}

tableOperation.importFile = function(fileUpload){
  if(typeof fileUpload.files[0] != "undefined" ) {
    if($('#checkbox')[0].checked){
      tableOperation.clearTable();
    }
    file = fileUpload.files[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (event) {
      var object = JSON.parse(event.target.result);
      for (var task in object) {
        taskMenu.importTaskToTable(task, object[task]);
      }
    }
  }
}

tableOperation.exportToFile = function(){
  const generatedFile = JSON.stringify(localStorage, null, '\t');
  const filename = 'todo.json';
  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(generatedFile));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
