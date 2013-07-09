	var editorContainer = document.getElementById('editor');
	var editor = ace.edit(editorContainer);
	editor.setTheme("ace/theme/monokai");
	editor.getSession().setUseWorker(false);
	editor.getSession().setMode("ace/mode/python");
	editor.setPrintMarginColumn(false);
