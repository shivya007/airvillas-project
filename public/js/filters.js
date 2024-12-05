let filtersBox = document.querySelector(".filters");
let buttonSlide = document.querySelectorAll("#slideButton");


buttonSlide.forEach((button) => {
	button.addEventListener("click", () => {
		const direction = button.className === "leftbtn" ? -1 : 1;
		const scrollImg = direction * (filtersBox.clientWidth - 100);  // calculate with with which amount it scrolls left or right
		filtersBox.scrollBy({ left: scrollImg, behavior: "smooth" }); //   calls scrollBy to scroll the container smoothly in the desired direction
	});
});
