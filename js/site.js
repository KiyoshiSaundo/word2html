var elTextIn      = document.getElementById('inText');
var elTextOut     = document.getElementById('outText');
var elExample     = document.getElementById('exampleText');
var btnWordToHtml = document.getElementById('word2html');
var btnReset      = document.getElementById('reset');

var btnTest = document.getElementById('test-load');
var testName = document.getElementById('test-name');

btnWordToHtml.onclick = function(event) {
	event.preventDefault();
	processText(elTextIn.innerHTML);
};

btnReset.onclick = function(event) {
	event.preventDefault();
	clearText();
};

btnTest.onclick = function(event) {
	event.preventDefault();
	loadTest(testName.value);
}

function clearText() {
	console.info('--- clear');
	elTextIn.innerHTML  = '';
	elTextOut.innerHTML = '';
	elExample.innerHTML = '';
}

function processText(str) {
	startProcess()
		.then(removeAttributes)
		.then(removeTrash)
		.then(removeBreaks)
		.then(removeEmptyTags)
		.then(handleHtmlEntity)
		.then(doubleTags)
		.then(handleLists)
		.then(formatStr)
		.then(endProcess);

	function startProcess() {
		return new Promise(function(resolve, reject) {
			console.info('=== startProcess');
			return resolve();
		});
	}

	function endProcess() {
		console.info('=== endProcess');
		elTextOut.innerHTML = str;
		elExample.innerHTML = str;
	}

	// style, class...
	function removeAttributes() {
		return new Promise(function(resolve, reject) {
			console.info('>>> removeTrash');
			// console.log(str);

			str = str.replace(/\ style=[\'\"][^\'\"]*[\'\"]/gim, "")
			         .replace(/\ class=[\'\"][^\'\"]*[\'\"]/gim, "")
			         .replace(/\ lang=[\'\"][^\'\"]*[\'\"]/gim, "")
			         .replace(/\ type=[\'\"][^\'\"]*[\'\"]/gim, "");

			// console.log(str);
			return resolve();
		});
	}

	// span, div, o:p, комментарии
	function removeTrash() {
		return new Promise(function(resolve, reject) {
			console.info('>>> removeTrash');
			// console.log(str);

			str = str.replace(/<o:p><\/o:p>/gi, "")
			         .replace(/<\/?span>/gi, "")
			         .replace(/<\/?div>/gi, "")
			         .replace(/<!--\[if\ !supportAnnotations\]-->[^!]*<!--\[endif\]-->/gi, '')
			         .replace(/<!--.*-->/gi, '');

			// console.log(str);
			return resolve();
		});
	}

	// текст в одну строку
	function removeBreaks() {
		return new Promise(function(resolve, reject) {
			console.info('>>> removeBreaks');
			// console.log(str);

			str = str.replace(/[\r\n,\n\r,\r,\n,\t,\0]+/gi, " ");

			// console.log(str);
			return resolve();
		});
	}

	// пустые теги
	function removeEmptyTags() {
		return new Promise(function(resolve, reject) {
			console.info('>>> removeTrash');
			// console.log(str);

			str = str.replace(/<[A-z]*>(\ *)<\/[A-z]*>/gi, "$1");

			// console.log(str);
			return resolve();
		});
	}

	// html-сущности
	function handleHtmlEntity() {
		return new Promise(function(resolve, reject) {
			console.info('>>> handleHtmlEntity');
			// console.log(str);

			str = str.replace(/&quot;/gi, "\"")
			         .replace(/&nbsp;/gi, " ");

			// console.log(str);
			return resolve();
		});
	}

	// идущие подряд b, i
	function doubleTags() {
		return new Promise(function(resolve, reject) {
			console.info('>>> doubleTags');
			// console.log(str);

			str = str.replace(/<\/b>\ *<b>/gi, "")
			         .replace(/<\/strong>\ *<strong>/gi, "")
			         .replace(/<\/i>\ *<i>/gi, "")
			         .replace(/<\/em>\ *<em>/gi, "")
			         ;

			// console.log(str);
			return resolve();
		});
	}

	// списки
	function handleLists() {
		return new Promise(function(resolve, reject) {
			console.info('>>> handleLists');
			// console.log(str);

			// маркированные списки
			// стираем все <ul>
			str = str.replace(/<\/?ul>/gi, "");
			// заменяем word'ие списки на html'ые
			str = str.replace(/<p>(((?!<\/p>).)*)(•|·)(((?!<\/p>).)*)<\/p>/gi, "<li>$1$4</li>")
			// оборачиваем каждый li в ul
			str = str.replace(/(<li>((?!<\/li>).)*<\/li>)/gi, "<ul>$1</ul>");
			// удаляем комбинации </ul><ul>, чтобы получить блоки списков
			str = str.replace(/<\/ul>\ *<ul>/gi, "");

			// нумерованные списки
			str = str.replace(/<\/?ol>/gi, "");
			str = str.replace(/<p>(((?!<\/p>).)*)(\d\))(((?!<\/p>).)*)<\/p>/gi, "<li-num>$1$4</li-num>")
			str = str.replace(/(<li-num>((?!<\/li-num>).)*<\/li-num>)/gi, "<ol>$1</ol>");
			str = str.replace(/<\/ol>\ *<ol>/gi, "");
			str = str.replace(/<li-num>/gi, "<li>");
			str = str.replace(/<\/li-num>/gi, "</li>");

			// console.log(str);
			return resolve();
		});
	}

	// форматирум результат
	function formatStr(){
		return new Promise(function(resolve, reject) {
			console.info('>>> formatStr');
			// console.log(str);

			str = str.replace(/<\/p>/gi, "</p>\r\n") // перенос после </p>
			         .replace(/<\/li>/gi, "</li>\r\n") // перенос после </li>
			         .replace(/<li>/gi, "\t<li>") // отступы для <li>
			         .replace(/<ul>/gi, "<ul>\r\n") // перенос после <ul>
			         .replace(/<ol>/gi, "<ol>\r\n") // перенос после <ol>
			         .replace(/<\/ul>/gi, "</ul>\r\n")  // перенос после </ul>
			         .replace(/\ {2,}/gi, " ") // множественные пробелы
					 .replace(/<p>\ */gi, '<p>') // пробелы в начале <p>
					 .replace(/<li>\ */gi, '<li>') // пробелы в начале <li>
			         .replace(/^\ */gim, ''); // пробелы в начале строк

			// console.log(str);
			return resolve();
		});
	}
}

function loadTest(name) {
	var text = document.getElementById(name).innerHTML;
	elTextIn.innerHTML = text;
}