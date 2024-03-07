console.log("base.js loaded ...");

/** document selectors */
var newListButton = document.getElementById("newListButton");
var sections = document.querySelectorAll("section");

/** global variables */
var currentSection = 0;

/** new event listener for `newListButton */
newListButton.addEventListener("click", function ()
{
	const newList = document.createElement("figure");
	const listTitle = document.createElement("h1");
	listTitle.innerHTML = ("your list");

	newList.append(listTitle);

	const section = sections[(currentSection++ % 3)];
	section.append(newList);
	console.log(typeof(section));
	console.log("hello you stinky people");
});
